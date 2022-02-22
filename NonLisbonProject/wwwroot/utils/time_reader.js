export function zero_first_format(value) {
    if (value < 10) {
        value = "0" + value;
    }
    return value;
}

export function getWeekDay(date) {
    let days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

    return days[date.getDay()];
}

export function _getMonth(date) {
    let month = ["Января", "Февраля", "Марта", "Апреля", "Майя", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

    return month[date.getMonth()];
}

export function getNowTime(){
    var current_datetime = new Date();
    //var day = zero_first_format(current_datetime.getDate());
    var hours = zero_first_format(current_datetime.getHours());
    var minutes = zero_first_format(current_datetime.getMinutes());
   
    //var day_week = getWeekDay(current_datetime);

    return "Сейчас " + hours + ":" + minutes;
}

