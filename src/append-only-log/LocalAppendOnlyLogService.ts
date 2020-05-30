import { LocalAppendOnlyLog } from "./LocalAppendOnlyLog";
import { MessageEncoder } from "../message-encoding/MessageEncoder";
import { LogPersistence } from "./LogPersistence";

export class AppendOnlyLogState {
    currentLogId: string;
}

export class LocalAppendOnlyLogService {
    private appendOnlyLogState: AppendOnlyLogState;

    constructor(private persistence: LogPersistence, private messageEncoder: MessageEncoder) {
    }

    async appendOnlyLogCreated(logId: string) {
        return await this.persistence.hasAppendOnlyLog(logId);
    }

    async getLogId(keyPair: CryptoKeyPair) {
        let jwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
        return jwk.x;
    }

    async create() {
        let keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
        let logId = await this.getLogId(keyPair);
        await this.persistence.createAppendOnlyLog(logId, keyPair.publicKey, keyPair.privateKey);
        let localAppendOnlyLog = new LocalAppendOnlyLog(keyPair.privateKey, logId, 0, this.persistence, this.messageEncoder);
        await localAppendOnlyLog.addMessage(this.messageEncoder.encodePublicKeyMessage(keyPair.publicKey));
        return logId;
    }

    async get(logId: string) {
        let appendOnlyLog = await this.persistence.getAppendOnlyLog(logId);
        return new LocalAppendOnlyLog(appendOnlyLog.privateKey, logId, appendOnlyLog.sequence, this.persistence, this.messageEncoder);
    }

    async requireFirstTimeInit() {
        return null == await this.persistence.getAppendOnlyLogState();
    }

    async initialize() {
        this.appendOnlyLogState = await this.persistence.getAppendOnlyLogState();
        if (null == this.appendOnlyLogState) {
            this.appendOnlyLogState = new AppendOnlyLogState();
            let logId = await this.create();
            this.appendOnlyLogState.currentLogId = logId;
            await this.persistence.storeAppendOnlyLogState(this.appendOnlyLogState);
        }
    }

    getCurrentLogId() {
        return this.appendOnlyLogState.currentLogId;
    }
}
