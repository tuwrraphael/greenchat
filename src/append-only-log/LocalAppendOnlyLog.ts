import { LogMessage } from "./LogMessage";
import { toBase64UrlSafe } from "../utils/toBase64UrlSafe";
import { digestMessage } from "./digestMessage";
import { LogPersistence } from "./LogPersistence";

export class LocalAppendOnlyLog {

    constructor(private signingKey: CryptoKey,
        private logId: string,
        private sequence: number,
        private persistence: LogPersistence) {
    }

    async addMessage(content: ArrayBuffer) {
        let beforeDigest;
        if (this.sequence == 0) {
            beforeDigest = "initial";
        }
        else {
            let last = await this.persistence.getLastMessage(this.logId);
            beforeDigest = last.hash;
        }
        let sequence = this.sequence + 1;
        let msg = await this.createLogMessage(content, beforeDigest, sequence);
        await this.persistence.storeMessages(this.logId, [msg]);
        this.sequence = sequence;
    }

    private async createLogMessage(content: ArrayBuffer, beforeDigest: string, sequence: number): Promise<LogMessage> {
        let timestamp = +new Date();
        let encoded = await digestMessage(beforeDigest, content, timestamp);
        let signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, this.signingKey, encoded.encodedContent);
        return new LogMessage(content, toBase64UrlSafe(encoded.digest), beforeDigest, toBase64UrlSafe(signature), timestamp, sequence);
    }

    getAll(): AsyncGenerator<LogMessage, void, unknown> {
        return this.persistence.getAll(this.logId);
    }
}