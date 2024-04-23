import { useDispatch, useSelector } from 'react-redux';
import s from '../datecalculator.module.css'
import m from '../UI/input-and-selection-fields.module.css'
import { setDateFrom, setDateTo } from '../../redux/calcSlice';

/* Режим разница дат.
dateeFrom, dateTo -  две даты для сравнения */
export default function DaysBetweenDates (props) {
  const dispatch = useDispatch()
  const {dateFrom, dateTo} = useSelector(state=>({
    dateFrom : state.calcReducer.dateFrom,
    dateTo : state.calcReducer.dateTo
  }))
  return (
    <div className={s.inputdates}>
    <input
      className={m.input}
      type="date"
      value={dateFrom}
      placeholder="дд.мм.гггг"
      min="1000-01-01"
      max="9999-12-31"
      onChange={(e) => dispatch(setDateFrom(e.target.value))}
    />
    <input
      className={m.input}
      type="date"
      value={dateTo}
      placeholder="дд.мм.гггг"
      min="1000-01-01"
      max="9999-12-31"
      onChange={(e) => dispatch(setDateTo(e.target.value))}
    />

  </div>
  )
}