import { Router } from "route-it";
import { FirstTimeInit } from "../components/first-time-init";
import { Home } from "../components/home";
import { Store } from "../state/Store";
import { NotesActionCreator } from "../state/actions/NotesActionCreator";
import { ServiceLocator } from "../ServiceLocator";
import { LinkDevice } from "../components/link-device";

export enum Paths {
    FirstTimeInit = "first-time-init",
    LinkDevice = "link-device",
    Home = ""
}

export class GreenchatRouteResolver {
    serviceLocator: ServiceLocator;
    setServiceLocator(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    resolve(lastRoute: string, currentRoute: string, router: Router<HTMLElement>) {
        switch (currentRoute) {
            case Paths.FirstTimeInit:
                return new FirstTimeInit();
            case Paths.LinkDevice: {
                let component = new LinkDevice();
                component.addServices(this.serviceLocator);
                return component;
            }
            default:
                let component = new Home();
                component.addServices(this.serviceLocator);
                return component;
        }
    }
}
