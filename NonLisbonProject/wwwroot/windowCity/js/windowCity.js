import api from "/utils/api.js";

const KeyAPI = "14ad920bb45256b5fdd0f59c75dbd86c";
var city = "Москва";
var nameEng = "Moscow";
var id = 17326249;
var nameInst = "moscow-russia";
var latitude = 55.7504461;
var longitude = 37.6174943;
let weatherNow = {};

var defaultCities = [
    { name: "Москва", nameEng: "Moscow", id: "17326249", nameInst: "moscow-russia", latitude: 55.7504461, longitude: 37.6174943 },
    { name: "Дели", nameEng: "Deli", id: "215141266", nameInst: "delhi-india", latitude: 28.6517178, longitude: 77.2219388 },
    { name: "Нью-Йорк", nameEng: "NewYork", id: "486560663", nameInst: "new-york-city-ny", latitude: 40.7127281, longitude: -74.0060152 },
    { name: "Лондон", nameEng: "London", id: "213385402", nameInst: "london", latitude: 51.5073219, longitude: -0.1276474 },
    { name: "Париж", nameEng: "Paris", id: "101870431224971", nameInst: "paris-france", latitude: 48.8588897, longitude: 2.3200410217200766 },
    { name: "Токио", nameEng: "Tokyo", id: "104373574421310", nameInst: "tokyo-japan", latitude: 35.6828387, longitude: 139.7594549 },
    { name: "Мадрид", nameEng: "Madrid", id: "127963847", nameInst: "madrid", latitude: 40.4167047, longitude: -3.7035825 },
    { name: "Рим", nameEng: "Rome", id: "31499759", nameInst: "rome", latitude: 41.8933203, longitude: 12.4829321 },
    { name: "Сидней", nameEng: "Sydney", id: "213011753", nameInst: "sydney", latitude: -33.768528, longitude: 150.9568559523945 },
];
var cities = new Map();
for (var _city of defaultCities) {
    cities.set(_city.name, { nameEng: _city.nameEng, id: _city.id, nameInst: _city.nameInst, latitude: _city.latitude, longitude: _city.longitude });
}

function fillCites() {
    select_city.innerHTML = "";
    for (var city of cities.keys()) {
        const _option = document.createElement("option");
        _option.setAttribute("value", city);
        _option.innerText = city;
        select_city.append(_option);
    }
}

function getInstagramRequest(id, nameInst) {
    return api.get("https://localhost:5001/api/instagram/100?filename=images?id=" + id + "&nameInst=" + nameInst);
}

function getWeatherRequest() {
    return api.get(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&appid=" +
            KeyAPI +
            "&exclude=minutely,alerts,hourly,daily" +
            "&units=metric&lang=ru"
    );
}

function getClothesRequest() {
    return api.get(
        "https://localhost:5001/api/clothes?city=" + nameEng + "&weatherId=" + weatherNow.weather[0].id + "&temperature=" + weatherNow.temp
    );
}

async function getWeatherNow() {
    var helpObject = await getWeatherRequest();
    // запомнили сейчас
    weatherNow = helpObject.current;
    console.log(weatherNow);
}
function getCountImage() {
    return api.get("https://localhost:5001/api/instagram?city=" + nameEng);
}
async function getPhoto(id, nameInst) {
    var first = true;
    var countImages = await getCountImage();
    await getWeatherNow();
    prediction.innerText = await getClothesRequest();
    for (let index = 0; index < countImages; index++) {
        let carouselItem = templateCarousel.content.cloneNode(true);
        carouselItem.querySelector("#image").setAttribute("src", "/photo/" + nameEng + "/" + index + ".jpg");

        if (first) {
            carouselItem.lastElementChild.classList.add("active");
            first = false;
        }
        carousel.append(carouselItem);
    }
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
const select_city = document.querySelector("#select_city");
const prediction = document.querySelector("#prediction");
const buttonCity = document.querySelector("#buttonCity");

panel.classList.add("visually-hidden");
loading.innerHTML = spinnerInTable;
fillCites();

select_city.addEventListener(
    "change",
    async function () {
        if (this.value != city) {
            city = this.value;
            nameEng = cities.get(this.value).nameEng;
            id = cities.get(this.value).id;
            nameInst = cities.get(this.value).nameInst;
            latitude = cities.get(this.value).latitude;
            longitude = cities.get(this.value).longitude;
            buttonCity.setAttribute("href", "../index.html?city=" + nameEng);
            //перерисовать страницу
            panel.classList.add("visually-hidden");
            carousel.innerHTML = "";
            loading.innerHTML = spinnerInTable;
            var check = await getPhoto(id, nameInst);

            loading.innerHTML = "";
            panel.classList.remove("visually-hidden");
        }
    },
    false
);

let cityParam = new URLSearchParams(window.location.search).get("city");
console.log(cityParam);
if (typeof cityParam != "undefined") {
    for (var cityVal of cities.keys()) {
        if (cities.get(cityVal).nameEng == cityParam) {
            city = cityVal;
            nameEng = cities.get(cityVal).nameEng;
            id = cities.get(cityVal).id;
            nameInst = cities.get(cityVal).nameInst;
            latitude = cities.get(cityVal).latitude;
            longitude = cities.get(cityVal).longitude;
            select_city.value = city;
            break;
        }
    }
}

buttonCity.setAttribute("href", "../index.html?city=" + nameEng);
await getWeatherNow();
var check = await getPhoto(id, nameInst);
panel.classList.remove("visually-hidden");
loading.innerHTML = "";
