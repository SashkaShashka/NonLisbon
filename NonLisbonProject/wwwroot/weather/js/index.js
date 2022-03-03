import api from "/utils/api.js";
import { getNowTime, _getMonth } from "../../utils/time_reader.js";
const KeyAPI = "8e60906d7c520861f76a479b2765c285";
var city;
var date = {};
var timezone;
var latitude;
var longitude;
let weatherNow = {};
let weathers = [];
let weatherToday = [];
let indexTomorrow = 1;

var cities = [
    { name: "Москва", latitude: 55.7504461, longitude: 37.6174943, timezone: 3 },
    { name: "Дели", latitude: 28.6517178, longitude: 77.2219388, timezone: 5.5 },
    { name: "Самара", latitude: 53.2028, longitude: 50.1408, timezone: 4 },
    { name: "Нью-Йорк", latitude: 40.7127281, longitude: -74.0060152, timezone: -5 },
    { name: "Лондон", latitude: 51.5073219, longitude: -0.1276474, timezone: 0 },
    { name: "Париж", latitude: 48.8588897, longitude: 2.3200410217200766, timezone: 1 },
    { name: "Токио", latitude: 35.6828387, longitude: 139.7594549, timezone: 9 },
    { name: "Мадрид", latitude: 40.4167047, longitude: -3.7035825, timezone: 1 },
    { name: "Рим", latitude: 41.8933203, longitude: 12.4829321, timezone: 1 },
    { name: "Сидней", latitude: -33.768528, longitude: 150.9568559523945, timezone: 11 },
];

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
    console.log("Разница " + workDate.getTimezoneOffset() + " " + timezone * 60);
    if (preDay) {
        workDate.setDate(workDate.getDate() - 1);
        console.log("По идее ночь предыдущего дня:" + workDate);
    } else {
        console.log("По идее ночь сегодняшнего дня:" + workDate);
    }
    workDate = Math.floor(workDate.getTime() / 1000);
    console.log(workDate);

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
    console.log(latitude);
    console.log(longitude);
    city = (await getCoordinate())[0].local_names.ru;
    console.log(city);

    // перерисовать страницу
    panel.classList.add("visually-hidden");
    container.innerHTML = "";
    loading.innerHTML = spinnerInTable;
    await getAllWeather();

    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + timezone * 60);
    loading.innerHTML = "";
    panel.classList.remove("visually-hidden");
    addCity(city, true);
    fillCards();
    console.log("success");
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + timezone * 60);
    loading.innerHTML = "";
    panel.classList.remove("visually-hidden");
    fillCards(0);
    console.log("error");
}
function findIndexNow() {
    console.log("Дата сейчас, прямо сейчас: " + date);
    console.log("timezone:" + timezone);
    date.setUTCHours(0, 0, 0, 0);
    console.log("Дата сегодня полночь date: " + date);
    var helpTime = (date.getTime() - Math.round(timezone) * 3600 * 1000) / 1000;
    console.log("Дата сегодня полночь helpTime: " + helpTime);
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
        //console.log(weathers);
        //console.log(weatherOfDay);
        //console.log(indexTomorrow);
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
        console.log(indexToday);
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
async function getAllWeather() {
    date = new Date();
    weathers = [];
    weatherToday = [];
    var helpObject = await getWeathersRequest();
    console.log(helpObject);
    timezone = helpObject.timezone_offset / 3600;
    console.log("timezone: " + timezone);
    // заполнили вчера
    for (const iterator of (await getWeatherRequestToday(true)).hourly) {
        weatherToday.push(iterator);
    }
    console.log(weatherToday);
    console.log("Сегодня");
    // заполнили сегодня прошеднее
    for (const iterator of (await getWeatherRequestToday()).hourly) {
        weatherToday.push(iterator);
        console.log(iterator);
    }
    weatherToday.pop();
    console.log("До конца дня");
    //заполнили до конца дня+
    for (const iterator of helpObject.hourly) {
        weatherToday.push(iterator);
        console.log(iterator);
    }
    console.log("Закончили");
    // запомнили сейчас
    weatherNow = helpObject.current;
    // заполнили на все дни
    for (const iterator of helpObject.daily) {
        weathers.push(iterator);
    }
    console.log(weatherToday);
    var inn = 0;
    weatherToday.forEach((element) => {
        console.log(inn++ + "   " + new Date(element.dt * 1000));
    });
}

function fillCites() {
    select_city.innerHTML = "";
    for (let city of cities) {
        const Option = document.createElement("option");
        Option.setAttribute("value", city.name);
        Option.innerText = city.name;
        select_city.append(Option);
    }
}

function setCity(index) {
    city = cities[index].name;
    latitude = cities[index].latitude;
    longitude = cities[index].longitude;
    timezone = cities[index].timezone;
}

function addCity(name, selected = false, ADD = false) {
    const Option = document.createElement("option");
    Option.setAttribute("value", name);
    Option.innerText = name;

    select_city.append(Option);
    if (selected) {
        select_city.value = name;
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

select_city.addEventListener(
    "change",
    async function () {
        if (this.value != city) {
            let index = 0;
            for (; index < cities.length; index++) {
                if (this.value == cities[index].name) break;
            }
            setCity(index);
            console.log(city);

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
setCity(0);
await getAllWeather();

navigator.geolocation.getCurrentPosition(await success, error);
