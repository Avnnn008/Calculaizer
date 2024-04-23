import { useDispatch, useSelector } from "react-redux";
import s from "../savingscalc.module.css";
import { setSavFinalDate } from "../../redux/calcSlice";
import m from '../UI/input-and-selection-fields.module.css'

export default function SavingsFinalDate () {
    const finalDate = useSelector(state=>state.calcReducer.savFinalDate)
    const dispatch = useDispatch()
    return (
        <div className={s.line}>
        <label>До</label>
        <input
          type="date"
          value={finalDate}
          min={"2000-01-01"}
          max={"2299-12-31"}
          placeholder="дата"
          onChange={(e) => dispatch(setSavFinalDate(e.target.value))}
          className={m.input}
        />
        включительно
      </div>
    )
}