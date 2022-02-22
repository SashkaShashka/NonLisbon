import api from "/utils/api.js";
import { getNowTime } from "../../utils/time_reader.js";
import { apiRequest } from "../../utils/api.js";
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
function getIconRequest() {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=51.5085&lon=-0.1257&appid=8e60906d7c520861f76a479b2765c285&units=metric&lang=ru")
        .then((response) => response.json())
        .then((imageBlob) => {
            console.log(imageBlob);
        });
}
const iconCard = document.querySelector("icon_weather");
const icon = await getIconRequest();
const timeNow = document.querySelector("#time_now");
console.log(timeNow.innerHTML);
timeNow.innerHTML = getNowTime();


