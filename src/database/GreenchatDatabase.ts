import "idb/with-async-ittr";
import { openDB, IDBPDatabase } from "idb";
import { LogPersistence } from "../append-only-log/LogPersistence";
import { LogMessage } from "../append-only-log/LogMessage";
import { AppendOnlyLogMetadata } from "../append-only-log/AppendOnlyLogMetadata";
import { DeviceLinkIdentity } from "../device-linking/DeviceLinkIdentity";
import { LinkedDevice } from "../device-linking/LinkedDevice";
import { AppendOnlyLogState } from "../append-only-log/LocalAppendOnlyLogService";

const AppendOnlyLogMessages = "AppendOnlyLogMessages";
const AppendOnlyLogs = "AppendOnlyLogs";
const ApplicationSettings = "ApplicationSettings";
const LinkedDevices = "LinkedDevices";

export class GreenchatDatabase implements LogPersistence {
    async storeAppendOnlyLogState(appendOnlyLogState: AppendOnlyLogState): Promise<void> {
        const tx = this.db.transaction(ApplicationSettings, "readwrite");
        await tx.store.put({ currentLogId : appendOnlyLogState.currentLogId, key: "appendOnlyLogState" });
        await tx.done;
    }
    async getAppendOnlyLogState(): Promise<AppendOnlyLogState> {
        let storedState = await this.db.get(ApplicationSettings, "appendOnlyLogState");
        if (null == storedState) {
            return null;
        }
        let model = new AppendOnlyLogState();
        model.currentLogId = storedState.currentLogId;
        return model;
    }
    async getLinkedDevices(): Promise<LinkedDevice[]> {
        let stored = await this.db.getAll(LinkedDevices);
        let devices = (stored).map(d => LinkedDevice.fromJSON(d));
        return Promise.all(devices);
    }
    async storeLinkedDevice(linked: LinkedDevice) {
        let serialized = await linked.toJSON();
        const tx = this.db.transaction(LinkedDevices, "readwrite");
        await tx.store.put(serialized);
        await tx.done;
    }
    async getDeviceLinkIdentity() {
        let storedId = await this.db.get(ApplicationSettings, "deviceLinkIdentity");
        if (null == storedId) {
            return null;
        }
        let model = new DeviceLinkIdentity();
        model.id = storedId.id;
        return model;
    }
    async storeDeviceLinkIdentity(id: DeviceLinkIdentity) {
        const tx = this.db.transaction(ApplicationSettings, "readwrite");
        await tx.store.put({ id: id.id, key: "deviceLinkIdentity" });
        await tx.done;
    }
    async getAppendOnlyLog(logId: string): Promise<AppendOnlyLogMetadata> {
        let log = await this.db.get(AppendOnlyLogs, logId);
        return {
            logId: logId,
            privateKey: log.privateKey,
            publicKey: log.publicKey,
            sequence: log.sequence
        };
    }
    async getLastMessage(logId: string): Promise<LogMessage> {
        let log = await this.db.get(AppendOnlyLogs, logId);
        if (null == log.last) {
            return null;
        }
        let msgData = await this.db.get(AppendOnlyLogMessages, log.last);
        return new LogMessage(msgData.content, msgData.hash, msgData.previous, msgData.signature, msgData.timestamp, msgData.sequence);
    }
    async storeMessages(logId: string, messages: LogMessage[]): Promise<boolean> {
        let log = await this.db.get(AppendOnlyLogs, logId);
        const tx = this.db.transaction(AppendOnlyLogMessages, "readwrite");
        let { last } = log;
        let sequence = null;
        for (let m of messages) {
            let storeObj = { ...m, logId, previous: last };
            await tx.store.add(storeObj);
            last = storeObj.hash;
            sequence = storeObj.sequence;
        }
        await tx.done;
        log.last = last;
        log.sequence = sequence;
        await this.db.put(AppendOnlyLogs, log);
        return true;
    }
    db: IDBPDatabase<unknown>;
    async initialize() {
        this.db = await openDB("greenchat-dbv2", 7, {
            upgrade(db, oldVersion: number, newVersion: number) {
                if (oldVersion < 6) {
                    db.createObjectStore(LinkedDevices, { keyPath: "deviceId" });
                }
                if (oldVersion < 5) {
                    if (oldVersion > 3) {
                        db.deleteObjectStore(ApplicationSettings);
                    }
                    db.createObjectStore(ApplicationSettings, { keyPath: "key" });
                }
                if (oldVersion < 7) {
                    if (oldVersion > 0) {
                        db.deleteObjectStore(AppendOnlyLogMessages);
                        db.deleteObjectStore(AppendOnlyLogs);
                    }
                    let store = db.createObjectStore(AppendOnlyLogMessages, { keyPath: ["logId", "hash"] });
                    store.createIndex("logId", "logId");
                    db.createObjectStore(AppendOnlyLogs, { keyPath: "id" });
                }
            },
        });
    }
    async hasAppendOnlyLog(logId: string) {
        return !! await this.db.get(AppendOnlyLogs, logId);
    }
    async createAppendOnlyLog(logId: string, publicKey: CryptoKey, privateKey: CryptoKey) {
        await this.db.add(AppendOnlyLogs, { id: logId, privateKey, publicKey, sequence: 0, last: null });
    }
    async addMessage(logId: string, m: LogMessage) {
        let log = await this.db.get(AppendOnlyLogs, logId);
        let storeObj = { ...m, logId };
        await this.db.add(AppendOnlyLogMessages, storeObj);
        log.last = storeObj.hash;
        log.sequence = storeObj.sequence;
        await this.db.put(AppendOnlyLogs, log);
    }

    async *getAll(logId: string): AsyncGenerator<LogMessage, void, unknown> {
        const index = this.db.transaction(AppendOnlyLogMessages).store.index('logId');
        for await (const cursor of index.iterate(logId)) {
            let item = cursor.value;
            yield new LogMessage(item.content, item.hash, item.previous, item.signature, item.timestamp,
                item.sequence);
        }
    }
}
