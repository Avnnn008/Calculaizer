import React from 'react';
import s from "../datecalculator.module.css";
import m from '../UI/input-and-selection-fields.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setDateCount, setDateFrom } from '../../redux/calcSlice';

/* Режим дата до/через.
dateFrom - дата начала отсчета, 
dateCount -  количествоS дней для отсчета. */

export default function DateBeforeOrAfter () {
const {dateFrom, dateCount} = useSelector(state=>({
  dateFrom : state.calcReducer.dateFrom,
  dateCount : state.calcReducer.dateCount
}))
const dispatch = useDispatch()

  return (
    <div className={s.input}>
    <input
      className={m.input}
      type="date"
      value={dateFrom}
      placeholder="дд.мм.гггг"
      min="1100-01-01"
      max="9999-01-01"
      onChange={(e) =>dispatch(setDateFrom(e.target.value))}
    />
    <input type="number" 
    className={`${m.input} ${m.smallinput}`}
    value={dateCount}
    min={0}
    max={36500}
    placeholder='дни'
    onChange={(e)=>dispatch(setDateCount(e.target.value))}
    inputMode='numeric'
    />
  </div>
  )
}