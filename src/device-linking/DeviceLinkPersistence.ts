import { DeviceLinkIdentity } from "./DeviceLinkIdentity";
import { LinkedDevice } from "./LinkedDevice";

export interface DeviceLinkPersistence {
    getLinkedDevices(): Promise<LinkedDevice[]>;
    storeLinkedDevice(linked: LinkedDevice): Promise<void>;
    getDeviceLinkIdentity(): Promise<DeviceLinkIdentity>;
    storeDeviceLinkIdentity(id: DeviceLinkIdentity): Promise<void>;
}
