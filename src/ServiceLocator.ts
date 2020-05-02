import { Store } from "./state/Store";
import { NotesActionCreator } from "./state/actions/NotesActionCreator";

export class ServiceLocator {
    constructor(public store: Store,
        public notesActionCreator: NotesActionCreator) {

    }
}