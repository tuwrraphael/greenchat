import { SignallingClient } from "./webrtc/signalling-client";
import { DefaultSignallingHandler } from "./webrtc/default-signalling-handler";
import { uuid } from "./uuid";
import { PeerHandler } from "./webrtc/peer-handler";
import { ApplicationState, createUpdatesForRemote, applyRemoteUpdates, RemoteUpdate } from "./sync/sync";

let localId = uuid();
let clientId = localStorage.getItem("clientId");
if (null == clientId) {
    clientId = uuid();
    localStorage.setItem("clientId", clientId);
}

let applicationState: ApplicationState = {
    clientStates: {},
    sources: []
};

applicationState.clientStates[clientId] = {
};

applicationState.sources = [{ id: clientId, latestTimestamp: 0 }];


let stateDiv = document.createElement("pre");


function printState() {
    stateDiv.innerHTML = JSON.stringify(applicationState, null, 4);;
}
printState();


export class DefaultPeerHandler implements PeerHandler {
    onPeerReady(peerId: string, channel: RTCDataChannel): void {
        channel.send(JSON.stringify({ type: "sources", id: clientId, sources: applicationState.sources }));
    }
    onMessage(peerId: string, msg: string, channel: RTCDataChannel): void {
        let parsed = JSON.parse(msg);
        switch (parsed.type) {
            case "sources":
                var { sources } = parsed;
                var updates = createUpdatesForRemote(sources, applicationState);
                channel.send(JSON.stringify({ type: "updates", id: clientId, updates }))
                break;
            case "updates":
                var { updates } = <{ updates: RemoteUpdate }>parsed;
                applyRemoteUpdates(updates, applicationState);
                printState();
                break;
        }
    }
}



let peerHandler = new DefaultPeerHandler();
let signallingHandler = new DefaultSignallingHandler(localId, peerHandler);
let client = new SignallingClient(localId, signallingHandler);
client.connect();

let whoami = document.createElement("div");
whoami.innerHTML = `I am ${clientId}`;
document.body.appendChild(whoami);

let input = document.createElement("input");
document.body.appendChild(input);

let button = document.createElement("button");
document.body.appendChild(button);
button.innerHTML = "Add";

function getLocalTimestampInc() {
    let source = applicationState.sources.find(s => s.id == clientId);
    source.latestTimestamp++;
    return source.latestTimestamp;
}

button.onclick = function () {
    let msgId = uuid();
    let msg = applicationState.clientStates[clientId][msgId] = {
        id: msgId,
        content: input.value,
        sourceId: clientId,
        timestamp: getLocalTimestampInc()
    };
    let updates: RemoteUpdate = {
        messages: [msg],
        sources: [{ id: clientId, latestTimestamp: msg.timestamp }]
    };
    signallingHandler.broadcast(JSON.stringify({ type: "updates", id: clientId, updates }));
    printState();
}

document.body.appendChild(stateDiv);





