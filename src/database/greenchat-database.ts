import Dexie from "dexie";
import { IUserInfo } from "../models/IUserInfo";
import { generateIdentity } from "../security/generate-identity";
import { Source } from "../models/Source";
import { RemoteUpdate } from "../models/RemoteUpdate";
import { uuid } from "../uuid";

export class GreenchatDatabase extends Dexie {
    stateMembers: Dexie.Table<IStateMember, string>;
    sources: Dexie.Table<ISource, string>;
    userInfo: Dexie.Table<IStoredUserInfo, string>;
    constructor(databaseName: string) {
        super(databaseName);
        this.version(2).stores({
            stateMembers: "[id+sourceId],timestamp,sourceId",
            sources: "id",
            userInfo: "id"
        });
        this.stateMembers = this.table("stateMembers");
        this.sources = this.table("sources");
        this.userInfo = this.table("userInfo");
    }

    async getOrCreateUser() {
        await this.open();
        let userInfo = await this.userInfo.get("local");
        if (null == userInfo) {
            let newUserInfo = await generateIdentity();
            userInfo = {
                clientId: newUserInfo.clientId,
                encryptionKey: newUserInfo.encryptionKey,
                signingKey: newUserInfo.signingKey,
                id: "local"
            };
            this.userInfo.put(userInfo);
        }
        return <IUserInfo>{
            encryptionKey: userInfo.encryptionKey,
            clientId: userInfo.clientId,
            signingKey: userInfo.signingKey
        };
    }

    async getUpdatesForRemote(remoteClientSources: Source[]) {
        let localSources = await this.sources.toArray();
        let sourcesWithUpdates = localSources.map(local => {
            let remote = remoteClientSources.find(r => r.id === local.id);
            return {
                local,
                hasUpdates: !remote || local.latestTimestamp > remote.latestTimestamp,
                remoteTimestamp: remote ? remote.latestTimestamp : 0
            };
        }).filter(s => s.hasUpdates)
        let remoteUpdate = <RemoteUpdate>{
            messages: [],
            sources: sourcesWithUpdates.map(({ local }) => local)
        };
        for (let { local, remoteTimestamp } of sourcesWithUpdates) {
            await this.stateMembers.where("[id+sourceId]")
                .between([Dexie.minKey, local.id], [Dexie.maxKey, local.id], true, true)
                .filter(d => d.timestamp > remoteTimestamp)
                .each(f => {
                    remoteUpdate.messages.push({
                        id: f.id,
                        sourceId: f.sourceId,
                        content: f.content,
                        timestamp: f.timestamp
                    });
                });
        }
        return remoteUpdate;
    }

    async getSources() {
        let localSources = await this.sources.toArray();
        return localSources.map(v => {
            return {
                id: v.id,
                latestTimestamp: v.latestTimestamp
            };
        });
    }

    async applyRemoteUpdates(update: RemoteUpdate) {
        await this.transaction("rw", this.stateMembers, async () => {
            for (let message of update.messages) {
                let stored = await this.stateMembers.where(["id+sourceId"])
                    .equals([message.id, message.sourceId])
                    .first();
                if (!stored || stored.timestamp < message.timestamp) {
                    await this.stateMembers.put({
                        id: message.id,
                        sourceId: message.sourceId,
                        timestamp: message.timestamp,
                        content: message.content
                    });
                }
            }
        });
        await this.transaction("rw", this.sources, async () => {
            for (let source of update.sources) {
                let stored = await this.sources.get(source.id);
                let newTimeStamp = Math.max(source.latestTimestamp, stored ? stored.latestTimestamp : 0);
                await this.sources.put({
                    id: source.id,
                    latestTimestamp: newTimeStamp
                });
            }
        });
    }

    async hack_addMessage(clientId: string, msg: string) {
        let latest = await this.stateMembers
            .orderBy("timestamp")
            .filter(v => v.sourceId == clientId)
            .last();
        let newTs = latest ? ++latest.timestamp : 1;
        let m = {
            id: uuid(),
            sourceId: clientId,
            content: { msg, timestamp: new Date() },
            timestamp: newTs
        };
        await this.stateMembers.put(m);
        await this.sources.put({ id: clientId, latestTimestamp: newTs });
        return m;
    }

    async hack_getMessages() {
        return (await this.stateMembers.toArray()).map(v => {
            return {
                from: v.sourceId,
                m: v.content.msg || v.content,
                ts: v.content.timestamp || 0
            }
        }).sort((a, b) => b.ts - a.ts);
    }
}

interface IStoredUserInfo {
    id: string;
    clientId: string;
    encryptionKey: CryptoKeyPair;
    signingKey: CryptoKeyPair;
}

interface IStateMember {
    id: string,
    sourceId: string,
    content: any,
    timestamp: number
}

interface ISource {
    id: string;
    latestTimestamp: number;
};