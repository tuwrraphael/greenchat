import { Store } from "../Store";
import { Action } from "../lib/Action";
import { SignallingClient } from "../../webrtc/SignallingClient";

export enum SignallingActionNames {
    SignallingConnectionChanged = "SignallingConnectionChanged"
}

export class SignallingConnectionChanged implements Action {
    readonly type = SignallingActionNames.SignallingConnectionChanged;
    constructor(public connected: boolean) {

    }
}

export type SignallingActions = SignallingConnectionChanged;

export class SignallingActionCreator {
    constructor(private store: Store, private signallingClient: SignallingClient) {
        this.signallingClient.addEventListener("connected", () => {
            this.store.dispatch(new SignallingConnectionChanged(true));
        });
        this.signallingClient.addEventListener("disconnected", () => {
            this.store.dispatch(new SignallingConnectionChanged(false));
        });
    }

    startSignalling() {
        this.signallingClient.connect();
    }
}