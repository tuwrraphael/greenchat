import { iceConfig } from "./config";
import { SignallingClient } from "./SignallingClient";
import { ChannelInitialization } from "./ChannelInitialization";
import { DataChannelOpenedEventInit } from "./DataChannelOpenedEventInit";
export class PeerConnectionHandler extends EventTarget {
    private rtcConnection: RTCPeerConnection;
    private resolveInit: () => void;
    private resolveConnectionRequest: (offer: RTCSessionDescriptionInit) => void;
    private rejectConnectionRequest: (reason: string) => void;
    constructor(public connectionId: string, private signallingClient: SignallingClient) {
        super();
    }
    addIceCandidate(candidate: RTCIceCandidateInit) {
        this.rtcConnection.addIceCandidate(candidate);
    }
    setAnswer(answer: RTCSessionDescriptionInit) {
        this.rtcConnection.setRemoteDescription(answer);
    }
    acknowledgeInit() {
        this.resolveInit();
    }
    setOffer(offer: RTCSessionDescriptionInit) {
        this.resolveConnectionRequest(offer);
    }
    rejectConenctionRequest(reason: string) {
        this.rejectConnectionRequest(reason);
    }
    private onDataChannelOpen(c: RTCDataChannel) {
        this.dispatchEvent(new Event("datachannelopen", <DataChannelOpenedEventInit>{ channel: c }));
    }
    initiateChannel(timeout: number): Promise<unknown> {
        this.rtcConnection = new RTCPeerConnection({ ...iceConfig });
        let dataChannel = this.rtcConnection.createDataChannel("sendChannel");
        dataChannel.onopen = () => this.onDataChannelOpen(dataChannel);
        this.rtcConnection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                this.signallingClient.publishIceCandidate(this.connectionId, candidate);
            }
        };
        this.rtcConnection.createOffer().then(offer => {
            this.signallingClient.initiateConnection(this.connectionId, timeout, offer);
            this.rtcConnection.setLocalDescription(offer);
        });
        let promise = new Promise<ChannelInitialization>((resolve, reject) => {
            let resolved = false;
            this.resolveInit = () => {
                resolved = true;
                resolve();
            };
            setTimeout(() => {
                if (!resolved) {
                    reject("Timeout");
                    this.rtcConnection.close();
                }
            }, 2000);
        });
        return promise;
    }
    openChannel(): Promise<unknown> {
        this.rtcConnection = new RTCPeerConnection({ ...iceConfig });
        this.rtcConnection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                this.signallingClient.publishIceCandidate(this.connectionId, candidate);
            }
        };
        this.rtcConnection.ondatachannel = e => {
            let datachannel = e.channel;
            datachannel.onopen = () => {
                this.onDataChannelOpen(datachannel);
            };
        };
        this.signallingClient.requestConnection(this.connectionId);
        let promise = new Promise<unknown>((resolve, reject) => {
            let resolved = false;
            this.resolveConnectionRequest = (offer: RTCSessionDescriptionInit) => {
                this.rtcConnection.setRemoteDescription(offer).then(() => {
                    this.rtcConnection.createAnswer().then(answer => {
                        this.rtcConnection.setLocalDescription(answer);
                        this.signallingClient.sendAnswer(this.connectionId, answer);
                        resolved = true;
                        resolve();
                    });
                });
            };
            this.rejectConenctionRequest = (msg: string) => {
                resolved = true;
                reject(msg);
                this.rtcConnection.close();
            };
            setTimeout(() => {
                if (!resolved) {
                    reject("Timeout");
                    this.rtcConnection.close();
                }
            }, 10000);
        });
        return promise;
    }
}
