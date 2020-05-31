import { Store } from "../Store";
import { Action } from "../lib/Action";
import { SignallingClient } from "../../webrtc/SignallingClient";
import { NoHubsFoundException } from "../../webrtc/NoHubsFoundException";
import { ChannelInitialization } from "../../webrtc/ChannelInitialization";

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

    async startSignalling() {
        await this.signallingClient.connect();
        let connector = this.signallingClient.getHubConnector();
        try {
            let channel = await connector.connectHub();
        }
        catch (e) {
            if (e instanceof NoHubsFoundException) {
                let hub = this.signallingClient.createHub();
                hub.addEventListener("onincomingclient", e => {
                    let channelInitialization: ChannelInitialization = (e as CustomEvent).detail;
                });
            }
        }
    }
}