import api from "/utils/api.js";
import { getNowTime, _getMonth } from "../../utils/time_reader.js";
/*
function getIconRequest() {
    fetch("http://openweathermap.org/img/wn/10d@2x.png")
        .then((response) => response.blob())
        .then((imageBlob) => {
            // Then create a local URL for that image and print it
            const imageObjectURL = URL.createObjectURL(imageBlob);
            console.log(imageObjectURL);
        });
}
const iconCard = document.querySelector("icon_weather");
const icon = await getIconRequest();
*/

const KeyAPI = "8e60906d7c520861f76a479b2765c285";
var latitude = 53.2106474;
var longitude = 50.1901868;
let weather;
function getWeatherRequest(lat, lon, key) {
    return api.get("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=metric&lang=ru");
}

//
var options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    var crd = pos.coords;
    latitude = crd.latitude;
    console.log(latitude);
    longitude = crd.longitude;
    console.log(longitude);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    console.log("Сука, дай местоположение свое!");
}

async function fillCards(mainDay) {
    for (let index = 0; index < 5; index++) {
        if (index == mainDay) {
            let day = templateMainCard.content.cloneNode(true);
            fillCard(day, index, true);
            container.prepend(day);
        } else {
            let day = templateCard.content.cloneNode(true);
            fillCard(day, index);
            container.append(day);
        }
    }
}
function findIndexNextDay(weather) {
    for (let i = 0; i < weather.list.length; i++) {
        const element = weather.list[i].dt_txt;
        if (element.includes("-" + (date.getDate() + 1))) {
            return i;
        }
    }
}
function fillCard(card, indexDay, main = false) {
    switch (indexDay) {
        case 0:
            if (main) {
                card.querySelector("#dayName").innerHTML = getNowTime(date);
            } else {
                card.querySelector("#dayName").innerHTML = "Сегодня";
            }
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
        intexTomorrow += 4;
        var weatherOfDat = weather.list[intexTomorrow];
        card.querySelector("#degrees").innerHTML = Math.round(weatherOfDat.main.temp) + "&deg";
        card.querySelector("#icon_weather").setAttribute("src", "http://openweathermap.org/img/wn/" + weatherOfDat.weather[0].icon + "@2x.png");
        var description = weatherOfDat.weather[0].description;
        card.querySelector("#description").innerHTML = description[0].toUpperCase() + description.substring(1);
        card.querySelector("#wind").innerHTML = weatherOfDat.wind.speed.toFixed(1) + " м/с, " + directionByDergees(weatherOfDat.wind.deg);
        card.querySelector("#water").innerHTML = weatherOfDat.main.humidity + "%";
        intexTomorrow += 4;
    } else {
        var weatherOfDat = weather.list[intexTomorrow];

        card.querySelector("#degrees").innerHTML = Math.round(weatherOfDat.main.temp) + "&deg";
        card.querySelector("#icon_weather").setAttribute("src", "http://openweathermap.org/img/wn/" + weatherOfDat.weather[0].icon + "@2x.png");
        var description = weatherOfDat.weather[0].description;
        card.querySelector("#description").innerHTML = description[0].toUpperCase() + description.substring(1);
        card.querySelector("#wind").innerHTML = weatherOfDat.wind.speed.toFixed(1) + " м/с, " + directionByDergees(weatherOfDat.wind.deg);
        card.querySelector("#water").innerHTML = weatherOfDat.main.humidity + "%";
        intexTomorrow += 4;
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

const templateCard = document.querySelector("#CardOfWeather");
const templateMainCard = document.querySelector("#main_card");
const container = document.querySelector("#main_container");
var date = new Date();
weather = await getWeatherRequest(latitude, longitude, KeyAPI);
var intexTomorrow = findIndexNextDay(weather);
const iconCard = document.querySelector("icon_weather");
navigator.geolocation.getCurrentPosition(success, error, options);
fillCards(4);
