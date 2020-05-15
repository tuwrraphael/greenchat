import { LocalAppendOnlyLog } from "./LocalAppendOnlyLog";
import { MessageEncoder } from "../message-encoding/MessageEncoder";
import { LogPersistence } from "./LogPersistence";

export class LocalAppendOnlyLogService {
    constructor(private persistence: LogPersistence, private messageEncoder: MessageEncoder) {
    }
    async appendOnlyLogCreated(logId: string) {
        return await this.persistence.hasAppendOnlyLog(logId);
    }
    async create(logId: string) {
        let keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
        await this.persistence.createAppendOnlyLog(logId, keyPair.publicKey, keyPair.privateKey);
        let localAppendOnlyLog = new LocalAppendOnlyLog(keyPair.privateKey, "local", 0, this.persistence, this.messageEncoder);
        await localAppendOnlyLog.addMessage(this.messageEncoder.encodePublicKeyMessage(keyPair.publicKey));
    }
    async get(logId: string) {
        let appendOnlyLog = await this.persistence.getAppendOnlyLog(logId);
        return new LocalAppendOnlyLog(appendOnlyLog.privateKey, logId, appendOnlyLog.sequence, this.persistence, this.messageEncoder);
    }
}
