import { RoutingActionCreator } from "./RoutingActionCreator";
import { LocalAppendOnlyLogService } from "../../append-only-log/LocalAppendOnlyLogService";
import { Store } from "../Store";
import { MessageTypes } from "../../message-encoding/MessageTypes";
import { TakeNote } from "./NotesActionCreator";
export class InitializationActionCreator {
    constructor(private store: Store, private localAppendOnlyLogService: LocalAppendOnlyLogService, private routingActionCreator: RoutingActionCreator) {
    }
    async initializeApplication() {
        let appendOnlyLogCreated = await this.localAppendOnlyLogService.appendOnlyLogCreated("local");
        if (!appendOnlyLogCreated) {
            this.routingActionCreator.navigateFirstTimeInit();
            await this.localAppendOnlyLogService.create("local");
            this.routingActionCreator.navigateHome();
        } else {
            let log = await this.localAppendOnlyLogService.get("local");
            for await (let entry of log.getAll()) {
                // for now assume public msg
                let msg = JSON.parse(new TextDecoder().decode(new Uint8Array(entry.content).subarray(2)));
                if (msg.type == MessageTypes.Note) {
                    this.store.dispatch(new TakeNote(msg.content));
                }
            }
        }
    }
}
