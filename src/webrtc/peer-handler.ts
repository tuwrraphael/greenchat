export interface PeerHandler {
    onPeerReady(peerId: string, channel : RTCDataChannel): void;
    onMessage(peerId: string, msg: string, channel: RTCDataChannel): void;
}