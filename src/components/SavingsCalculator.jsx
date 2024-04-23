import { useDispatch, useSelector} from "react-redux";
import { setSavType } from "../redux/calcSlice";
import NeededSum from "./SavingsCalculator/NeededSum";
import SavingsStartDate from "./SavingsCalculator/SavingsStartDate";
import Periodicity from "./SavingsCalculator/Periodicity";
import Payment from "./SavingsCalculator/Payment";
import SavingsDuration from "./SavingsCalculator/SavingsDuration";
import SavingsFinalDate from "./SavingsCalculator/SavingsFinalDate";
import { TYPESOFCOUNT } from "./SavingsCalculator/savCalcConstants";
import Result from "./SavingsCalculator/Result";
import s from "./savingscalc.module.css";
import m from './UI/input-and-selection-fields.module.css'


export default function SavingsCalculator() {
  
  const dispatch = useDispatch()
  const savType = useSelector(state=>state.calcReducer.savType)

  return (
    <div className={s.scalc}>
      <div className={s.title}>Посчитать:</div>
      <select
        className={m.select}
        onChange={(e) => dispatch(setSavType(e.target.value))}
        value={savType}
      >
        <option value={"choise"} disabled={true}>
          ...
        </option>
        {Object.keys(TYPESOFCOUNT).map(el=> <option key={el} value={TYPESOFCOUNT[el]}>{TYPESOFCOUNT[el]}</option>)}  
      </select>
      {
        savType!=='choise' && <>
        <div className={s.title}>если:</div>
      {(savType === TYPESOFCOUNT.HOWLONG || savType === TYPESOFCOUNT.HOWMANY) && <NeededSum/>}
      <SavingsStartDate/>
      <Periodicity/>
      {savType !== TYPESOFCOUNT.HOWMANY && <Payment/>}
      {savType === TYPESOFCOUNT.HOWMUCH && <SavingsDuration/>}
      {(savType === TYPESOFCOUNT.HOWMUCHTODATE || savType === TYPESOFCOUNT.HOWMANY) && <SavingsFinalDate/>}
      <Result/>
        </>
      }
      
    </div>
  );
}
