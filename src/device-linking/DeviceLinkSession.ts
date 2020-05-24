import { Identity, PreKeyBundleProtocol, PreKeyMessageProtocol, AsymmetricRatchet, ECPublicKey, MessageSignedProtocol } from "2key-ratchet";
import { toBase64UrlSafe } from "../utils/toBase64UrlSafe";
import { fromBase64UrlSafe } from "../utils/fromBase64UrlSafe";
export class DeviceLinkSession extends EventTarget {
    private readonly MSG_PREKEYBUNDLE = 0;
    private readonly MSG_PREKEY_LOGID = 1;
    private readonly MSG_LOGID = 2;
    private identity: Identity;
    private listener: (m: MessageEvent) => void;
    private asymmetricRatchet: AsymmetricRatchet;
    private otherLogId: string;
    constructor(private rtcDataChannel: RTCDataChannel, private logId: string,
        private identitySigningPublicKey?: string) {
        super();
        this.attachMessageHandler();
    }
    private attachMessageHandler() {
        this.listener = (m: MessageEvent): void => {
            this.onmessage(m.data).catch(err => {
                console.error(err);
            });
        };
        this.rtcDataChannel.addEventListener("message", this.listener);
    }
    async initiate() {
        this.identity = await Identity.create(1, 1);
        let preKeyBundleProtocol = new PreKeyBundleProtocol();
        await preKeyBundleProtocol.identity.fill(this.identity);
        preKeyBundleProtocol.registrationId = this.identity.id;
        const preKey = this.identity.signedPreKeys[0];
        preKeyBundleProtocol.preKeySigned.id = 0;
        preKeyBundleProtocol.preKeySigned.key = preKey.publicKey;
        await preKeyBundleProtocol.preKeySigned.sign(this.identity.signingKey.privateKey);
        let bundleProto = await preKeyBundleProtocol.exportProto();
        if (this.rtcDataChannel.readyState != "open") {
            this.rtcDataChannel.onopen = () => {
                this.sendPreKeyBundle(bundleProto);
            };
        }
        else {
            this.sendPreKeyBundle(bundleProto);
        }
        return { identitySigningPublicKey: toBase64UrlSafe(this.identity.signingKey.publicKey.serialize()) };
    }
    private sendPreKeyBundle(bundle: ArrayBuffer) {
        let msg = new Uint8Array(bundle.byteLength + 1);
        msg[0] = this.MSG_PREKEYBUNDLE;
        msg.set(new Uint8Array(bundle), 1);
        this.rtcDataChannel.send(msg);
    }
    private async sendLogId(isPreKey: boolean) {
        let enc = new TextEncoder();
        let encrypted = await (await this.asymmetricRatchet.encrypt(enc.encode(this.logId))).exportProto();
        let msg = new Uint8Array(encrypted.byteLength + 1);
        msg[0] = isPreKey ? this.MSG_PREKEY_LOGID : this.MSG_LOGID;
        msg.set(new Uint8Array(encrypted), 1);
        this.rtcDataChannel.send(msg);
    }
    private async getOtherLogId(protocol: MessageSignedProtocol) {
        let otherLogIdBytes = await this.asymmetricRatchet.decrypt(protocol);
        let decoder = new TextDecoder();
        this.otherLogId = decoder.decode(otherLogIdBytes);
    }
    private endSession() {
        this.rtcDataChannel.removeEventListener("message", this.listener);
        this.dispatchEvent(new CustomEvent("devicelinksuccess", {
            detail: {
                otherLogId: this.otherLogId,
                asymmetricRatchet: this.asymmetricRatchet
            }
        }));
    }
    private async onmessage(data: ArrayBuffer) {
        let arr = new Uint8Array(data)
        let msgType = arr[0];
        data = arr.subarray(1);
        switch (msgType) {
            case this.MSG_PREKEYBUNDLE: {
                const bundle = await PreKeyBundleProtocol.importProto(data);
                this.identity = await Identity.create(1, 1);
                if (await bundle.preKeySigned.verify(await ECPublicKey.importKey(fromBase64UrlSafe(this.identitySigningPublicKey), "ECDSA"))) {
                    this.asymmetricRatchet = await AsymmetricRatchet.create(this.identity, bundle);
                    await this.sendLogId(true);
                }
                break;
            }
            case this.MSG_PREKEY_LOGID: {
                let preKeyMessageProtocol = await PreKeyMessageProtocol.importProto(data);
                this.asymmetricRatchet = await AsymmetricRatchet.create(this.identity, preKeyMessageProtocol);
                await this.getOtherLogId(preKeyMessageProtocol.signedMessage);
                await this.sendLogId(false);
                this.endSession();
                break;
            }
            case this.MSG_LOGID: {
                let messageSignedProtocol = await MessageSignedProtocol.importProto(data);
                await this.getOtherLogId(messageSignedProtocol);
                this.endSession();
                break;
            }
            default: {
                console.error(`Unknown Device Link Message Type ${msgType}`);
                break;
            }
        }
    }
}
