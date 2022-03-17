// добавить импорт api
// сделать функцию вызова апи
// сделать переменную, куда запишется массив "ссылок"
// вывести в console.log
import api from "/utils/api.js";
var city = "Москва";
var timezone = 3;
var latitude = 55.7504461;
var longitude = 37.6174943;
let indexTomorrow = 1;

function getInstagramRequest() {
    return api.get(
        "https://localhost:5001/api/instagram/10?filename=" + city
    );
}

var helpObject = await getInstagramRequest();

helpObject.forEach(element =>{
    console.log(element);
});


