import { useDispatch, useSelector } from "react-redux";
import s from "../savingscalc.module.css";
import { setSavNeededSum } from "../../redux/calcSlice";
import m from '../UI/input-and-selection-fields.module.css'

export default function NeededSum () {
 const savNeededSum = useSelector(state=>state.calcReducer.savNeededSum)   
 const dispatch = useDispatch()
    return (
        <div className={s.line}>
          <label>
            Нужно накопить</label> 
            <input
              type="number"
              min={0}
              value={savNeededSum}
              onChange={(e) => dispatch(setSavNeededSum(e.target.value))}
              className={m.input}
              placeholder="сумма"
              inputMode='numeric'
            />
            ₽
        </div>
    )
}