import React from 'react';
import s from '../datecalculator.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setDateFormat } from '../../redux/calcSlice';

/* Выбор формата представления результата вычислений: в днях, часах, минутах или секундах.
Устанавливает состояние format в DateCalculator */
export default function FormatSelection () {
  const format = useSelector(state=>state.calcReducer.dateFormat)
  const dispatch = useDispatch()
  return (
    <div className={s.format}>
          <button onClick={()=>dispatch(setDateFormat(0))} disabled={format===0}>Д</button>
          <button onClick={()=>dispatch(setDateFormat(1))} disabled={format===1}>Ч</button>
          <button onClick={()=>dispatch(setDateFormat(2))} disabled={format===2}>М</button>
          <button onClick={()=>dispatch(setDateFormat(3))} disabled={format===3}>С</button>
          </div>
  )
}