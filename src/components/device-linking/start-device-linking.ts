import template from "./start-device-linking.html";

export class StartDeviceLinking extends HTMLElement {

    private invitePane: HTMLDivElement;
    private processStartPane: HTMLDivElement;
    private generateButton: HTMLButtonElement;
    private pasteButton: HTMLButtonElement;
    private invCode: HTMLSpanElement;
    private pastedCode: HTMLInputElement;
    private generateButtonListener: () => void;
    private pastebuttonListener: () => void;


    constructor() {
        super();
        this.innerHTML = template;
        this.generateButtonListener = () => {
            this.dispatchEvent(new CustomEvent("ongenerate"));
        };
        this.pastebuttonListener = () => {
            this.dispatchEvent(new CustomEvent("oncodereceived", { detail: this.pastedCode.value }));
        };
    }

    set inviteCode(newValue: string) {
        this.invCode.innerText = newValue;
        this.applyState(newValue);
    }

    private applyState(inviteCode:string) {
        if (inviteCode) {
            this.processStartPane.style.display = "none";
            this.invitePane.style.display = "block";
        }
        else {
            this.invitePane.style.display = "none";
            this.processStartPane.style.display = "block";
        }
    }

    connectedCallback() {
        let element = this;
        this.invitePane = element.querySelector("#invite-code-pane");
        this.processStartPane = element.querySelector("#process-start-pane");
        this.generateButton = element.querySelector("#generate");
        this.pasteButton = element.querySelector("#redeem-code");
        this.invCode = element.querySelector("#inv-code");
        this.pastedCode = element.querySelector("#pasted-code");
        this.applyState(this.inviteCode);


        this.generateButton.addEventListener("click", this.generateButtonListener);
        this.pasteButton.addEventListener("click", this.pastebuttonListener);
    }

    disconnectedCallback() {
        this.generateButton.removeEventListener("click", this.generateButtonListener);
        this.pasteButton.removeEventListener("click", this.pastebuttonListener);
    }

}

customElements.define('app-start-device-linking', StartDeviceLinking);
