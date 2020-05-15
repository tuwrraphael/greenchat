import { LogMessage } from "./LogMessage";
import { toBase64UrlSafe } from "../utils/toBase64UrlSafe";
import { digestMessage } from "./digestMessage";
import { LogPersistence } from "./LogPersistence";
import { MessageEncoder } from "../message-encoding/MessageEncoder";
import { RemoteAppendOnlyLog } from "./RemoteAppendOnlyLog";

export class LocalAppendOnlyLog {

    constructor(private signingKey: CryptoKey,
        private logId: string,
        private sequence: number,
        private persistence: LogPersistence,
        private messageEncoder: MessageEncoder) {
    }

    async addMessage(content: ArrayBuffer) {
        let sequence = this.sequence + 1;
        let msg = await this.createLogMessage(content, await this.getPreviousHash(), sequence);
        await this.persistence.storeMessages(this.logId, [msg]);
        this.sequence = sequence;
    }

    async getPreviousHash() {
        if (this.sequence == 0) {
            return "initial";
        }
        else {
            let last = await this.persistence.getLastMessage(this.logId);
            return last.hash;
        }
    }

    private async createLogMessage(content: ArrayBuffer, previousHash: string, sequence: number): Promise<LogMessage> {
        let timestamp = +new Date();
        let encoded = await digestMessage(previousHash, content, timestamp);
        let signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, this.signingKey, encoded.encodedContent);
        return new LogMessage(content, toBase64UrlSafe(encoded.digest), previousHash, toBase64UrlSafe(signature), timestamp, sequence);
    }

    getAll(): AsyncGenerator<LogMessage, void, unknown> {
        return this.persistence.getAll(this.logId);
    }    
}