import template from "./first-time-init.html";

export class FirstTimeInit extends HTMLElement {

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        let div = document.createElement("div");
        div.innerHTML = template;
        shadow.appendChild(div);
    }

    connectedCallback() {

    }
}

customElements.define('app-first-time-init', FirstTimeInit);