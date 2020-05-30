import { Router, BodyChildRouteRenderer } from "route-it";
import { GreenchatDatabase } from "./database/GreenchatDatabase";
import { GreenchatRouteResolver } from "./routing/GreenchatRouteResolver";
import { Store } from "./state/Store";
import { InitializationActionCreator } from "./state/actions/InitializationActionCreator";
import { LocalAppendOnlyLogService } from "./append-only-log/LocalAppendOnlyLogService";
import { MessageEncoder } from "./message-encoding/MessageEncoder";
import { RoutingActionCreator } from "./state/actions/RoutingActionCreator";
import { NotesReducer } from "./state/reducers/NotesReducer";
import { NotesActionCreator } from "./state/actions/NotesActionCreator";
import { ServiceLocator } from "./ServiceLocator";
import { SignallingClient } from "./webrtc/SignallingClient";
import { GlobalReducer } from "./state/reducers/GlobalReducer";
import { SignallingActionCreator } from "./state/actions/SignallingActionCreator";
import { DeviceLinkActionCreator } from "./state/actions/DeviceLinkActionCreator";
import { DeviceLinkStatus } from "./device-linking/DeviceLinkStatus";
import { DeviceLinkReducer } from "./state/reducers/DeviceLinkReducer";
import { DeviceLinkService } from "./device-linking/DeviceLinkService";

async function run() {
    const db = new GreenchatDatabase();
    const signallingClient = new SignallingClient();
    const routeResolver = new GreenchatRouteResolver();
    const router = new Router(routeResolver, new BodyChildRouteRenderer());
    const store = new Store(() => {
        return {
            signallingConnected: false,
            notes: { notes: [] },
            deviceLink: {
                deviceLinkStatus: null,
                inviteCode: null
            }
        }
    });
    store.addReducer("notes", new NotesReducer());
    store.addReducer(null, new GlobalReducer());
    store.addReducer("deviceLink", new DeviceLinkReducer());

    const messageEncoder = new MessageEncoder();
    const localAppendOnlyLogService = new LocalAppendOnlyLogService(db, messageEncoder);
    const deviceLinkService = new DeviceLinkService(signallingClient, db, localAppendOnlyLogService);

    const routingActionCreator = new RoutingActionCreator(router);
    const initializationActionCreator = new InitializationActionCreator(store, localAppendOnlyLogService, routingActionCreator, deviceLinkService);
    const notesActionCreator = new NotesActionCreator(store, localAppendOnlyLogService, messageEncoder, deviceLinkService);
    const signallingActionCreator = new SignallingActionCreator(store, signallingClient);
    const deviceLinkActionCreator = new DeviceLinkActionCreator(store, deviceLinkService);

    const serviceLocator = new ServiceLocator(store,
        notesActionCreator,
        deviceLinkActionCreator,
        routingActionCreator);
    routeResolver.setServiceLocator(serviceLocator);

    await db.initialize();
    router.run();

    await initializationActionCreator.initializeApplication();
    signallingActionCreator.startSignalling();
}

run().catch(err => console.error(err));