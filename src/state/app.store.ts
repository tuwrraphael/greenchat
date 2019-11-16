import { Store, StoreConfig } from "@datorama/akita";

export interface Conversation {
    name: string;
}

export enum InitializationStatus {
    none,
    initializing,
    done
}

export interface AppState {
    conversations: Conversation[];
    initializationStatus: InitializationStatus;
}

export function createInitialState(): AppState {
    return {
        conversations: [{ name: "first" }, { name: "second" }],
        initializationStatus: InitializationStatus.none
    };
}

@StoreConfig({ name: "app" })
export class AppStore extends Store<AppState> {
    constructor() {
        super(createInitialState());
    }
}

export const appStore = new AppStore();