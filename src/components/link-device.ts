import template from "./link-device.html";
import { Store } from "../state/Store";
import { ServiceLocator } from "../ServiceLocator";
import { DeviceLinkActionCreator } from "../state/actions/DeviceLinkActionCreator";
import { DeviceLinkStatus } from "../models/DeviceLinkStatus";

export class LinkDevice extends HTMLElement {
    store: Store;
    deviceLinkActionCreator: DeviceLinkActionCreator;
    invitePane: HTMLDivElement;
    processStartPane: HTMLDivElement;
    generateButton: HTMLButtonElement;
    pasteButton: HTMLButtonElement;
    invCode: HTMLSpanElement;
    pastedCode: HTMLInputElement;
    subscription: () => void;

    constructor() {
        super();
        this.innerHTML = template;
    }

    addServices(serviceLocator: ServiceLocator) {
        this.store = serviceLocator.store;
        this.deviceLinkActionCreator = serviceLocator.deviceLinkActionCreator;
    }

    connectedCallback() {
        let element = this;
        this.invitePane = element.querySelector("#invite-code-pane");
        this.processStartPane = element.querySelector("#process-start-pane");
        this.generateButton = element.querySelector("#generate");
        this.pasteButton = element.querySelector("#redeem-code");
        this.invCode = element.querySelector("#inv-code");
        this.pastedCode = element.querySelector("#pasted-code");
        this.invitePane.style.display = "none";

        this.generateButton.addEventListener("click", async () => {
            await this.deviceLinkActionCreator.startDeviceLinking();
        });

        this.pasteButton.addEventListener("click", async () => {
            await this.deviceLinkActionCreator.linkDevice(this.pastedCode.value);
        });

        this.subscription = this.store.subscribe("deviceLink", state => {
            this.invitePane.style.display = state.deviceLink.inviteCode ? "block" : "none";
            this.invCode.innerText = state.deviceLink.inviteCode;
            this.processStartPane.style.display = state.deviceLink.deviceLinkStatus == DeviceLinkStatus.Uninitialized ? "block" : "none";
        });
    }

    disconnectedCallback() {
        this.subscription();
    }
}

customElements.define('app-link-device', LinkDevice);
