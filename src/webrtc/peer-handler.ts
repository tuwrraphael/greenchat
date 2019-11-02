export interface PeerHandler {
    onPeerReady(peerId: string, channel : RTCDataChannel): Promise<void>;
    onMessage(peerId: string, msg: string, channel: RTCDataChannel): Promise<void>;
}