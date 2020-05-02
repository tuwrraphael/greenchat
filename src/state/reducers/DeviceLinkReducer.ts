import { Reducer } from "../Reducer";
import { DeviceLinkState } from "../State";
import { DeviceLinkActions, DeviceLinkActionNames } from "../actions/DeviceLinkActionCreator";
import { DeviceLinkStatus } from "../../models/DeviceLinkStatus";

export class DeviceLinkReducer implements Reducer<DeviceLinkState, DeviceLinkActions> {
    onDispatch(action: DeviceLinkActions, updateStore: (a: (s: DeviceLinkState) => DeviceLinkState) => void): void {
        switch (action.type) {
            case DeviceLinkActionNames.DeviceLinkChannelInitialized:
                updateStore((s) => {
                    return {
                        ...s, inviteCode: action.connectionId,
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