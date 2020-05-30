import { Reducer } from "../lib/Reducer";
import { NotesSubState } from "../State";
import { NotesActions, NotesActionNames } from "../actions/NotesActionCreator";

export class NotesReducer implements Reducer<NotesSubState, NotesActions> {
    onDispatch(action: NotesActions, updateStore: (a: (s: NotesSubState) => NotesSubState) => void): void {
        switch (action.type) {
            case NotesActionNames.TakeNote: {
                updateStore((s: NotesSubState) => {
                    let notes = s.notes || [];
                    notes.push(action.note.content);
                    return { ...s, notes };
                });
                break;
            }
            case NotesActionNames.NotesLoaded: {
                updateStore((s: NotesSubState) => {
                    return { ...s, notes: action.notes.map(n => n.content) };
                });
                break;
            }
        }
    }
}