import { iceConfig } from "./config";
import { SignallingClient } from "./SignallingClient";

export class PeerConnectionHandler {
    private rtcConnection: RTCPeerConnection;
    private resolveInit: () => void;
    private resolveConnectionRequest: (offer: RTCSessionDescriptionInit) => void;
    private rejectConnectionRequest: (reason: string) => void;
    constructor(public connectionId: string, private signallingClient: SignallingClient) {
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

    initiateChannel(timeout: number): Promise<RTCDataChannel> {
        return this.initiateConnection(timeout);
    }

    private initiateConnection(timeout: number, hubId?: string) {
        this.rtcConnection = new RTCPeerConnection({ ...iceConfig });
        let dataChannel = this.rtcConnection.createDataChannel("sendChannel");
        this.rtcConnection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                this.signallingClient.publishIceCandidate(this.connectionId, candidate);
            }
        };
        this.rtcConnection.createOffer().then(offer => {
            if (hubId) {
                this.signallingClient.connectHub(hubId, this.connectionId, timeout, offer);
            }
            else {
                this.signallingClient.initiateConnection(this.connectionId, timeout, offer);
            }
            this.rtcConnection.setLocalDescription(offer);
        });
        let promise = new Promise<RTCDataChannel>((resolve, reject) => {
            let resolved = false;
            this.resolveInit = () => {
                resolved = true;
                resolve(dataChannel);
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

    connectHub(hubId: string, timeout: number): Promise<RTCDataChannel> {
        return this.initiateConnection(timeout, hubId);
    }

    openChannel(): Promise<RTCDataChannel> {
        this.rtcConnection = new RTCPeerConnection({ ...iceConfig });
        this.rtcConnection.onicecandidate = ({ candidate }) => {
            if (candidate) {
                this.signallingClient.publishIceCandidate(this.connectionId, candidate);
            }
        };
        let resolveConnectionRequestPromise = new Promise<unknown>(resolve => {
            this.resolveConnectionRequest = (offer: RTCSessionDescriptionInit) => {
                this.rtcConnection.setRemoteDescription(offer).then(() => {
                    this.rtcConnection.createAnswer().then(answer => {
                        this.rtcConnection.setLocalDescription(answer);
                        this.signallingClient.sendAnswer(this.connectionId, answer);
                        resolve();
                    });
                });
            };
        });
        this.signallingClient.requestConnection(this.connectionId);
        let promise = new Promise<RTCDataChannel>((resolve, reject) => {
            let resolved = false;
            this.rtcConnection.ondatachannel = e => {
                let datachannel = e.channel;
                resolveConnectionRequestPromise.then(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve(datachannel);
                    }
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
