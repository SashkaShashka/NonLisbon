import api from "/utils/api.js";
var city = "Москва";
var timezone = 3;
var latitude = 55.7504461;
var longitude = 37.6174943;
let indexTomorrow = 1;

function getInstagramRequest() {
    return api.get("https://localhost:5001/api/instagram/10?filename=images");
}
const spinnerInTable = `<div class="d-flex justify-content-center mt-5">
        <div class="spinner-border font-style-spinner" role="status">
          <span class="visually-hidden"></span>
        </div>
    </div>`;

const loading = document.querySelector("#loading");
const carousel = document.querySelector("#carousel");
const panel = document.querySelector("#main_panel");
const templateCarousel = document.querySelector("#carousel_item");
panel.classList.add("visually-hidden");
loading.innerHTML = spinnerInTable;
await getInstagramRequest();
var first = true;
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
loading.innerHTML = "";
panel.classList.remove("visually-hidden");
