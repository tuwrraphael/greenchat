// import { LocalAppendOnlyLog } from "./LocalAppendOnlyLog";
// import { LogPersistence } from "./LogPersistence";
// import { MessageEncoder } from "../message-encoding/MessageEncoder";
// import { RemoteAppendOnlyLog } from "./RemoteAppendOnlyLog";
// import { LogMessage } from "./LogMessage";
// import { AppendOnlyLogMetadata } from "./AppendOnlyLogMetadata";

// class InMemoryLogPersistence implements LogPersistence {
//     logs: any;

//     constructor() {
//         this.logs = {};
//     }

//     async *getAllOrdered(logId: string): AsyncGenerator<LogMessage, void, unknown> {
//         for (let m of this.logs[logId].messages.sort((a: LogMessage, b: LogMessage) => a.sequence - b.sequence)) {
//             yield m;
//         }
//     }
//     async createAppendOnlyLog(logId: string, publicKey: CryptoKey, privateKey: CryptoKey): Promise<any> {
//         this.logs[logId] = { logId, messages: [] };
//     }
//     async hasAppendOnlyLog(logId: string): Promise<boolean> {
//         return !!this.logs[logId];
//     }
//     async getLastMessage(logId: string): Promise<LogMessage> {
//         return this.logs[logId].messages[this.logs[logId].messages.length - 1];
//     }
//     async storeMessages(logId: string, messages: LogMessage[]): Promise<boolean> {
//         for (let m of messages) {
//             this.logs[logId].messages.push(m);
//         }
//         return true;
//     }
//     async getAppendOnlyLog(logId: string): Promise<AppendOnlyLogMetadata> {
//         return this.logs[logId];
//     }
//     async *getAll(logId: string): AsyncGenerator<LogMessage, void, unknown> {
//         for (let m of this.logs[logId].messages) {
//             yield m;
//         }
//     }
//     async get(logId: string, hash: string): Promise<LogMessage> {
//         return this.logs[logId].messages.find((m: LogMessage) => m.hash == hash);
//     }
//     async *getAfterOrdered(logId: string, hash: string): AsyncGenerator<LogMessage, void, unknown> {
//         let flag = false;
//         for (let m of this.logs[logId].messages.sort((a: LogMessage, b: LogMessage) => a.sequence - b.sequence)) {
//             if (flag) {
//                 yield m;
//             }
//             if (m.hasg == hash) {
//                 flag = true;
//             }
//         }
//     }
//     async printLog(logId: string) {
//         console.log(logId);
//         console.table(this.logs[logId].messages);
//     }
// }


// describe("LocalAppendOnlyLog", function () {
//     let signingKeyPair1: CryptoKeyPair;
//     let signingKeyPair2: CryptoKeyPair;

//     beforeAll(async () => {
//         signingKeyPair1 = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
//         signingKeyPair2 = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
//     })

//     it("merges empty logs", async function () {
//         let p = new InMemoryLogPersistence();
//         p.createAppendOnlyLog("local", signingKeyPair1.publicKey, signingKeyPair1.privateKey);
//         p.createAppendOnlyLog("remote", signingKeyPair2.publicKey, null);
//         let local = new LocalAppendOnlyLog(signingKeyPair1.privateKey, "local", 0, p, new MessageEncoder());
//         p.printLog("local");
//         let remote = new RemoteAppendOnlyLog(signingKeyPair2.publicKey, 0, "remote", p);
//         await local.merge(remote);
//         p.printLog("local");
//         p.printLog("remote");
//     });

// });