import { Action } from "./Action";

export interface Reducer<TSubState, TActions> {
    onDispatch(action: TActions, updateStore: (a: (s: TSubState) => TSubState) => void): void;
}
