import { RoutingActionCreator } from "./RoutingActionCreator";
import { LocalAppendOnlyLogService } from "../../append-only-log/LocalAppendOnlyLogService";
import { Store } from "../Store";
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
        if (await this.localAppendOnlyLogService.requireFirstTimeInit()) {
            token.require();
        }
        await this.localAppendOnlyLogService.initialize();
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
