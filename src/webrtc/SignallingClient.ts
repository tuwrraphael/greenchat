import { uuid } from "../utils/uuid";
import { signallingServer } from "./config";
import { PeerConnectionHandler } from "./PeerConnectionHandler";
import { ChannelInitialization } from "./ChannelInitialization";

export class SignallingClient extends EventTarget {
    private localId: string;
    private handlers: PeerConnectionHandler[];
    private socket: WebSocket;

    constructor() {
        super();
        this.localId = uuid();
        this.handlers = [];
    }

    connect() {
        let self = this;
        let socket = this.socket = new WebSocket(signallingServer);
        socket.onopen = function () {
            socket.send(JSON.stringify({ type: "connected", id: self.localId }));
            this.dispatchEvent(new Event("connected"));
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
                    self.handlers.find(v => v.connectionId === parsed.connectionId)
                        .setOffer(parsed.offer);
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
                default:
                    break;
            }
        }
    }

    async initializeDeviceLinkChannel(timeout: number): Promise<ChannelInitialization> {
        let handler = new PeerConnectionHandler(uuid(), this);
        this.handlers.push(handler);
        await handler.initiateChannel(timeout);
        return {
            connectionHandler: handler
        };
    }

    async openDeviceLinkChannel(connectionId: string): Promise<ChannelInitialization> {
        let handler = new PeerConnectionHandler(connectionId, this);
        this.handlers.push(handler);
        await handler.openChannel();
        return {
            connectionHandler: handler
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

    publishIceCandidate(connectionId: string, candidate: RTCIceCandidateInit) {
        this.socket.send(JSON.stringify({
            type: "new_ice_candidate",
            candidate,
            id: this.localId,
            connectionId: connectionId
        }));
    }
}