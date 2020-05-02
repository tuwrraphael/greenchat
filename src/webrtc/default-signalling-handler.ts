import { SignallingHandler, SignallingClient } from "./signalling-client_old";
import { uuid } from "../utils/uuid";
import { PeerHandler } from "./peer-handler";
import { iceConfig } from "./config";

interface Connection {
    rtcConnection: RTCPeerConnection,
    offeringPeer: string,
    acceptingPeer: string,
    channel: RTCDataChannel
}

export class DefaultSignallingHandler implements SignallingHandler {

    setClient(c: SignallingClient) {
        this.client = c;
    }

    private connections: { [id: string]: Connection };
    private client: SignallingClient;

    constructor(private localId: string, private peerHandler: PeerHandler) {
        this.connections = {};
    }

    addRemoteCandidate(connectionId: string, candidate: RTCIceCandidate): void {
        let connection = this.connections[connectionId];
        connection.rtcConnection.addIceCandidate(candidate);
    }

    findConnectionTo(peerId: string): string {
        for (let c in this.connections) {
            if (this.connections[c].acceptingPeer === peerId || this.connections[c].offeringPeer === peerId) {
                return c;
            }
        }
        return null;
    }

    peerDisconnected(peerId: string): void {
        let c = this.findConnectionTo(peerId);
        this.connections[c].rtcConnection.close();
        delete this.connections[c];
    }

    connectToPeer(peerId: string): void {
        if (null != this.findConnectionTo(peerId)) {
            console.warn(`already connected to ${peerId}`);
            return;
        }
        let id = uuid();
        let self = this;
        let rtcConnection = new RTCPeerConnection({ ...iceConfig })
        let connection = this.connections[id] = {
            rtcConnection,
            offeringPeer: this.localId,
            acceptingPeer: peerId,
            channel: rtcConnection.createDataChannel("sendChannel")
        };
        connection.channel.onmessage = function (e) {
            self.peerHandler.onMessage(peerId, e.data, connection.channel)
                .catch(d => console.error(d));
        }
        connection.channel.onopen = function () {
            self.peerHandler.onPeerReady(peerId, connection.channel)
                .catch(d => console.error(d));
        };
        connection.channel.onclose = function () {

        };
        rtcConnection.onicecandidate = function ({ candidate }) {
            if (candidate) {
                self.client.sendIceCandidate(candidate, id);
            }
        };
        rtcConnection.createOffer().then(function (o) {
            self.client.sendOffer(id, o, peerId);
            rtcConnection.setLocalDescription(o);
        });
    }

    acceptOffer(connectionId: string, offeringPeer: string, offer: RTCSessionDescriptionInit): void {
        let self = this;
        let rtcConnection = new RTCPeerConnection({ ...iceConfig })
        let connection = this.connections[connectionId] = {
            rtcConnection,
            offeringPeer: offeringPeer,
            acceptingPeer: this.localId,
            channel: <RTCDataChannel>null
        };
        rtcConnection.ondatachannel = function (e) {
            let sendChannel = connection.channel = e.channel;
            sendChannel.onmessage = function (e) {
                self.peerHandler.onMessage(offeringPeer, e.data, sendChannel)
                    .catch(d => console.error(d));
            }
            sendChannel.onopen = function () {
                self.peerHandler.onPeerReady(offeringPeer, sendChannel)
                    .catch(d => console.error(d));
            };
            sendChannel.onclose = function () {
            };

        }
        rtcConnection.onicecandidate = function ({ candidate }) {
            if (candidate) {
                self.client.sendIceCandidate(candidate, connectionId);
            }
        };
        rtcConnection.setRemoteDescription(offer).then(function () {
            rtcConnection.createAnswer().then(function (o) {
                self.client.sendAccept(connectionId, o, offeringPeer);
                rtcConnection.setLocalDescription(o);
            });
        });
    }

    acceptAccept(connectionId: string, accept: RTCSessionDescriptionInit): void {
        let connection = this.connections[connectionId];
        connection.rtcConnection.setRemoteDescription(accept);
    }

    broadcast(msg: string) {
        for (let c in this.connections) {
            let connection = this.connections[c];
            if (null != connection.channel && connection.channel.readyState == "open") {
                connection.channel.send(msg);
            }
        }
    }
}