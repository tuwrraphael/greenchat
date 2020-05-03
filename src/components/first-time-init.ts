import template from "./first-time-init.html";

export class FirstTimeInit extends HTMLElement {

    constructor() {
        super();
        this.innerHTML = template;
    }

    connectedCallback() {

    }
}

customElements.define('app-first-time-init', FirstTimeInit);