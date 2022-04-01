import api from "/utils/api.js";
var city = "Москва";
var timezone = 3;
var latitude = 55.7504461;
var longitude = 37.6174943;
let indexTomorrow = 1;

function getInstagramRequest() {
    return api.get("https://localhost:5001/api/instagram/10?filename=images");
}
async function getPhoto() {
    var ans = await getInstagramRequest();
    if (ans == false){
        console.error("Ошибка " + 503)
        alert.innerHTML = Alert;
        return false;
    }
    return true;
}
const spinnerInTable = `<div class="d-flex justify-content-center mt-5">
        <div class="spinner-border font-style-spinner" role="status">
          <span class="visually-hidden"></span>
        </div>
    </div>`;

const Alert = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </symbol>
</svg>
<div class="alert alert-danger d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
    <div>
        Сервер не отвечает, попробуйте позже
    </div>
</div>`;

const loading = document.querySelector("#loading");
const carousel = document.querySelector("#carousel");
const panel = document.querySelector("#main_panel");
const templateCarousel = document.querySelector("#carousel_item");
const alert = document.querySelector("#alert");

panel.classList.add("visually-hidden");
loading.innerHTML = spinnerInTable;

var check = await getPhoto();
var first = true;
if (check){
    for (let index = 0; index < 10; index++) {
        let carouselItem = templateCarousel.content.cloneNode(true);
        console.log(carouselItem);
        carouselItem.querySelector("#image").setAttribute("src", "/images/" + index + ".jpg");

        if (first) {
            carouselItem.lastElementChild.classList.add("active");
            first = false;
        }
        carousel.append(carouselItem);
    }
    panel.classList.remove("visually-hidden");
}
loading.innerHTML = "";

