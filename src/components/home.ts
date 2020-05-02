import template from "./home.html";
import { Store } from "../state/Store";
import { NotesActionCreator } from "../state/actions/NotesActionCreator";
import { ServiceLocator } from "../ServiceLocator";

export class Home extends HTMLElement {
    store: Store;
    notesActionCreator: NotesActionCreator;
    list: HTMLOListElement;
    noteContent: HTMLInputElement;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        let div = document.createElement("div");
        div.innerHTML = template;
        shadow.appendChild(div);
    }

    addServices(serviceLocator: ServiceLocator) {
        this.store = serviceLocator.store;
        this.notesActionCreator = serviceLocator.notesActionCreator;
    }

    connectedCallback() {
        this.list = this.shadowRoot.querySelector("#notes-list");
        this.noteContent = this.shadowRoot.querySelector("#note-content");
        this.shadowRoot.querySelector("#addNoteBtn").addEventListener("click", () => {
            this.notesActionCreator.takeNote(this.noteContent.value);
            this.noteContent.value = "";
        })
        this.store.subscribe("notes", state => {
            this.list.innerHTML = "";
            for (let note of state.notes.notes) {
                let li = document.createElement("li");
                li.innerText = note;
                this.list.appendChild(li);
            }
        });
    }
}

customElements.define('app-home', Home);