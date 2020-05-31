import { uuid } from "../utils/uuid";
import { signallingServer } from "./config";
import { PeerConnectionHandler } from "./PeerConnectionHandler";
import { ChannelInitialization } from "./ChannelInitialization";
import { HubConnector, HubController } from "./HubConnector";

export class SignallingClient extends EventTarget {
    private localId: string;
    private handlers: PeerConnectionHandler[];
    private socket: WebSocket;
    private hubConnector: HubConnector;
    private hubController: HubController;

    constructor() {
        super();
        this.localId = uuid();
        this.handlers = [];
        this.hubConnector = new HubConnector(this);
    }

    connect(): Promise<void> {
        return new Promise((resolve) => {
            let self = this;
            let socket = this.socket = new WebSocket(signallingServer);
            socket.onopen = function () {
                socket.send(JSON.stringify({ type: "connected", id: self.localId }));
                this.dispatchEvent(new Event("connected"));
                resolve();
            };
            socket.onerror = function (error) {
                console.log('WebSocket Error ' + error);
                socket.close();
            };
            socket.onclose = function (e) {
                console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
                this.dispatchEvent(new Event("disconnected"));
                setTimeout(function () {
                    self.connect();
                }, 1000);
            }
            socket.onmessage = function (e) {
                let parsed = JSON.parse(e.data);
                switch (parsed.type) {
                    case "connection_initialized":
                        self.handlers.find(v => v.connectionId === parsed.connectionId).acknowledgeInit();
                        break;
                    case "connection_offer":
                        let handlerConnection = self.handlers.find(v => v.connectionId === parsed.connectionId);
                        handlerConnection.setOffer(parsed.offer);
                        break;
                    case "connection_accepted":
                        self.handlers.find(v => v.connectionId === parsed.connectionId)
                            .setAnswer(parsed.answer);
                        break;
                    case "connection_not_found":
                        self.handlers.find(v => v.connectionId === parsed.connectionId)
                            .rejectConenctionRequest("Not found");
                        break;
                    case "new_ice_candidate":
                        self.handlers.find(v => v.connectionId === parsed.connectionId)
                            .addIceCandidate(parsed.candidate);
                        break;
                    case "hubs":
                        self.hubConnector.setHubs(parsed.hubs);
                        break;
                    case "connect_hub":
                        self.hubController.requestConnection(parsed.connectionId);
                    default:
                        break;
                }
            }
        });
    }

    getHubConnector(): HubConnector {
        return this.hubConnector;
    }

    createHub(): HubController {
        this.socket.send(JSON.stringify({ type: "announce_hub" }));
        this.hubController = new HubController(this);
        return this.hubController;
    }

    async initializeDeviceLinkChannel(timeout: number): Promise<ChannelInitialization> {
        let handler = new PeerConnectionHandler(uuid(), this);
        this.addHandler(handler);
        let rtcDataChannel = await handler.initiateChannel(timeout);
        return {
            connectionHandler: handler,
            rtcDataChannel
        };
    }

    async openDeviceLinkChannel(connectionId: string): Promise<ChannelInitialization> {
        let handler = new PeerConnectionHandler(connectionId, this);
        this.addHandler(handler);
        let rtcDataChannel = await handler.openChannel();
        return {
            connectionHandler: handler,
            rtcDataChannel: rtcDataChannel
        };
    }
    requestConnection(connectionId: string) {
        this.socket.send(JSON.stringify({ type: "request_connection", connectionId }));
    }

    sendAnswer(connectionId: string, answer: RTCSessionDescriptionInit) {
        this.socket.send(JSON.stringify({ type: "accept_connection", connectionId, answer }));
    }

    initiateConnection(connectionId: string, timeout: number, offer: RTCSessionDescriptionInit) {
        this.socket.send(JSON.stringify({ type: "initialize_connection", connectionId, timeout, offer }));
    }

    getHubs() {
        this.socket.send(JSON.stringify({ type: "get_hubs" }));
    }

    publishIceCandidate(connectionId: string, candidate: RTCIceCandidateInit) {
        this.socket.send(JSON.stringify({
            type: "new_ice_candidate",
            candidate,
            id: this.localId,
            connectionId: connectionId
        }));
    }

    connectHub(hubId: string, connectionId: string, timeout: number, offer: RTCSessionDescriptionInit) {
        this.socket.send(JSON.stringify({ type: "connect_hub", connectionId, timeout, offer, hubId }));
    }

    addHandler(handler: PeerConnectionHandler) {
        this.handlers.push(handler);
    }
}