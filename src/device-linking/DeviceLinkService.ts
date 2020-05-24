import { SignallingClient } from "../webrtc/SignallingClient";
import { DeviceLinkSession } from "./DeviceLinkSession";

export class DeviceLinkService {

    constructor(private signallingClient: SignallingClient) {

    }

    async startDeviceLinking() {
        let deviceLinkChannel = await this.signallingClient.initializeDeviceLinkChannel(120000);
        let session = new DeviceLinkSession(deviceLinkChannel.rtcDataChannel, "test-linking-device");
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
        let [connectionId, identitySigningPublicKey]: [string, string] = JSON.parse(inviteCode);
        let deviceLinkChannel = await this.signallingClient.openDeviceLinkChannel(connectionId);
        let session = new DeviceLinkSession(deviceLinkChannel.rtcDataChannel, "test-new-device", identitySigningPublicKey);
        session.addEventListener("devicelinksuccess", m => {
            console.log("success", m);
        });
    }
}