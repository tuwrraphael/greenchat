import { shortUuid } from "../utils/short-uuid";

export class ConversationInvitationFactory {
    async inviteForNewConversation() {
        const encryptionKey = await crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, false, ["encrypt", "decrypt"]);
        const signingKey = await crypto.subtle.generateKey({
            name: "RSA-PSS",
            modulusLength: 1024,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        }, false, ["sign", "verify"]);
        const conversationId = shortUuid();
        const myId = 0;
        const peerId = 1;
    }
}