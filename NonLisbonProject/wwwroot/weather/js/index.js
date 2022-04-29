import api from "/utils/api.js";
import { getNowTime, _getMonth } from "../../utils/time_reader.js";
const KeyAPI = "14ad920bb45256b5fdd0f59c75dbd86c";
var date = {};
var city = "Москва";
var nameEng = "Moscow";
var timezone = 3;
var latitude = 55.7504461;
var longitude = 37.6174943;
let weatherNow = {};
let weathers = [];
let weatherToday = [];
let indexTomorrow = 1;

var defaultCities = [
    { name: "Москва", nameEng: "Moscow", latitude: 55.7504461, longitude: 37.6174943, timezone: 3 },
    { name: "Дели", nameEng: "Deli", latitude: 28.6517178, longitude: 77.2219388, timezone: 5.5 },
    { name: "Нью-Йорк", nameEng: "NewYork", latitude: 40.7127281, longitude: -74.0060152, timezone: -5 },
    { name: "Лондон", nameEng: "London", latitude: 51.5073219, longitude: -0.1276474, timezone: 0 },
    { name: "Париж", nameEng: "Paris", latitude: 48.8588897, longitude: 2.3200410217200766, timezone: 1 },
    { name: "Токио", nameEng: "Tokyo", latitude: 35.6828387, longitude: 139.7594549, timezone: 9 },
    { name: "Мадрид", nameEng: "Madrid", latitude: 40.4167047, longitude: -3.7035825, timezone: 1 },
    { name: "Рим", nameEng: "Rome", latitude: 41.8933203, longitude: 12.4829321, timezone: 1 },
    { name: "Сидней", nameEng: "Sydney", latitude: -33.768528, longitude: 150.9568559523945, timezone: 11 },
];
var cities = new Map();
for (var _city of defaultCities) {
    cities.set(_city.name, { nameEng: _city.nameEng, latitude: _city.latitude, longitude: _city.longitude, timezone: _city.timezone });
}
function getCoordinate() {
    return api.get("https://api.openweathermap.org/geo/1.0/reverse?lat=" + latitude + "&lon=" + longitude + "&appid=" + KeyAPI + "&limit=1");
}
function getWeathersRequest() {
    return api.get(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&appid=" +
            KeyAPI +
            "&exclude=minutely,alerts" +
            "&units=metric&lang=ru"
    );
}
function getWeatherRequestToday(preDay = false) {
    var workDate = new Date();
    workDate.setHours(workDate.getHours() - 2);
    if (preDay) {
        workDate.setDate(workDate.getDate() - 1);
    }
    workDate = Math.floor(workDate.getTime() / 1000);

    return api.get(
        "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&appid=" +
            KeyAPI +
            "&dt=" +
            workDate +
            "&units=metric&lang=ru"
    );
}

async function success(pos) {
    var crd = pos.coords;
    latitude = crd.latitude;
    longitude = crd.longitude;
    city = (await getCoordinate())[0].local_names.ru;
    if (typeof cityParam != "undefined" && cityParam != null) {
        addCity(false, getTimezone());
        for (var cityVal of cities.keys()) {
            if (cities.get(cityVal).nameEng == cityParam) {
                city = cityVal;
                nameEng = cities.get(cityVal).nameEng;
                latitude = cities.get(cityVal).latitude;
                longitude = cities.get(cityVal).longitude;
                timezone = cities.get(cityVal).timezone;
                select_city.value = city;
                break;
            }
        }
    } else {
        addCity(true, getTimezone());
    }
    // перерисовать страницу
    panel.classList.add("visually-hidden");
    container.innerHTML = "";
    loading.innerHTML = spinnerInTable;
    await getAllWeather();

    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + timezone * 60);
    loading.innerHTML = "";
    panel.classList.remove("visually-hidden");
    fillCards();
    console.log("success");
}

