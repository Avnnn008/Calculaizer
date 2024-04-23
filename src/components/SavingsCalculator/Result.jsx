import { useSelector } from "react-redux";
import s from "../savingscalc.module.css";
import { TYPESOFCOUNT } from "./savCalcConstants";
import HowMuchCalculation from "./Calculations/HowMuchCalculation";
import HowMuchToDateCalculation from "./Calculations/HowMuchToDateCalculation";
import HowLongCalculation from "./Calculations/HowLongCalculation";
import HowManyCalculation from "./Calculations/HowManyCalculation";

export default function Result () {
const {startDate, finalDate, neededSum, period, periodCount, periodicity, payment, savType} = useSelector(state=> ({
    startDate: state.calcReducer.savStartDate,
    finalDate: state.calcReducer.savFinalDate,
    neededSum: state.calcReducer.savNeededSum,
    period: state.calcReducer.savPeriod,
    periodCount: state.calcReducer.savPeriodCount,
    periodicity: state.calcReducer.savPeriodicity,
    payment: state.calcReducer.savPayment,
    savType: state.calcReducer.savType
}))
 

const calculateResult = () => {
if (savType === TYPESOFCOUNT.HOWMUCH && (startDate && periodicity && payment && period && periodCount)) {
     return <HowMuchCalculation/>
} else if (savType=== TYPESOFCOUNT.HOWMUCHTODATE &&(startDate && periodicity && payment && finalDate)) {
    return <HowMuchToDateCalculation/>
} else if (savType === TYPESOFCOUNT.HOWLONG && (neededSum && startDate && periodicity && payment)) {
    return <HowLongCalculation/>
} else if (savType === TYPESOFCOUNT.HOWMANY && (neededSum && startDate && finalDate && periodicity)) {
    return <HowManyCalculation/>
}
else return 'Введите данные для подсчета'
}

    return (
        <div className={s.result}>
        {calculateResult()}
      </div>
    )
}