import { SignallingClient } from "../webrtc/SignallingClient";
import { DeviceLinkSession } from "./DeviceLinkSession";
import { GreenchatDatabase } from "../database/GreenchatDatabase";
import { uuid } from "../utils/uuid";
import { DeviceLinkIdentity } from "./DeviceLinkIdentity";
import { LinkedDevice } from "./LinkedDevice";
import { LocalAppendOnlyLogService } from "../append-only-log/LocalAppendOnlyLogService";

export class DeviceLinkService {
    private deviceLinkIdentity: DeviceLinkIdentity;
    private linkedDevices: LinkedDevice[];

    constructor(private signallingClient: SignallingClient,
        private db: GreenchatDatabase,
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
        await this.db.storeLinkedDevice(linked);
    }

    async initialize() {
        this.deviceLinkIdentity = await this.db.getDeviceLinkIdentity();
        if (null == this.deviceLinkIdentity) {
            let id = new DeviceLinkIdentity();
            id.id = uuid();
            await this.db.storeDeviceLinkIdentity(id);
        }
        this.linkedDevices = await this.db.getLinkedDevices();
    }
}