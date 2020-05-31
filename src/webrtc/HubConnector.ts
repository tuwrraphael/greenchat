import { uuid } from "../utils/uuid";
import { PeerConnectionHandler } from "./PeerConnectionHandler";
import { ChannelInitialization } from "./ChannelInitialization";
import { NoHubsFoundException } from "./NoHubsFoundException";
import { SignallingClient } from "./SignallingClient";

export class HubConnector {
    private resolveHubs: () => void;
    private hubs: string[];
    constructor(private signallingClient: SignallingClient) {
    }
    private getHubs(): Promise<string[]> {
        return new Promise((resolve) => {
            this.resolveHubs = () => {
                this.resolveHubs = null;
                resolve(this.hubs);
            };
            this.signallingClient.getHubs();
        });
    }
    async connectHub(): Promise<ChannelInitialization> {
        let hubs = await this.getHubs();
        if (!hubs.length) {
            throw new NoHubsFoundException();
        }
        let hubId = hubs[Math.floor(Math.random() * hubs.length)];
        let handler = new PeerConnectionHandler(uuid(), this.signallingClient);
        this.signallingClient.addHandler(handler)
        let rtcDataChannel = await handler.connectHub(hubId, 120000);
        return {
            connectionHandler: handler,
            rtcDataChannel
        };
    }
    setHubs(hubs: string[]) {
        this.hubs = hubs;
        if (this.resolveHubs) {
            this.resolveHubs();
        }
    }
}

export class HubController extends EventTarget {
    constructor(private signallingClient: SignallingClient) {
        super();
    }

    requestConnection(connectionId: string) {
        let handler = new PeerConnectionHandler(connectionId, this.signallingClient);
        this.signallingClient.addHandler(handler);
        handler.openChannel().then(rtcDataChannel => {
            let i: ChannelInitialization = {
                connectionHandler: handler,
                rtcDataChannel: rtcDataChannel
            };
            this.dispatchEvent(new CustomEvent("onincomingclient", { detail: i }));
        });
    }
}