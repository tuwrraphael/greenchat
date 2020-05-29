import { Store } from "../Store";
import { Action } from "../lib/Action";
import { DeviceLinkStatus } from "../../models/DeviceLinkStatus";
import { DeviceLinkService } from "../../device-linking/DeviceLinkService";

export enum DeviceLinkActionNames {
    DeviceLinkingInitialized = "DeviceLinkingInitialized",
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

export class DeviceLinkingInitialized implements Action {
    readonly type = DeviceLinkActionNames.DeviceLinkingInitialized;
    constructor() {

    }
}

export type DeviceLinkActions = DeviceLinkChannelInitialized | DeviceLinkStatusChanged | DeviceLinkingInitialized;

export class DeviceLinkActionCreator {
    constructor(private store: Store, private deviceLinkingService: DeviceLinkService) {
    }

    initializeDeviceLinking() {
        this.store.dispatch(new DeviceLinkingInitialized());
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