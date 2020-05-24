import template from "./open-source-info.html";

export class OpenSourceInfo extends HTMLElement {

    constructor() {
        super();
        this.innerHTML = template;
    }

    async connectedCallback() {
        let res = await fetch("main.licenses.txt");
        let text = await res.text();
        (<HTMLDivElement>this.querySelector("#third-party")).innerText = text;
    }
}

customElements.define('app-open-source-info', OpenSourceInfo);