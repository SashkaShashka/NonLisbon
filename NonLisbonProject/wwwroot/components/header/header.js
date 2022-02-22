import { zero_first_format, getWeekDay, _getMonth } from "/utils/time_reader.js";

export class SuperAuthHeader extends HTMLElement {
    constructor() {
        super();
        const header = document.createElement("header");
        header.classList.add("navbar", "navbar-expand-lg", "navbar-dark", "bg-primary");
        const head = document.createElement("div");
        head.classList.add("container-fluid", "px-4");
        const helpDiv = document.createElement("div");
        const image = document.createElement("img");
        image.setAttribute("height", "60em");
        image.setAttribute("width", "60em");
        image.setAttribute("src", "/weather/icon.png");
        image.classList.add("me-3");
        const title = document.createElement("a");
        title.setAttribute("href", "/index.html");
        title.classList.add("navbar-brand");
        title.setAttribute("id", "titlePage");
        title.innerText = "Что-то";
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");
        ul.classList.add("navbar-nav", "me-auto", "mx-sm-3");
        ul.setAttribute("id", "headNav");
        nav.append(ul);
        helpDiv.append(image);
        helpDiv.append(title);
        head.append(helpDiv);
        head.append(nav);
        var date_time = document.createElement("div");
        date_time.setAttribute("id", "date_time");
        head.append(date_time);
        header.append(head);
        this.append(header);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const li = document.createElement("li");
        li.className = "nav-item";
        const a = document.createElement("a");
        a.classList.add("nav-link");
        li.append(a);
        const headNav = document.querySelector("#headNav");

        const page = location.pathname.substring(1, location.pathname.indexOf("/", 1));

        const li1 = li.cloneNode(true);
        li1.firstChild.innerText = "Погода";
        li1.firstChild.setAttribute("href", "/index.html");
        if (page === "staff" || page === "/") {
            li1.firstChild.classList.add("active");
        }

        headNav.append(li1);

        const li2 = li.cloneNode(true);
        li2.firstChild.innerText = "Одеться в путешествие";
        li2.firstChild.setAttribute("href", "/travel/index.html");
        if (page === "travel") {
            li2.firstChild.classList.add("active");
        }

        headNav.append(li2);

        const li3 = li.cloneNode(true);
        li3.firstChild.innerText = "Окно в город";
        li3.firstChild.setAttribute("href", "/windowCity/index.html");
        if (page === "windowCity") {
            li3.firstChild.classList.add("active");
        }

        headNav.append(li3);

        const date_time = document.querySelector("#date_time");
        //date_time.setAttribute("style", "font-size: medium; color:white");
        date_time.classList.add("color_datetime", "navbar-brand");
        date_time.innerHTML = this.date_time();
    }

    date_time() {
        var current_datetime = new Date();
        var day = zero_first_format(current_datetime.getDate());
        var month = _getMonth(current_datetime);

        var day_week = getWeekDay(current_datetime);

        return day + " " + month + ", " + day_week;
    }
    static get observedAttributes() {
        return ["value"];
    }

    set value(_value) {
        this.setAttribute("value", _value);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue) return;
        switch (name) {
            case "value":
                const form = this.querySelector("#titlePage");
                console.log(form);
                form.innerHTML = newValue;
                break;
            default:
                this.input.setAttribute(name, newValue);
                break;
        }
    }
}
customElements.define("my-header", SuperAuthHeader);
