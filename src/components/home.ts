import template from "./home.html";
import { Store } from "../state/Store";
import { NotesActionCreator } from "../state/actions/NotesActionCreator";
import { ServiceLocator } from "../ServiceLocator";
import { RoutingActionCreator } from "../state/actions/RoutingActionCreator";

export class Home extends HTMLElement {
    store: Store;
    notesActionCreator: NotesActionCreator;
    list: HTMLOListElement;
    noteContent: HTMLInputElement;
    subscription: () => void;
    routingActionCreator: RoutingActionCreator;

    constructor() {
        super();
        this.innerHTML = template;
    }

    addServices(serviceLocator: ServiceLocator) {
        this.store = serviceLocator.store;
        this.notesActionCreator = serviceLocator.notesActionCreator;
        this.routingActionCreator = serviceLocator.routingActionCreator;
    }

    connectedCallback() {
        let element = this;
        this.list = element.querySelector("#notes-list");
        this.noteContent = element.querySelector("#note-content");
        element.querySelector("#addNoteBtn").addEventListener("click", () => {
            this.notesActionCreator.takeNote(this.noteContent.value);
            this.noteContent.value = "";
        })
        element.querySelectorAll("a").forEach(e => {
            e.addEventListener("click", ev => {
                ev.preventDefault();
                this.routingActionCreator.navigate(e.getAttribute("href"))
            });
        });
        this.subscription = this.store.subscribe("notes", state => {
            this.list.innerHTML = "";
            for (let note of state.notes.notes) {
                let li = document.createElement("li");
                li.innerText = note;
                this.list.appendChild(li);
            }
        });
    }

    disconnectedCallback() {
        this.subscription();
    }
}

customElements.define('app-home', Home);