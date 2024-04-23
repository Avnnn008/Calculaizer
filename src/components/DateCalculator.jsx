import { useDispatch, useSelector } from "react-redux";
import CalculateTimeFromCurrent  from "./DateCalculator/Calculations/CalculateTimeFromCurrent";
import CurrentTime from "./DateCalculator/CurrentTime";
import DateBeforeOrAfter from "./DateCalculator/DateBeforeOrAfter";
import DaysBetweenDates from "./DateCalculator/DaysBetweenDates";
import DaysToEventFromList from "./DateCalculator/DaysToEventFromList";
import DaysToOwnDate from "./DateCalculator/DaysToOwnDate";
import FormatSelection from "./DateCalculator/FormatSelection";
import  CalculateTimeBetweenDates  from "./DateCalculator/Calculations/CalculateTimeBetweenDates";
import CalculateDateBeforeOrAfter from "./DateCalculator/Calculations/CalculateDateBeforeOrAfter";
import { TYPESOFCALCULATION } from "./DateCalculator/constants";
import s from "./datecalculator.module.css";
import m from './UI/input-and-selection-fields.module.css'
import { setDateType } from "../redux/calcSlice";


export default function DateCalculator() {

const {dateFrom, dateTo, dateType, dateCount} = useSelector(state=>({
  dateFrom: state.calcReducer.dateFrom,/* дата для отсчета */
  dateTo: state.calcReducer.dateTo,/* дата для сравнения */
  dateType: state.calcReducer.dateType,/* режим калькулятора */
  dateCount: state.calcReducer.dateCount,/* число дней для отсчета */
}))
const dispatch = useDispatch()

  /* условия ддля отображения элемента выбора формата */
  const conditionalToFormat = (dateTo && (dateType === TYPESOFCALCULATION.OWN || dateType == TYPESOFCALCULATION.LIST)) || dateTo && dateFrom && dateType === TYPESOFCALCULATION.DIFFERENCE
  /* условия для проведения вычислений */
  const conditionalToCalculate = conditionalToFormat || (dateType === TYPESOFCALCULATION.BEFOREAFTER && dateFrom && dateCount)


/* Вызов компонентов для подсчета результата в зависимости от режима калькулятора*/
  const calculateTime = () => {
    if (dateType ===TYPESOFCALCULATION.OWN || dateType === TYPESOFCALCULATION.LIST) {
        return <CalculateTimeFromCurrent/>
      } else if (dateType === TYPESOFCALCULATION.DIFFERENCE) {
        return <CalculateTimeBetweenDates/>
      } else if (dateType === TYPESOFCALCULATION.BEFOREAFTER) {
        return <CalculateDateBeforeOrAfter/>
      }
    }

  /* Отображение подсказки в зависимости от выбранного режима калькулятора дат */
  const getHintMessage = () => {
   if (dateType ===TYPESOFCALCULATION.OWN || dateType === TYPESOFCALCULATION.LIST || dateType === TYPESOFCALCULATION.DIFFERENCE) {
        return <div className={s.hint}>
        <div>Выберите дату</div>
        <div>для подсчета</div>
      </div>
   } else if (dateType === TYPESOFCALCULATION.BEFOREAFTER) {
    return <div className={s.hint}>
        <div>Выберите дату начала отсчета</div>
        <div>и число дней.</div>
        <br/>
        <div>Если отсчет ведется</div>
        <div>в обратном направлении,</div>
        <div>то число дней укажите со знаком "-".</div>
      </div>
   }
  }

  return (
    <div className={s.datecalc}>
      <div className={s.calculator}>
        <CurrentTime/>
        <div className={s.choise}>
          <select
            className={m.select}
            onChange={(e) => dispatch(setDateType(e.target.value))}
            defaultValue={TYPESOFCALCULATION.OWN}
          >
            {Object.values(TYPESOFCALCULATION).map(el=>
            <option key={el} value={el}>{el}</option>
            )}
          </select>
          {dateType === TYPESOFCALCULATION.LIST && (
            <DaysToEventFromList/>
          )}
          {dateType === TYPESOFCALCULATION.OWN && (
            <DaysToOwnDate/>
          )}
          {dateType === TYPESOFCALCULATION.DIFFERENCE && (
            <DaysBetweenDates/>
          )}
          {dateType === TYPESOFCALCULATION.BEFOREAFTER && <DateBeforeOrAfter/>}
        </div>
        <div className={s.calculation}>
          {conditionalToCalculate ? (
            calculateTime()
          ) : ( getHintMessage()
            
          )}
        </div>
        {conditionalToFormat ? (
          <FormatSelection />
        ) : (
          <div className={s.format}></div>
        )}
      </div>
      
    </div>
  );
}
