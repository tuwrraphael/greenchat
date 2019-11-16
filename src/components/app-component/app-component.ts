import { appQuery } from "../../state/app.query";
import { appService } from "../../state/app.service";
import { ConversationList } from "../conversation-list";
import { Subscription } from "rxjs";

import styles from "./app-component.scss";

export class AppComponent extends HTMLElement {
    private conversationSubscription: Subscription;
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `<style>${styles}</style>`;
        (<any>shadow).adoptedStyleSheets = [sheet];
        const conversationList = new ConversationList();
        conversationList.className = "appComponent";
        this.conversationSubscription = appQuery.conversations$.subscribe(c => {
            conversationList.conversations = c;
        });
        shadow.appendChild(conversationList);
        appService.initialize();
    }

    disconnectedCallback() {
        this.conversationSubscription.unsubscribe();
    }
}

// export function registerAppComponent() {
//     customElements.define("app-component", AppComponent);
// }