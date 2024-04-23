import { useDispatch, useSelector } from "react-redux";
import s from "../savingscalc.module.css";
import { setSavPeriodicity } from "../../redux/calcSlice";
import { PERIODICITY} from "./savCalcConstants";
import m from '../UI/input-and-selection-fields.module.css'

export default function Periodicity () {
      const periodicity = useSelector(state=>state.calcReducer.savPeriodicity)
      const dispatch = useDispatch()

    return (
        <div className={s.line}>
        <label>Откладывать</label>
        <select
          className={`${m.select} ${m.smallsize}`}
          onChange={(e) => dispatch(setSavPeriodicity(e.target.value))}
          value={periodicity}
        >
          <option value={0} disabled={true}>
            периодичность
          </option>
          {Object.keys(PERIODICITY).map(el=><option key={el} value={PERIODICITY[el]}>{el}</option>)}
        </select>
      </div>
    )
}