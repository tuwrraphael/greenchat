import { SignallingClient } from "../webrtc/SignallingClient";
import { DeviceLinkSession } from "./DeviceLinkSession";
import { uuid } from "../utils/uuid";
import { DeviceLinkIdentity } from "./DeviceLinkIdentity";
import { LinkedDevice } from "./LinkedDevice";
import { LocalAppendOnlyLogService } from "../append-only-log/LocalAppendOnlyLogService";
import { MessageEncryptor } from "../message-encoding/MessageEncryptor";
import { DeviceLinkPersistence } from "./DeviceLinkPersistence";

export class DeviceLinkService {
    private deviceLinkIdentity: DeviceLinkIdentity;
    private linkedDevices: LinkedDevice[];

    constructor(private signallingClient: SignallingClient,
        private persistence: DeviceLinkPersistence,
        private localAppendOnlyLogService: LocalAppendOnlyLogService) {
    }

    async startDeviceLinking() {
        let deviceLinkChannel = await this.signallingClient.initializeDeviceLinkChannel(120000);
        let session = new DeviceLinkSession(deviceLinkChannel.rtcDataChannel, this.deviceLinkIdentity.id, this.localAppendOnlyLogService.getCurrentLogId());
        session.addEventListener("devicelinksuccess", async m => await this.deviceLinkSuccess((m as CustomEvent).detail as LinkedDevice));
        let res = await session.initiate();
        return {
            connectionId: deviceLinkChannel.connectionHandler.connectionId,
            identitySigningPublicKey: res.identitySigningPublicKey
        };
    }

    async linkDevice(inviteCode: string) {
        let [connectionId, identitySigningPublicKey]: [string, string] = JSON.parse(inviteCode);
        let deviceLinkChannel = await this.signallingClient.openDeviceLinkChannel(connectionId);
        let session = new DeviceLinkSession(deviceLinkChannel.rtcDataChannel, this.deviceLinkIdentity.id, this.localAppendOnlyLogService.getCurrentLogId(), identitySigningPublicKey);
        session.addEventListener("devicelinksuccess", async m => await this.deviceLinkSuccess((m as CustomEvent).detail as LinkedDevice));
    }

    async deviceLinkSuccess(d: LinkedDevice) {
        let linked = this.linkedDevices.find(l => d.deviceId == l.deviceId);
        if (linked) {
            linked.updateLink(d);
        } else {
            linked = d;
            this.linkedDevices.push(d);
        }
        await this.persistence.storeLinkedDevice(linked);
    }

    async initialize() {
        this.deviceLinkIdentity = await this.persistence.getDeviceLinkIdentity();
        if (null == this.deviceLinkIdentity) {
            let id = new DeviceLinkIdentity();
            id.id = uuid();
            await this.persistence.storeDeviceLinkIdentity(id);
        }
        this.linkedDevices = await this.persistence.getLinkedDevices();
    }

    getMessageEncryptors(): MessageEncryptor[] {
        return this.linkedDevices.map(l => {
            return {
                encrypt: async payload => {
                    let enc = await l.asymmetricRatchet.encrypt(payload);
                    await this.persistence.storeLinkedDevice(l);
                    return await enc.exportProto();
                }
            };
        });
    }
}