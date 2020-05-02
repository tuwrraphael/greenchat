import { SignallingClient } from "./webrtc/signalling-client_old";
import { DefaultSignallingHandler } from "./webrtc/default-signalling-handler";
import { uuid } from "./utils/uuid";
import { PeerHandler } from "./webrtc/peer-handler";
import { RemoteUpdate } from "./models/RemoteUpdate";
import { GreenchatDatabase } from "./database/greenchat-database_old";
import { IUserInfo } from "./models/IUserInfo";

let localId = uuid();
let db = new GreenchatDatabase("greenchat-db");

let userInfo: IUserInfo = null;

export class DefaultPeerHandler implements PeerHandler {
    constructor(private clientId: string, private db: GreenchatDatabase) { }

    async onPeerReady(peerId: string, channel: RTCDataChannel) {
        let sources = await this.db.getSources();
        channel.send(JSON.stringify({ type: "sources", id: this.clientId, sources: sources }));
    }
    async onMessage(peerId: string, msg: string, channel: RTCDataChannel) {
        let parsed = JSON.parse(msg);
        switch (parsed.type) {
            case "sources":
                var { sources } = parsed;
                var updates = await this.db.getUpdatesForRemote(sources);
                channel.send(JSON.stringify({ type: "updates", id: this.clientId, updates }))
                break;
            case "updates":
                var { updates } = <{ updates: RemoteUpdate }>parsed;
                await this.db.applyRemoteUpdates(updates);
                printState();
                break;
        }
    }
}

let stateDiv = document.createElement("pre");

function printState() {
    db.hack_getMessages().then(msgs => {
        stateDiv.innerText = msgs.map(v => `${v.from}: ${v.m}`).join("\n");
    });
}

async function start() {
    userInfo = await db.getOrCreateUser();

    let peerHandler = new DefaultPeerHandler(userInfo.clientId, db);
    let signallingHandler = new DefaultSignallingHandler(localId, peerHandler);
    let client = new SignallingClient(localId, signallingHandler);
    client.connect();

    let whoami = document.createElement("div");
    whoami.innerHTML = `I am ${userInfo.clientId}`;
    document.body.appendChild(whoami);

    let input = document.createElement("input");
    document.body.appendChild(input);

    let button = document.createElement("button");
    document.body.appendChild(button);
    button.innerHTML = "Add";

    button.onclick = function () {
        db.hack_addMessage(userInfo.clientId, input.value).then(msg => {
            input.value = "";
            let updates: RemoteUpdate = {
                messages: [msg],
                sources: [{ id: userInfo.clientId, latestTimestamp: msg.timestamp }]
            };
            signallingHandler.broadcast(JSON.stringify({ type: "updates", id: userInfo.clientId, updates }));
            printState();
        });
    }

    document.body.appendChild(stateDiv);
    printState();
}
start().catch(err => {
    console.error(err)
});