import { pickUpWords } from "../utilities/pickUpWords";
import s from "../../datecalculator.module.css";
import { useSelector } from "react-redux";

/* Принимает 2 даты, между которыми высчитывается разница и формат представления результата. 
Возвращает HTML фрагмент с результатом в зависимости от принятого параметра format.*/
export default function CalculateTimeBetweenDates () {
  /* Высчитывается абсолютная разница в секундах, на основании этого результта высчитываются разницы в минутах, часах, днх */
  const {dateFrom, dateTo, format} = useSelector(state=>({
    dateFrom: state.calcReducer.dateFrom,/* дата для отсчета */
    dateTo: state.calcReducer.dateTo,/* дата для сравнения */
    format: state.calcReducer.dateFormat/* формат результата */
  }))

  const seconds =
    Math.abs(new Date(dateFrom).getTime() - new Date(dateTo).getTime()) / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  /* подбор слов по падежам к каждому числу */
  let [daysWord, hoursWord, minutesWord, secondsWord] = pickUpWords(
    days,
    hours,
    minutes,
    seconds
  );


  return (
    <>
      <div className={s.title}>{`Разница:`}</div>
      {format == 0 && (
        <div className={s.time}>
          <div>{`${days} ${daysWord}`} </div>
        </div>
      )}

      {format == 1 && (
        <div className={s.time}>
          <div>{`${hours} ${hoursWord}`} </div>
        </div>
      )}

      {format == 2 && (
        <div className={s.time}>
          <div>{`${minutes} ${minutesWord}`} </div>
        </div>
      )}

      {format == 3 && (
        <div className={s.time}>
          <div>{`${seconds}`} </div>
          <div>{`${secondsWord}`} </div>
        </div>
      )}
    </>
  )
};
