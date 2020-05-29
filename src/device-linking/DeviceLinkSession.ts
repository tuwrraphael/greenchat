import { Identity, PreKeyBundleProtocol, PreKeyMessageProtocol, AsymmetricRatchet, ECPublicKey, MessageSignedProtocol } from "2key-ratchet";
import { toBase64UrlSafe } from "../utils/toBase64UrlSafe";
import { fromBase64UrlSafe } from "../utils/fromBase64UrlSafe";
export class DeviceLinkSession extends EventTarget {
    private readonly MSG_PREKEYBUNDLE = 0;
    private readonly MSG_PREKEY_LOCALDETAILS = 1;
    private readonly MSG_LOCALDETAILS = 2;
    private identity: Identity;
    private listener: (m: MessageEvent) => void;
    private asymmetricRatchet: AsymmetricRatchet;
    private otherLogId: string;
    private otherDeviceId: string;
    constructor(private rtcDataChannel: RTCDataChannel,
        private deviceId: string,
        private logId: string,
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
    private async sendLocalDetails(isPreKey: boolean) {
        let enc = new TextEncoder();
        let encrypted = await (await this.asymmetricRatchet.encrypt(enc.encode(JSON.stringify({
            deviceId: this.deviceId,
            logId: this.logId
        })))).exportProto();
        let msg = new Uint8Array(encrypted.byteLength + 1);
        msg[0] = isPreKey ? this.MSG_PREKEY_LOCALDETAILS : this.MSG_LOCALDETAILS;
        msg.set(new Uint8Array(encrypted), 1);
        this.rtcDataChannel.send(msg);
    }
    private async getDeviceDetails(protocol: MessageSignedProtocol) {
        let otherLogIdBytes = await this.asymmetricRatchet.decrypt(protocol);
        let decoder = new TextDecoder();
        let payload = decoder.decode(otherLogIdBytes);
        let { deviceId, logId }: { deviceId: string, logId: string } = JSON.parse(payload);
        this.otherLogId = logId;
        this.otherDeviceId = deviceId;
    }
    private endSession() {
        this.rtcDataChannel.removeEventListener("message", this.listener);
        this.dispatchEvent(new CustomEvent("devicelinksuccess", {
            detail: {
                otherLogId: this.otherLogId,
                otherDeviceId: this.otherDeviceId,
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
                    await this.sendLocalDetails(true);
                }
                break;
            }
            case this.MSG_PREKEY_LOCALDETAILS: {
                let preKeyMessageProtocol = await PreKeyMessageProtocol.importProto(data);
                this.asymmetricRatchet = await AsymmetricRatchet.create(this.identity, preKeyMessageProtocol);
                await this.getDeviceDetails(preKeyMessageProtocol.signedMessage);
                await this.sendLocalDetails(false);
                this.endSession();
                break;
            }
            case this.MSG_LOCALDETAILS: {
                let messageSignedProtocol = await MessageSignedProtocol.importProto(data);
                await this.getDeviceDetails(messageSignedProtocol);
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
