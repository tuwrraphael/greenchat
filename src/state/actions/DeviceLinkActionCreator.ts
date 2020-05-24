import { Store } from "../Store";
import { Action } from "../lib/Action";
import { DeviceLinkStatus } from "../../models/DeviceLinkStatus";
import { DeviceLinkService } from "../../device-linking/DeviceLinkService";

export enum DeviceLinkActionNames {
    DeviceLinkChannelInitialized = "DeviceLinkChannelInitialized",
    DeviceLinkStatusChanged = "DeviceLinkStatusChanged"
}

export class DeviceLinkChannelInitialized implements Action {
    readonly type = DeviceLinkActionNames.DeviceLinkChannelInitialized;
    constructor(public connectionId: string, public identitySigningPublicKey: string) {

    }
}

export class DeviceLinkStatusChanged implements Action {
    readonly type = DeviceLinkActionNames.DeviceLinkStatusChanged;
    constructor(public status: DeviceLinkStatus) {

    }
}

export type DeviceLinkActions = DeviceLinkChannelInitialized | DeviceLinkStatusChanged;

export class DeviceLinkActionCreator {
    constructor(private store: Store, private deviceLinkingService: DeviceLinkService) {
    }

    async startDeviceLinking() {
        let res = await this.deviceLinkingService.startDeviceLinking();
        this.store.dispatch(new DeviceLinkChannelInitialized(res.connectionId,
            res.identitySigningPublicKey));
    }

    async linkDevice(inviteCode: string) {
        try {
            await this.deviceLinkingService.linkDevice(inviteCode);
        }
        catch (err) {
            this.store.dispatch(new DeviceLinkStatusChanged(DeviceLinkStatus.Error));
        }
    }
}