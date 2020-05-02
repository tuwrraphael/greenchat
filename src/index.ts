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

async function run() {
    const db = new GreenchatDatabase();
    const routeResolver = new GreenchatRouteResolver();
    const router = new Router(routeResolver, new BodyChildRouteRenderer());
    const store = new Store(() => {
        return {
            notes: { notes: [] }
        }
    });
    store.addReducer("notes", new NotesReducer());

    const messageEncoder = new MessageEncoder();
    const localAppendOnlyLogService = new LocalAppendOnlyLogService(db, messageEncoder);

    const routingActionCreator = new RoutingActionCreator(router);
    const initializationActionCreator = new InitializationActionCreator(store, localAppendOnlyLogService, routingActionCreator);
    const notesActionCreator = new NotesActionCreator(store, localAppendOnlyLogService, messageEncoder);

    const serviceLocator = new ServiceLocator(store,
        notesActionCreator);
    routeResolver.setServiceLocator(serviceLocator);

    await db.initialize();
    router.run();

    await initializationActionCreator.initializeApplication();
}

run().catch(err => console.error(err));

