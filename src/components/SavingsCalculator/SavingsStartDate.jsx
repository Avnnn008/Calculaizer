import { useDispatch, useSelector } from "react-redux";
import s from "../savingscalc.module.css";
import { setSavStartDate } from "../../redux/calcSlice";
import m from '../UI/input-and-selection-fields.module.css'

export default function SavingsStartDate () {
  const startDate = useSelector(state=>state.calcReducer.savStartDate)
  const dispatch = useDispatch()
    return (
        <div className={s.line}>
        <label>Начать откладывать</label>
        <input
        className={m.input}
          type="date"
          value={startDate}
          min={"2000-01-01"}
          max={"2299-12-31"}
          placeholder="дата"
          onChange={(e) => dispatch(setSavStartDate(e.target.value))}
        />
      </div>
    )
}