import "idb/with-async-ittr";
import { openDB, IDBPDatabase } from "idb";
import { LogPersistence } from "../append-only-log/LogPersistence";
import { LogMessage } from "../append-only-log/LogMessage";
import { uuid } from "../utils/uuid";
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
        if (null == log.top) {
            return null;
        }
        let msgData = await this.db.get(AppendOnlyLogMessages, log.top);
        return new LogMessage(msgData.content, msgData.hash, msgData.last, msgData.signature, msgData.timestamp, msgData.sequence);
    }
    async storeMessages(logId: string, messages: LogMessage[]): Promise<boolean> {
        let log = await this.db.get(AppendOnlyLogs, logId);
        const tx = this.db.transaction(AppendOnlyLogMessages, "readwrite");
        let { top } = log;
        let sequence = null;
        for (let m of messages) {
            let storeObj = { ...m, logId, id: uuid(), before: top };
            await tx.store.add(storeObj);
            top = storeObj.id;
            sequence = storeObj.sequence;
        }
        await tx.done;
        log.top = top;
        log.sequence = sequence;
        await this.db.put(AppendOnlyLogs, log);
        return true;
    }
    db: IDBPDatabase<unknown>;
    async initialize() {
        this.db = await openDB("greenchat-dbv2", 1, {
            upgrade(db) {
                let store = db.createObjectStore(AppendOnlyLogMessages, { keyPath: "id" });
                store.createIndex("logId", "logId");
                db.createObjectStore(AppendOnlyLogs, { keyPath: "id" });
            },
        });
    }
    async hasAppendOnlyLog(logId: string) {
        return !! await this.db.get(AppendOnlyLogs, logId);
    }
    async createAppendOnlyLog(logId: string, publicKey: CryptoKey, privateKey: CryptoKey) {
        await this.db.add(AppendOnlyLogs, { id: logId, privateKey, publicKey, sequence: 0, top: null });
    }
    async addMessage(logId: string, m: LogMessage) {
        let log = await this.db.get(AppendOnlyLogs, logId);
        let storeObj = { ...m, logId, id: uuid(), before: log.top };
        await this.db.add(AppendOnlyLogMessages, storeObj);
        log.top = storeObj.id;
        log.sequence = storeObj.sequence;
        await this.db.put(AppendOnlyLogs, log);
    }

    async *getAll(logId: string): AsyncGenerator<LogMessage, void, unknown> {
        const index = this.db.transaction(AppendOnlyLogMessages).store.index('logId');
        for await (const cursor of index.iterate(logId)) {
            let item = cursor.value;
            yield new LogMessage(item.content, item.hash, item.last, item.signature, item.timestamp,
                item.sequence);
        }
    }
}
