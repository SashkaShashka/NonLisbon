export class AlertMessage extends HTMLElement {
    connectedCallback() {
        this.style.display = "block";
        this.classList.add("my-3");
        this.classList.add("alert");
        this.color = "danger";
    }

    static get observedAttributes() {
        return ["color"];
    }

    get color() {
        return this.getAttribute(color);
    }
    set color(value) {
        this.setAttribute("color", value);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "color":
                this.changeColor(oldValue, newValue);
                break;
        }
    }

    changeColor(oldValue, newValue) {
        if (oldValue != newValue) {
            this.classList.remove("alert-" + oldValue);
            this.style.color = null;
            if (["danger", "warning", "info", "success"].includes(newValue)) {
                this.classList.add("alert-" + newValue);
            } else {
                this.style.color = color;
            }
        }
    }
}

customElements.define("alert-message", AlertMessage);
