import { Reducer } from "./Reducer";
import { Action } from "./Action";

interface Subscription<TState> {
    call(a: TState): void;
    area: keyof TState | "";
}

interface ReducerSubscription<TState> {
    reducer: Reducer<any, any>;
    area: keyof TState | null;
}

export class BaseStore<TState> {
    private state: TState;
    private subscriptions: Subscription<TState>[];
    private reducerSubscriptions: ReducerSubscription<TState>[];
    constructor(initState: () => TState) {
        this.subscriptions = [];
        this.reducerSubscriptions = [];
        this.state = initState();
    }
    subscribe(area: keyof TState, call: (a: TState) => void) {
        let sub = { area, call };
        this.subscriptions.push(sub);
        return () => {
            this.subscriptions.splice(this.subscriptions.indexOf(sub), 1);
        };
    }
    addReducer<K extends keyof TState>(area: K | null, reducer: Reducer<TState[K] | TState, any>) {
        this.reducerSubscriptions.push({ area, reducer });
    }
    dispatch(action: Action) {
        let updatedAreas: (keyof TState | "")[] = [];
        for (let s of this.reducerSubscriptions) {
            let applyUpdateFn;
            if (s.area) {
                applyUpdateFn = (cb: (a: any) => any) => {
                    (<any>this.state[s.area]) = cb(this.state[s.area]);
                    updatedAreas.push(s.area);
                };
            }
            else {
                applyUpdateFn = (cb: (a: any) => any) => {
                    this.state = cb(this.state);
                    updatedAreas.push("");
                };
            }
            s.reducer.onDispatch(action, applyUpdateFn);
        }
        if (updatedAreas.length) {
            for (let s of this.subscriptions) {
                if (!s.area || updatedAreas.indexOf(s.area) > -1) {
                    s.call(this.state);
                }
            }
        }
    }
}
