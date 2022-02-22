import { attributeValueToBool } from "/utils/forms.js";

export class SubmitButton extends HTMLButtonElement {
    constructor() {
        super();
        this.spinner = document.createElement("span");
        this.spinner.classList.add("spinner-border");
        this.spinner.classList.add("spinner-border-sm");
    }

    connectedCallback() {
        this.type = "submit";
        this.classList.add("btn");
        this.classList.add("btn-primary");
    }

    static get observedAttributes() {
        return ["submitting"];
    }
    get submitting() {
        return this.getAttribute("submitting");
    }
    set submitting(value) {
        this.setAttribute("submitting", value);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "submitting") {
            oldValue = attributeValueToBool(oldValue);
            newValue = attributeValueToBool(newValue);
            if (oldValue == newValue) return;
            this.disabled = newValue;
            if (newValue) {
                this.prepend(this.spinner);
            } else {
                this.spinner.remove();
            }
        }
    }
}

customElements.define("button-submit", SubmitButton, { extends: "button" });
