import { MessageTypes } from "./MessageTypes";
import { MessageModifier } from "./MessageModifier";
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
    encodeNote(content: string): ArrayBuffer {
        let msg = { content, type: MessageTypes.Note };
        let encoder = new TextEncoder();
        let encoded = encoder.encode(JSON.stringify(msg));
        let res = new Uint8Array(encoded.length + 2);
        new DataView(res.buffer).setInt32(0, MessageModifier.Public, true);
        res.set(encoded, 2);
        return res.buffer;
    }
}
