import api from "/utils/api.js";
import { getNowTime, _getMonth } from "../../utils/time_reader.js";
const KeyAPI = "8e60906d7c520861f76a479b2765c285";
var city = "Москва";
var date = {};
var timezone = 3;
var latitude = 55.7504461;
var longitude = 37.6174943;
let weatherNow = {};
let weathers = [];
let weatherToday = [];
let indexTomorrow = 1;
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
    workDate.setMinutes(workDate.getMinutes() + workDate.getTimezoneOffset() + timezone * 60);
    if (preDay) {
        workDate.setDate(workDate.getDate() - 1);
    }
    console.log(workDate);
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
    console.log(latitude);
    console.log(longitude);
    city = (await getCoordinate())[0].local_names.ru;
    console.log(city);
    // перерисовать страницу
    loading.innerHTML = spinnerInTable;
    await getAll();

    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + timezone * 60);
    loading.innerHTML = "";
    panel.classList.remove("visually-hidden");
    fillCards(0);
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
    date.setUTCHours(-timezone, 0, 0, 0);
    var helpTime = date.getTime() / 1000;
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
async function getAll() {
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
    console.log(weatherToday);
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
panel.classList.add("visually-hidden");
loading.innerHTML = spinnerInTable;
await getAll();
navigator.geolocation.getCurrentPosition(await success, error);
