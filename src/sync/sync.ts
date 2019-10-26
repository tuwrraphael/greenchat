interface Source {
    id: string;
    latestTimestamp: number;
};

interface Message {
    id: string;
    sourceId: string;
    timestamp: number;
    content: string;
}

interface ClientState {
    [messageId: string]: Message
}

export interface ApplicationState {
    clientStates: { [sourceId: string]: ClientState };
    sources: Source[];
}

export interface RemoteUpdate {
    messages: Message[];
    sources: Source[];
}

export function applyRemoteUpdates(update: RemoteUpdate, localState: ApplicationState) {
    let newSources = update.sources.filter(n => !localState.sources.some(s => s.id === n.id));
    for (let newSource of newSources) {
        localState.clientStates[newSource.id] = {};
    }
    for (let message of update.messages) {
        let existing = localState.clientStates[message.sourceId][message.id];
        if (existing) {
            if (existing.timestamp >= message.timestamp) {
                console.error("old update provided");
            } else {
                existing.timestamp = message.timestamp;
                existing.content = message.content;
            }
        }
        else {
            localState.clientStates[message.sourceId][message.id] = message;
        }
    }
    localState.sources = localState.sources.map(s => {
        let updatedSource = update.sources.find(u => s.id === u.id);
        let newTimeStamp = Math.max(s.latestTimestamp, updatedSource ? updatedSource.latestTimestamp : 0);
        return {
            ...s,
            latestTimestamp: newTimeStamp
        }
    });
    for (let newSource of newSources) {
        localState.sources.push(newSource);
    }
}

export function createUpdatesForRemote(remoteClientSources: Source[], localState: ApplicationState): RemoteUpdate {
    let sourcesWithUpdates = localState.sources.map(local => {
        let remote = remoteClientSources.find(r => r.id === local.id);
        return {
            local,
            hasUpdates: !remote || local.latestTimestamp > remote.latestTimestamp,
            remoteTimestamp: remote ? remote.latestTimestamp : 0
        };
    }).filter(s => s.hasUpdates);
    let remoteUpdate = <RemoteUpdate>{
        messages: [],
        sources: sourcesWithUpdates.map(({ local }) => local)
    };
    for (let { local, remoteTimestamp } of sourcesWithUpdates) {
        let clientState = localState.clientStates[local.id];
        for (let msgId in clientState) {
            let message = clientState[msgId];
            if (message.timestamp > remoteTimestamp) {
                remoteUpdate.messages.push(message);
            }
        }
    }
    return remoteUpdate;
}