import { State } from "./State";
import { Reducer } from "./Reducer";
import { Action } from "./Action";

export interface Subscription {
    call(a: State): void;
    area: keyof State;
}

export interface ReducerSubscription {
    reducer: Reducer<any, any>;
    area: keyof State;
}

export class Store {
    private state: State;
    private subscriptions: Subscription[];
    private reducerSubscriptions: ReducerSubscription[];
    constructor(initState: () => State) {
        this.subscriptions = [];
        this.reducerSubscriptions = [];
        this.state = initState();
    }
    subscribe(area: keyof State, call: (a: State) => void) {
        let sub = { area, call };
        this.subscriptions.push(sub);
        return () => {
            this.subscriptions.splice(this.subscriptions.indexOf(sub), 1);
        };
    }
    addReducer<K extends keyof State>(area: K, reducer: Reducer<State[K], any>) {
        this.reducerSubscriptions.push({ area, reducer });
    }
    dispatch(action: Action) {
        let updatedAreas: (keyof State | "")[] = [];
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
