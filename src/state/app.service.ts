import { AppStore, InitializationStatus, appStore } from "./app.store";

export class AppService {

    constructor(private appStore: AppStore) { }

    initialize() {
        this.appStore.update(() => { return { initializationStatus: InitializationStatus.initializing } });
        setTimeout(() => {
            this.appStore.update(s => {
                return {
                    initializationStatus: InitializationStatus.done, conversations: [...s.conversations,
                    { name: "third" }]
                }
            });
        }, 1000);
    }
}

export const appService = new AppService(appStore);