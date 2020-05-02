import { Store } from "../Store";
import { Action } from "../Action";
import { SignallingClient } from "../../webrtc/SignallingClient";
import { DeviceLinkStatus } from "../../models/DeviceLinkStatus";

export enum DeviceLinkActionNames {
    DeviceLinkChannelInitialized = "DeviceLinkChannelInitialized",
    DeviceLinkStatusChanged = "DeviceLinkStatusChanged"
}

export class DeviceLinkChannelInitialized implements Action {
    readonly type = DeviceLinkActionNames.DeviceLinkChannelInitialized;
    constructor(public connectionId: string) {

    }
}

export class DeviceLinkStatusChanged implements Action {
    readonly type = DeviceLinkActionNames.DeviceLinkStatusChanged;
    constructor(public status: DeviceLinkStatus) {

    }
}

export type DeviceLinkActions = DeviceLinkChannelInitialized | DeviceLinkStatusChanged;

export class DeviceLinkActionCreator {
    constructor(private store: Store, private signallingClient: SignallingClient) {
    }

    async startDeviceLinking() {
        let deviceLinkChannel = await this.signallingClient.initializeDeviceLinkChannel(120000);
        deviceLinkChannel.connectionHandler.addEventListener("datachannelopen", e => {
            console.log("connected");
        });
        this.store.dispatch(new DeviceLinkChannelInitialized(deviceLinkChannel.connectionHandler.connectionId));
    }

    async linkDevice(connectionId: string) {
        try {
            let deviceLinkChannel = await this.signallingClient.openDeviceLinkChannel(connectionId);
            deviceLinkChannel.connectionHandler.addEventListener("datachannelopen", e => {
                console.log("connected");
            });
        }
        catch (err) {
            this.store.dispatch(new DeviceLinkStatusChanged(DeviceLinkStatus.Error));
        }
    }
}