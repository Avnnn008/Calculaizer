/* Функция вычисления разницы дат.
Принимает год, месяц, число события, дату начала отсчета и формат представления результата.
Вовращает заголовок, разницу в днях, часах, минутах, секундах
 */

export const calculateDifference = (yearTo, monthTo, dayTo, dateFrom, format) => {
    let eventDate = new Date(`${yearTo}-${monthTo}-${dayTo} 00:00`);
  
    let timeNow = dateFrom.getTime()
    let timeEvent = eventDate.getTime()

    
    let difference, title, hours, minutes, seconds

    /* Определяется положение даты события относительно начала отсчета (раньше или позже).
    Высчитывается разница, определяется оответсвующий заголовок. */
    if (timeNow >= timeEvent) {
      difference= timeNow - timeEvent;
      title = `С ${eventDate.toLocaleDateString()} прошло`;
      /* Часы, минуты и секунды берутся по дате начала отсчета, если она больше даты события.
      Если dateFrom - текущая дата, часы, минуты и секунды - текущее время,
      если не текущая - часы, минуты и секуунды = 0, т.к. отсчет ведется между 00:00  */
hours = dateFrom.getHours() 
    minutes = dateFrom.getMinutes()
    seconds = dateFrom.getSeconds()
    } else {
difference = timeEvent - timeNow;
title = `До ${eventDate.toLocaleDateString()} осталось`;
/* Часы, минуты и секунды - раница между полуночью и часами, минутами и секундами dateFrom, если она раньше даты события*/
hours = 23- dateFrom.getHours()
    minutes = 59 - dateFrom.getMinutes()
    seconds = 60 - dateFrom.getSeconds()
    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    } 
    }

    let days = Math.floor(difference / 86400000);

    /* представление результата в ависимости от входного параметра format */
    if (format == 1) {
        hours += days*24
      }
  
      if (format == 2) {
        minutes = minutes + (hours + days*24)*60 
      }
  
      if (format == 3) {
        seconds = seconds + (minutes + (hours + days*24)*60)*60
      }

    return [title, days, hours, minutes, seconds]
}