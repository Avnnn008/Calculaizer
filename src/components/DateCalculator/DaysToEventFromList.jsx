import React from 'react';
import m from '../UI/input-and-selection-fields.module.css'
import { useDispatch } from 'react-redux';
import { setDateTo } from '../../redux/calcSlice';

/* Режим выбрать событие из списка.
setDateTo - установка даты события, устанавливается путем выбора даты из списка значений объекта DATES */

export default function DaysToEventFromList (props) {
  const dispatch = useDispatch()
    const YEAR = new Date().getFullYear();
    const DATES = {
        "Новый год": `${YEAR}-01-01`,
        "23 февраля": `${YEAR}-02-23`,
        "8 марта": `${YEAR}-03-08`,
        "Начало весны": `${YEAR}-03-01`,
        "Начало лета": `${YEAR}-06-01`,
        "Начало осени": `${YEAR}-09-01`,
        "Начало зимы": `${YEAR}-12-01`,
      };

  return (
    <select className={`${m.select} ${m.smallsize}`}
              onChange={(e) => dispatch(setDateTo(e.target.value))}
              defaultValue={"Выберите событие"}
            >
              <option
                value={"Выберите событие"}
                disabled={true}
              >
                Выберите событие
              </option>
              {Object.keys(DATES).map((el) => (
                <option
                  value={DATES[el]}
                  key={el}
                  onClick={(e) => dispatch(setDateTo(e.target.value))}
                >
                  {el}
                </option>
              ))}
            </select>
  )
}