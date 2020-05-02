import { LogMessage } from "./LogMessage";
import { fromBase64UrlSafe } from "../utils/fromBase64UrlSafe";
import { toBase64UrlSafe } from "../utils/toBase64UrlSafe";
import { LogPersistence } from "./LogPersistence";
import { digestMessage } from "./digestMessage";

export class RemoteAppendOnlyLog {
    constructor(private verifyKey: CryptoKey, private sequence: number, private logId: string, private persistence: LogPersistence) {
    }
    private async persistMessages(messages: LogMessage[]) {
        await this.persistence.storeMessages(this.logId, messages);
        this.sequence = messages[messages.length].sequence;
    }
    async addMessages(messageStream: () => Generator<LogMessage, void, unknown>) {
        let iter = messageStream();
        let current = iter.next();
        let last = await this.persistence.getLastMessage(this.logId);
        let verifiedMessages: LogMessage[] = [];
        while (!current.done) {
            let currentMsg: LogMessage = <LogMessage>current.value;
            if (currentMsg.hash != last.hash) {
                throw new Error("Message chain hash mismatch");
            }
            let encoded = await digestMessage(last.hash, currentMsg.content, currentMsg.timestamp);
            if (currentMsg.hash != toBase64UrlSafe(encoded.digest)) {
                throw new Error("Message digest mismatch");
            }
            let verified = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, this.verifyKey, fromBase64UrlSafe(currentMsg.signature), encoded.encodedContent);
            if (!verified) {
                throw new Error("Message verification failed");
            }
            verifiedMessages.push(currentMsg);
            current = iter.next();
            last = currentMsg;
        }
        await this.persistMessages(verifiedMessages);
    }
}
