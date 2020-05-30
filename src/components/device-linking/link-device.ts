import template from "./link-device.html";
import { Store } from "../../state/Store";
import { ServiceLocator } from "../../ServiceLocator";
import { DeviceLinkActionCreator } from "../../state/actions/DeviceLinkActionCreator";
import { DeviceLinkStatus } from "../../device-linking/DeviceLinkStatus";
import { State } from "../../state/State";
import { StartDeviceLinking } from "./start-device-linking";

export class LinkDevice extends HTMLElement {
    store: Store;
    deviceLinkActionCreator: DeviceLinkActionCreator;
    subscription: () => void;
    startDeviceLinking: StartDeviceLinking;

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
        this.startDeviceLinking = new StartDeviceLinking();
        element.appendChild(this.startDeviceLinking);

        this.startDeviceLinking.addEventListener("ongenerate", async () => {
            await this.deviceLinkActionCreator.startDeviceLinking();
        });

        this.startDeviceLinking.addEventListener("oncodereceived", async e => {
            await this.deviceLinkActionCreator.linkDevice((e as CustomEvent).detail);
        })

        this.subscription = this.store.subscribe("deviceLink", state => this.applyStoreState(state));
        this.applyStoreState(this.store.state);
        this.deviceLinkActionCreator.initializeDeviceLinking();
    }

    private applyStoreState(state: State) {
        this.startDeviceLinking.inviteCode = state.deviceLink.inviteCode;
    }

    disconnectedCallback() {
        this.subscription();
    }
}

customElements.define('app-link-device', LinkDevice);
