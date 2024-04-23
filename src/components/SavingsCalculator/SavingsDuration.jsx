import { useDispatch, useSelector } from "react-redux";
import { PERIOD } from "./savCalcConstants";
import { setSavPeriod, setSavPeriodCount } from "../../redux/calcSlice";
import s from "../savingscalc.module.css";
import m from '../UI/input-and-selection-fields.module.css'

export default function SavingsDuration() {
  const { period, periodCount, periodicity } = useSelector((state) => ({
    period: state.calcReducer.savPeriod,
    periodCount: state.calcReducer.savPeriodCount,
    periodicity: state.calcReducer.savPeriodicity,
  }));
  const dispatch = useDispatch();

  return (
    <div className={s.line}>
      <label>В течение</label>
      <input
      className={`${m.input} ${m.smallinput}`}
        type="number"
        inputMode='numeric'
        min={0}
        value={periodCount}
        placeholder="число > 0"
        onChange={(e) => dispatch(setSavPeriodCount(e.target.value))}
      />
      <select
        className={`${m.select} ${m.smallsize}`}
        onChange={(e) => dispatch(setSavPeriod(e.target.value))}
        value={period}
      >
        <option value={0} disabled={true}>
          период
        </option>
        {periodicity ? (
          PERIOD.slice(periodicity-1).map((el) => (
            <option key={el[0]} value={el[0]}>{el[1]}</option>
          ))
        ) : (
          PERIOD.map((el) => (
            <option key={el[0]} value={el[0]}>{el[1]}</option>
          ))
        )}
      </select>
    </div>
  );
}
