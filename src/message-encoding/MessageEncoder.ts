import { MessageTypes } from "./MessageTypes";
import { MessageModifier } from "./MessageModifier";
import { MessageEncryptor } from "../models/MessageEncryptor";

export class MessageEncoder {
    encodePublicKeyMessage(publicKey: CryptoKey): ArrayBuffer {
        let msg = { publicKey, type: MessageTypes.PublicKey };
        let encoder = new TextEncoder();
        let encoded = encoder.encode(JSON.stringify(msg));
        let res = new Uint8Array(encoded.length + 2);
        new DataView(res.buffer).setInt32(0, MessageModifier.Public, true);
        res.set(encoded, 2);
        return res.buffer;
    }
    async encodeNote(content: string, encryptor: MessageEncryptor): Promise<ArrayBuffer> {
        let msg = { content, type: MessageTypes.Note };
        let encoder = new TextEncoder();
        let encoded = encoder.encode(JSON.stringify(msg));
        let buffer = new Uint8Array(await encryptor.encrypt(encoded));
        let res = new Uint8Array(buffer.length + 2);
        new DataView(res.buffer).setInt32(0, MessageModifier.Public, true);
        res.set(buffer, 2);
        return res.buffer;
    }
}
