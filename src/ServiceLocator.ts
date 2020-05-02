import { Store } from "./state/Store";
import { NotesActionCreator } from "./state/actions/NotesActionCreator";
import { DeviceLinkActionCreator } from "./state/actions/DeviceLinkActionCreator";
import { RoutingActionCreator } from "./state/actions/RoutingActionCreator";

export class ServiceLocator {
    constructor(public store: Store,
        public notesActionCreator: NotesActionCreator,
        public deviceLinkActionCreator: DeviceLinkActionCreator,
        public routingActionCreator : RoutingActionCreator) {

    }
}