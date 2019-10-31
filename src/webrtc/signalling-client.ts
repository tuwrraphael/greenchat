import { signallingServer } from "./config";

export interface SignallingHandler {
    setClient(client: SignallingClient): void;
    addRemoteCandidate(connectionId: string, candidate: RTCIceCandidate): void;
    connectToPeer(peerId: string): void;
    acceptOffer(connectionId: string, offeringPeer: string, offer: RTCSessionDescriptionInit): void;
    acceptAccept(connectionId: string, accept: RTCSessionDescriptionInit): void;
    peerDisconnected(peerId: string): void;
}

export class SignallingClient {
    private socket: WebSocket;

    constructor(private localId: string,
        private handler: SignallingHandler) {
        handler.setClient(this);
    }

    connect() {
        let self = this;
        let socket = this.socket = new WebSocket(signallingServer);
        socket.onopen = function () {
            socket.send(JSON.stringify({ type: "connected", id: self.localId }));
        };
        socket.onerror = function (error) {
            console.log('WebSocket Error ' + error);
            socket.close();
        };
        socket.onclose = function (e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                self.connect();
            }, 1000);
        }
        socket.onmessage = function (e) {
            let parsed = JSON.parse(e.data);
            switch (parsed.type) {
                case "peers":
                    for (var peerId of parsed.peers) {
                        self.handler.connectToPeer(peerId);
                    }
                    break;
                case "offer":
                    var { connectionId, offeringPeer, offer } = parsed;
                    self.handler.acceptOffer(connectionId, offeringPeer, offer);
                    break;
                case "accept":
                    var { connectionId, accept } = parsed;
                    self.handler.acceptAccept(connectionId, accept);
                    break;
                case "new_ice_candidate":
                    var { connectionId, candidate } = parsed;
                    self.handler.addRemoteCandidate(connectionId, candidate);
                    break;
                case "client_left":
                    var { id } = parsed;
                    self.handler.peerDisconnected(id);
                    break;
            }
        }
    }

    sendIceCandidate(candidate: RTCIceCandidate, connectionId: string) {
        this.socket.send(JSON.stringify({
            type: "new_ice_candidate",
            candidate,
            id: this.localId,
            connectionId: connectionId
        }));
    }

    sendOffer(connectionId: string, offer: RTCSessionDescriptionInit, peerId: string) {
        this.socket.send(JSON.stringify({
            type: "offer",
            connectionId: connectionId,
            offer: offer,
            offeringPeer: this.localId,
            acceptingPeer: peerId
        }));
    }

    sendAccept(connectionId: string, accept: RTCSessionDescriptionInit, offeringPeer: string) {
        this.socket.send(JSON.stringify({
            type: "accept",
            connectionId: connectionId,
            accept: accept,
            offeringPeer: offeringPeer,
            acceptingPeer: this.localId
        }));
    }
}