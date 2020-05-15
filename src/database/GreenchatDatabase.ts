import "idb/with-async-ittr";
import { openDB, IDBPDatabase } from "idb";
import { LogPersistence } from "../append-only-log/LogPersistence";
import { LogMessage } from "../append-only-log/LogMessage";
import { AppendOnlyLogMetadata } from "../append-only-log/AppendOnlyLogMetadata";

const AppendOnlyLogMessages = "AppendOnlyLogMessages";
const AppendOnlyLogs = "AppendOnlyLogs";

export class GreenchatDatabase implements LogPersistence {
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
        this.db = await openDB("greenchat-dbv2", 2, {
            upgrade(db, oldVersion: number, newVersion: number) {
                if ([1, 2].indexOf(oldVersion) > -1 && [2, 3].indexOf(newVersion) > -1) {
                    db.deleteObjectStore(AppendOnlyLogMessages);
                    db.deleteObjectStore(AppendOnlyLogs);
                }
                let store = db.createObjectStore(AppendOnlyLogMessages, { keyPath: ["logId", "hash"] });
                store.createIndex("logId", "logId");
                db.createObjectStore(AppendOnlyLogs, { keyPath: "id" });
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
