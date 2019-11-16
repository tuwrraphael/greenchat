import { Conversation } from "../state/app.store";

export class ConversationList extends HTMLElement {
    private rootElement: HTMLUListElement;
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        this.rootElement = document.createElement("ul");
        shadow.appendChild(this.rootElement);
    }
    set conversations(newValue: Conversation[]) {
        this.rootElement.innerHTML = "";
        for (let conversation of newValue) {
            let element = document.createElement("li");
            element.innerText = conversation.name;
            this.rootElement.appendChild(element);
        }
    }
}

export function registerConversationList() {
    customElements.define("conversation-list", ConversationList);
}