import { Router } from "route-it";
import { Paths } from "../../routing/GreenchatRouteResolver";
export class RoutingActionCreator {
    constructor(private router: Router<HTMLElement>) {
    }
    navigateFirstTimeInit() {
        this.router.navigate(Paths.FirstTimeInit, "greenchat - initialization");
    }
    navigateHome() {
        this.router.navigate(Paths.Home, "greenchat");
    }
}
