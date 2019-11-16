import { Query } from '@datorama/akita';
import { AppState, AppStore, appStore, InitializationStatus, Conversation } from './app.store';
import { Observable } from 'rxjs';

export class AppQuery extends Query<AppState> {
    initializationStatus$: Observable<InitializationStatus>;
    conversations$: Observable<Conversation[]>;

    constructor(protected store: AppStore) {
        super(store);
        this.initializationStatus$ = this.select(store => store.initializationStatus);
        this.conversations$ = this.select(store => store.conversations);
    }
}

export const appQuery = new AppQuery(appStore);