async function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    if (typeof cityParam != "undefined" && cityParam != null) {
        for (var cityVal of cities.keys()) {
            if (cities.get(cityVal).nameEng == cityParam) {
                city = cityVal;
                nameEng = cities.get(cityVal).nameEng;
                latitude = cities.get(cityVal).latitude;
                longitude = cities.get(cityVal).longitude;
                timezone = cities.get(cityVal).timezone;
                select_city.value = city;
                break;
            }
        }
    }
    await getAllWeather();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + timezone * 60);
    loading.innerHTML = "";
    panel.classList.remove("visually-hidden");

    fillCards();
    buttonCity.setAttribute("href", "./windowCity/index.html?city=" + nameEng);
    console.log("error");
}
function findIndexNow() {
    date.setUTCHours(0, 0, 0, 0);
    var helpTime = (date.getTime() - Math.round(timezone) * 3600 * 1000) / 1000;
    for (let index = 0; index < weatherToday.length; index++) {
        if (weatherToday[index].dt == helpTime) {
            return index;
        }
    }
}
function fillCards() {
    for (let index = 0; index < 5; index++) {
        if (index == 0) {
            let cardDay = templateMainCard.content.cloneNode(true);
            fillCard(cardDay, index, true);
            container.prepend(cardDay);
        } else {
            let cardDay = templateCard.content.cloneNode(true);
            fillCard(cardDay, index);
            container.append(cardDay);
        }
    }
    indexTomorrow = 1;
}
function fillCard(card, indexDay, main = false) {
    switch (indexDay) {
        case 0:
            card.querySelector("#dayName").innerHTML = getNowTime(date);
            break;
        case 1:
            card.querySelector("#dayName").innerHTML = "Завтра";
            date.setDate(date.getDate() + 2);
            break;
        default:
            card.querySelector("#dayName").innerHTML = date.getDate() + " " + _getMonth(date);
            date.setDate(date.getDate() + 1);
    }
    if (!main) {
        var weatherOfDay = weathers[indexTomorrow];
        card.querySelector("#degrees").innerHTML = Math.round(weatherOfDay.temp.day) + "&deg";
        card.querySelector("#icon_weather").setAttribute("src", "http://openweathermap.org/img/wn/" + weatherOfDay.weather[0].icon + "@2x.png");
        var description = weatherOfDay.weather[0].description;
        card.querySelector("#description").innerHTML = description[0].toUpperCase() + description.substring(1);
        card.querySelector("#wind").innerHTML = weatherOfDay.wind_speed.toFixed(1) + " м/с, " + directionByDergees(weatherOfDay.wind_deg);
        card.querySelector("#water").innerHTML = weatherOfDay.humidity + "%";
        indexTomorrow += 1;
    } else {
        card.querySelector("#city").innerHTML = city;
        card.querySelector("#degrees").innerHTML = Math.round(weatherNow.temp) + "&deg";
        card.querySelector("#icon_weather").setAttribute("src", "http://openweathermap.org/img/wn/" + weatherNow.weather[0].icon + "@2x.png");
        var description = weatherNow.weather[0].description;
        card.querySelector("#description").innerHTML = description[0].toUpperCase() + description.substring(1);
        card.querySelector("#feels_like").innerHTML = "Ощущается как " + Math.round(weatherNow.feels_like) + "&deg";
        card.querySelector("#wind").innerHTML = weatherNow.wind_speed.toFixed(1) + " м/с, " + directionByDergees(weatherNow.wind_deg);
        card.querySelector("#water").innerHTML = weatherNow.humidity + "%";
        var indexToday = findIndexNow();
        card.querySelector("#morning").lastElementChild.innerHTML = Math.round(weatherToday[indexToday + 6].temp) + "&deg";
        card.querySelector("#morning")
            .querySelector("#img")
            .setAttribute("src", "http://openweathermap.org/img/wn/" + weatherToday[indexToday + 6].weather[0].icon + "@2x.png");
        card.querySelector("#day").lastElementChild.innerHTML = Math.round(weatherToday[indexToday + 12].temp) + "&deg";
        card.querySelector("#day")
            .querySelector("#img")
            .setAttribute("src", "http://openweathermap.org/img/wn/" + weatherToday[indexToday + 12].weather[0].icon + "@2x.png");
        card.querySelector("#evening").lastElementChild.innerHTML = Math.round(weatherToday[indexToday + 18].temp) + "&deg";
        card.querySelector("#evening")
            .querySelector("#img")
            .setAttribute("src", "http://openweathermap.org/img/wn/" + weatherToday[indexToday + 18].weather[0].icon + "@2x.png");
        card.querySelector("#night").lastElementChild.innerHTML = Math.round(weatherToday[indexToday + 24].temp) + "&deg";
        card.querySelector("#night")
            .querySelector("#img")
            .setAttribute("src", "http://openweathermap.org/img/wn/" + weatherToday[indexToday + 24].weather[0].icon + "@2x.png");
    }
}
//
function directionByDergees(dergees) {
    if (dergees < 22.5) return "С";
    if (dergees < 67.5) return "СВ";
    if (dergees < 112.5) return "В";
    if (dergees < 157.5) return "ЮВ";
    if (dergees < 202.5) return "Ю";
    if (dergees < 247.5) return "ЮЗ";
    if (dergees < 292.5) return "З";
    if (dergees < 337.5) return "СЗ";
    return "С";
}
async function getTimezone() {
    var helpObject = await getWeathersRequest();
    return helpObject.timezone_offset / 3600;
}
async function getAllWeather() {
    date = new Date();
    weathers = [];
    weatherToday = [];
    var helpObject = await getWeathersRequest();
    timezone = helpObject.timezone_offset / 3600;
    // заполнили вчера
    for (const iterator of (await getWeatherRequestToday(true)).hourly) {
        weatherToday.push(iterator);
    }
    // заполнили сегодня прошеднее
    for (const iterator of (await getWeatherRequestToday()).hourly) {
        weatherToday.push(iterator);
    }
    weatherToday.pop();
    //заполнили до конца дня+
    for (const iterator of helpObject.hourly) {
        weatherToday.push(iterator);
    }
    // запомнили сейчас
    weatherNow = helpObject.current;
    // заполнили на все дни
    for (const iterator of helpObject.daily) {
        weathers.push(iterator);
    }
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

function addCity(selected = false, _timezone) {
    if (!cities.has(city)) {
        cities.set(city, { latitude: latitude, longitude: longitude, timezone: _timezone });
        const _option = document.createElement("option");
        _option.setAttribute("value", city);
        _option.innerText = city;
        select_city.append(_option);
    }
    if (selected) {
        select_city.value = city;
    }
}

const spinnerInTable = `<div class="d-flex justify-content-center mt-5">
        <div class="spinner-border font-style-spinner" role="status">
          <span class="visually-hidden"></span>
        </div>
    </div>`;
const templateCard = document.querySelector("#CardOfWeather");
const templateMainCard = document.querySelector("#main_card");
const container = document.querySelector("#main_container");
const panel = document.querySelector("#find_panel");

const loading = document.querySelector("#loading");
const select_city = document.querySelector("#select_city");
panel.classList.add("visually-hidden");

const buttonCity = document.querySelector("#buttonCity");

select_city.addEventListener(
    "change",
    async function () {
        if (this.value != city) {
            city = this.value;
            nameEng = cities.get(this.value).nameEng;
            latitude = cities.get(this.value).latitude;
            longitude = cities.get(this.value).longitude;
            timezone = cities.get(this.value).timezone;
            buttonCity.setAttribute("href", "./windowCity/index.html?city=" + nameEng);
            //перерисовать страницу
            panel.classList.add("visually-hidden");
            container.innerHTML = "";
            loading.innerHTML = spinnerInTable;
            await getAllWeather();
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + timezone * 60);
            loading.innerHTML = "";
            panel.classList.remove("visually-hidden");
            fillCards();
        }
    },
    false
);

loading.innerHTML = spinnerInTable;
fillCites();
let cityParam = new URLSearchParams(window.location.search).get("city");
navigator.geolocation.getCurrentPosition(await success, await error);
