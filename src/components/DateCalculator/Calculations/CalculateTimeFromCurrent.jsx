import { useEffect, useState } from 'react';
import { calculateDifference } from '../utilities/calculateDifference';
import { pickUpWords } from '../utilities/pickUpWords';
import s from '../../datecalculator.module.css'
import { useSelector } from 'react-redux';
import { TYPESOFCALCULATION } from '../constants';


/* Рассчет времени от текущего до события или наоборот.
dateTo - дата события, 
dateType - тип вычисления (в данном случае интересует из списка или своя дата), 
dateFormat - формат представления результата.
Возвращает HTML фрагмент с результатом в зависимости от формата */

export default function CalculateTimeFromCurrent () {
  const {dateTo, dateType, dateFormat} = useSelector(state=>({
    dateTo: state.calcReducer.dateTo,
  dateType: state.calcReducer.dateType,
dateFormat: state.calcReducer.dateFormat}))
    let MONTH = new Date().getMonth() + 1;
    let DAY = new Date().getDay();
    let date = new Date(dateTo)
    let dayTo = date.getDate();
    let monthTo = date.getMonth() + 1;
    let yearTo = date.getFullYear();
    const [dateFrom, setDateFrom] = useState(new Date())

    /* В качестве даты начала отсчета устанавливается текущая */
    useEffect(() => {
      setInterval(() => {
      setDateFrom(new Date());
    }, 500);
  }, [dateFrom]);

  /* Ограничение ввода даты */
    if (yearTo < 1000 || yearTo > 9999) {
      return (
        <>
      <div style={{color: 'var(--orange-color)'}}>Минимальная дата:</div>
      <div>01.01.1000</div>
      <div style={{marginTop: '30px', color: 'var(--orange-color)'}}>Максимальная дата:</div>
      <div>31.12.9999</div>
      </>)
    }

    /* Если событие выбирается из списка, его год устанавливается так, чтобы событие было позже текущей даты */
    if (dateType===TYPESOFCALCULATION.LIST) {
      if (monthTo < MONTH || (monthTo === MONTH && dayTo <= DAY)) {
        yearTo += 1;
      }
    }
    
    /* Представление дней и месяцев в формате dd, mm */
    if (dayTo < 10) {
      dayTo = `0${dayTo}`;
    }

    if (monthTo < 10) {
      monthTo = `0${monthTo}`;
    }

    /* Получение результатов из функции вычисления раззницы дат */
   let [title, days, hours, minutes, seconds] = calculateDifference(yearTo, monthTo, dayTo, dateFrom, dateFormat)

   /* Подбор к результатам вычислений подходящих по падежам слов */
    let [daysWord, hoursWord, minutesWord, secondsWord] = pickUpWords(
      days,
      hours,
      minutes,
      seconds
    );

    return (
      <>
        <div className={s.title}>{`${title}:`}</div>
        {dateFormat == 0 &&
        <div className={s.time}>
          <div>{`${days} ${daysWord}`} </div>
          <div>{`${hours} ${hoursWord} ${minutes} ${minutesWord}`} </div>
          <div>{`${seconds} ${secondsWord}`} </div>
        </div>}


        {dateFormat == 1 &&
        <div className={s.time}>
          <div>{`${hours} ${hoursWord}`} </div>
          <div>{`${minutes} ${minutesWord}`} </div>
          <div>{`${seconds} ${secondsWord}`} </div>
        </div>}

        {dateFormat == 2 &&
        <div className={s.time}>
          <div>{`${minutes} ${minutesWord}`} </div>
          <div>{`${seconds} ${secondsWord}`} </div>
        </div>}

        {dateFormat == 3 &&
        <div className={s.time}>
          <div>{`${seconds}`} </div>
          <div>{`${secondsWord}`} </div>
        </div>}
      </>
    );
  };