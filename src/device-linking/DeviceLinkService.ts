import { SignallingClient } from "../webrtc/SignallingClient";
import { DeviceLinkSession } from "./DeviceLinkSession";
import { GreenchatDatabase } from "../database/GreenchatDatabase";
import { uuid } from "../utils/uuid";

export class DeviceLinkIdentity {
    id: string;
}

export class DeviceLinkService {

    constructor(private signallingClient: SignallingClient,
        private db: GreenchatDatabase) {

    }

    async startDeviceLinking() {
        let id = await this.db.getDeviceLinkIdentity();
        let deviceLinkChannel = await this.signallingClient.initializeDeviceLinkChannel(120000);
        let session = new DeviceLinkSession(deviceLinkChannel.rtcDataChannel, id.id, "test-linking-device");
        session.addEventListener("devicelinksuccess", m => {
            console.log("success", m);
        });
        let res = await session.initiate();
        return {
            connectionId: deviceLinkChannel.connectionHandler.connectionId,
            identitySigningPublicKey: res.identitySigningPublicKey
        };
    }

    async linkDevice(inviteCode: string) {
        let id = await this.db.getDeviceLinkIdentity();
        let [connectionId, identitySigningPublicKey]: [string, string] = JSON.parse(inviteCode);
        let deviceLinkChannel = await this.signallingClient.openDeviceLinkChannel(connectionId);
        let session = new DeviceLinkSession(deviceLinkChannel.rtcDataChannel, id.id, "test-new-device", identitySigningPublicKey);
        session.addEventListener("devicelinksuccess", m => {
            console.log("success", m);
        });
    }

    async isInitialized() {
        return await this.db.getDeviceLinkIdentity() != null;
    }

    async initialize() {
        let id = new DeviceLinkIdentity();
        id.id = uuid();
        await this.db.storeDeviceLinkIdentity(id);
    }
}