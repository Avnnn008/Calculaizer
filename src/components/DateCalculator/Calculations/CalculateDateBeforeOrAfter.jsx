import { useSelector } from "react-redux";
import s from "../../datecalculator.module.css";

/* Принимает дату отсчета и число дней, высчитывает конечную дату.
Дата позже текущей - title='Будет', раньше - 'Было'.
Вовращает HTML код с результатом */
export default function CalculateDateBeforeOrAfter () {
  const {dateFrom, dateCount} = useSelector(state=> ({
    dateFrom: state.calcReducer.dateFrom,
    dateCount: state.calcReducer.dateCount
  }))
    const now = new Date(dateFrom).getTime()
    const difference = dateCount*24*60*60*1000
    const dateBeforeOrAfter = new Date(now+difference).toLocaleDateString()
    let title

    now+difference > new Date().getTime() ? title='Будет:' : title='Было:'

    return (
        <>
        <div className={s.title}>{title}</div>
        <div className={s.time}>
          <div>{`${dateBeforeOrAfter}`} </div>
        </div>
        </>
    )
}