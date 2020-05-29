import { AsymmetricRatchet, IJsonIdentity, Identity, IJsonRemoteIdentity, RemoteIdentity } from "2key-ratchet";
import { IJsonAsymmetricRatchet } from "2key-ratchet/dist/types/asym_ratchet";

export interface LinkedDeviceJSON {
    deviceId: string;
    logId: string;
    asymmetricRatchet: IJsonAsymmetricRatchet;
    identity: IJsonIdentity;
    remoteIdentity: IJsonRemoteIdentity;
    name: string;
}

export class LinkedDevice {
    deviceId: string;
    logId: string;
    asymmetricRatchet: AsymmetricRatchet;
    name: string;

    updateLink(d: LinkedDevice) {
        this.logId = d.logId;
        this.asymmetricRatchet = d.asymmetricRatchet;
    }

    static async fromJSON(s: LinkedDeviceJSON): Promise<LinkedDevice> {
        let d = new LinkedDevice();
        d.name = s.name;
        d.logId = s.logId;
        d.deviceId = s.deviceId;
        d.asymmetricRatchet = await AsymmetricRatchet.fromJSON(await Identity.fromJSON(s.identity), await RemoteIdentity.fromJSON(s.remoteIdentity),
            s.asymmetricRatchet);
        return d;
    }

    async toJSON(): Promise<LinkedDeviceJSON> {
        return {
            deviceId: this.deviceId,
            logId: this.logId,
            name: this.name,
            asymmetricRatchet: await this.asymmetricRatchet.toJSON(),
            identity: await this.asymmetricRatchet.identity.toJSON(),
            remoteIdentity: await this.asymmetricRatchet.remoteIdentity.toJSON()
        };
    }
}
