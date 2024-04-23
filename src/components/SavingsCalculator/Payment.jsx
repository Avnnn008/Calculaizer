import { useDispatch, useSelector } from "react-redux";
import s from "../savingscalc.module.css";
import { setSavPayment } from "../../redux/calcSlice";
import m from '../UI/input-and-selection-fields.module.css'

export default function Payment () {
  const payment = useSelector(state=>state.calcReducer.savPayment)
  const dispatch = useDispatch()
    return (
        <div className={s.line}>
        <label>По</label>
        <input
        className={m.input}
          type="number"
          min={1}
          value={payment}
          inputMode='numeric'
          placeholder="число > 0"
          onChange={(e) => dispatch(setSavPayment(e.target.value))}
        />{" "}
        ₽
      </div>
    )
}