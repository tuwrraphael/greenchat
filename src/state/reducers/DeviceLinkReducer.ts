import { Reducer } from "../lib/Reducer";
import { DeviceLinkState } from "../State";
import { DeviceLinkActions, DeviceLinkActionNames } from "../actions/DeviceLinkActionCreator";
import { DeviceLinkStatus } from "../../device-linking/DeviceLinkStatus";

export class DeviceLinkReducer implements Reducer<DeviceLinkState, DeviceLinkActions> {
    onDispatch(action: DeviceLinkActions, updateStore: (a: (s: DeviceLinkState) => DeviceLinkState) => void): void {
        switch (action.type) {
            case DeviceLinkActionNames.DeviceLinkingInitialized:
                updateStore((s) => {
                    return {
                        ...s,
                        inviteCode: null,
                        deviceLinkStatus: DeviceLinkStatus.Initialized
                    };
                });
                break;
            case DeviceLinkActionNames.DeviceLinkChannelInitialized:
                updateStore((s) => {
                    return {
                        ...s,
                        inviteCode: `["${action.connectionId}","${action.identitySigningPublicKey}"]`,
                        deviceLinkStatus: DeviceLinkStatus.Started
                    };
                });
                break;
            case DeviceLinkActionNames.DeviceLinkStatusChanged:
                updateStore((s) => {
                    return {
                        ...s,
                        deviceLinkStatus: action.status
                    };
                });
                break;
        }
    }
}