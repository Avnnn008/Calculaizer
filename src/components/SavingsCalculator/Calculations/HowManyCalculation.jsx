import { useSelector } from "react-redux";
import s from "../../savingscalc.module.css";
import { pickUpWordToMoney } from "./utilities/pickUpWord";
import { checkDateDifference, checkDateRange, checkNumberIntegrity } from "./utilities/checkings";


export default function HowManyCalculation() {

  const {startDate, finalDate, neededSum,  periodicity} = useSelector(state=> ({
    startDate: state.calcReducer.savStartDate,
    finalDate: state.calcReducer.savFinalDate,
    neededSum: state.calcReducer.savNeededSum,
    periodicity: state.calcReducer.savPeriodicity
}))

const checkings = () => {
  return (checkNumberIntegrity(neededSum)|| checkDateRange(startDate) || checkDateRange(finalDate)|| checkDateDifference(startDate, finalDate))
}

  const calculate = () => {
       /* В случае, если одна из функций проверки что-то вернет, 
    компонент вернет ее результат (предупреждение пользователю) и вычислять дальше не будет  */
    if (checkings()) {
      return checkings();
    }

    let difference = new Date(finalDate).getTime() - new Date(startDate).getTime();

    let payment;
    let yearStart = parseInt(startDate.split("-")[0]);
    let yearEnd = parseInt(finalDate.split("-")[0]);
    let monthStart = parseInt(startDate.split("-")[1]);
    let monthEnd = parseInt(finalDate.split("-")[1]);
    let dayStart = parseInt(startDate.split("-")[2]);
    let dayEnd = parseInt(finalDate.split("-")[2]);

    switch (periodicity) {
      case "1":
        payment = (
          neededSum /
          ((difference + 1000 * 60 * 60 * 24) / (1000 * 60 * 60 * 24))
        ).toFixed(2);
        break;
      case "2":
        payment = (
          neededSum /
          Math.floor(
            (difference + 1000 * 60 * 60 * 24 * 7) / (1000 * 60 * 60 * 24 * 7)
          )
        ).toFixed(2);
        break;
      case "3":
        dayEnd >= dayStart
          ? (payment = (
              neededSum /
              ((yearEnd - yearStart) * 12 + (monthEnd - monthStart) + 1)
            ).toFixed(2))
          : (payment = (
              neededSum /
              ((yearEnd - yearStart) * 12 + (monthEnd - monthStart))
            ).toFixed(2));
        break;
      case "4":
        monthEnd >= monthStart && dayEnd >= dayStart
          ? (payment = (neededSum / (yearEnd - yearStart + 1)).toFixed(2))
          : (payment = (neededSum / (yearEnd - yearStart)).toFixed(2));
        break;
    }

    if (payment < 0.01) {
      return (
        <>
          <div>Нужно откладывать</div>
          <div>меньше 1 копейки!</div>
        </>
      );
    }

    return (
      <>
        <div>Нужно откладывать</div>
        <div className={s.total}>
          {payment} {pickUpWordToMoney(payment)}
        </div>
      </>
    );
  };

  return calculate()
}
