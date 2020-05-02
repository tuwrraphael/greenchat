import { Reducer } from "../Reducer";
import { State } from "../State";
import { SignallingActions, SignallingActionNames } from "../actions/SignallingActionCreator";

export class GlobalReducer implements Reducer<State, SignallingActions> {
    onDispatch(action: SignallingActions, updateStore: (a: (s: State) => State) => void): void {
        switch (action.type) {
            case SignallingActionNames.SignallingConnectionChanged: {
                updateStore(s => {
                    return { ...s, signallingConnected: action.connected };
                })
            }
        }
    }
}