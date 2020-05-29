import { RoutingActionCreator } from "./RoutingActionCreator";
import { LocalAppendOnlyLogService } from "../../append-only-log/LocalAppendOnlyLogService";
import { Store } from "../Store";
import { MessageTypes } from "../../message-encoding/MessageTypes";
import { TakeNote } from "./NotesActionCreator";
import { DeviceLinkService } from "../../device-linking/DeviceLinkService";

interface InitToken {
    require(): void;
}

export class InitializationActionCreator {

    constructor(private store: Store,
        private localAppendOnlyLogService: LocalAppendOnlyLogService,
        private routingActionCreator: RoutingActionCreator,
        private deviceLinkService: DeviceLinkService) {

    }

    private async initializeAppendOnlyLog(token: InitToken) {
        let appendOnlyLogCreated = await this.localAppendOnlyLogService.appendOnlyLogCreated("local");
        if (!appendOnlyLogCreated) {
            token.require();
            await this.localAppendOnlyLogService.create("local");
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

    async initializeApplication() {
        let initNavigated = false;
        let token = {
            require: () => {
                if (!initNavigated) {
                    initNavigated = true;
                    this.routingActionCreator.navigateFirstTimeInit();
                }
            }
        };

        await this.initializeAppendOnlyLog(token);
        await this.deviceLinkService.initialize();
        if (initNavigated) {
            this.routingActionCreator.navigateHome();
        }
    }
}
