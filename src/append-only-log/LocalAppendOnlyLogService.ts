import { LocalAppendOnlyLog } from "./LocalAppendOnlyLog";
import { MessageEncoder } from "../message-encoding/MessageEncoder";
import { LogPersistence } from "./LogPersistence";

export class LocalAppendOnlyLogService {
    constructor(private persistence: LogPersistence, private messageFactory: MessageEncoder) {
    }
    async appendOnlyLogCreated() {
        return await this.persistence.hasAppendOnlyLog("local");
    }
    async create() {
        let logId = "local";
        let keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
        await this.persistence.createAppendOnlyLog(logId, keyPair.publicKey, keyPair.privateKey);
        let localAppendOnlyLog = new LocalAppendOnlyLog(keyPair.privateKey, "local", 0, this.persistence);
        await localAppendOnlyLog.addMessage(this.messageFactory.encodePublicKeyMessage(keyPair.publicKey));
    }
    async get() {
        let appendOnlyLog = await this.persistence.getAppendOnlyLog("local");
        return new LocalAppendOnlyLog(appendOnlyLog.privateKey, "local", appendOnlyLog.sequence, this.persistence);
    }
}
