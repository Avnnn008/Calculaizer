import { useSelector } from "react-redux";
import { pickUpWordToMoney } from "./utilities/pickUpWord";
import s from "../../savingscalc.module.css";
import {
  checkDateDifference,
  checkDateRange,
  checkNumberIntegrity,
} from "./utilities/checkings";

export default function HowMuchToDateCalculation() {
  const { startDate, finalDate, periodicity, payment } = useSelector(
    (state) => ({
      startDate: state.calcReducer.savStartDate,
      finalDate: state.calcReducer.savFinalDate,
      periodicity: state.calcReducer.savPeriodicity,
      payment: state.calcReducer.savPayment,
    })
  );

  /* Проверки ввода */
  const checkings = () => {
    return (
      checkDateRange(startDate) ||
      checkDateRange(finalDate) ||
      checkDateDifference(startDate, finalDate) ||
      checkNumberIntegrity(payment)
    );
  };

  const calculate = () => {
    /* В случае, если одна из функций проверки что-то вернет, 
    компонент вернет ее результат (предупреждение пользователю) и вычислять дальше не будет  */
    if (checkings()) {
      return checkings();
    }

    let countOfPayments;
    let yearStart = parseInt(startDate.split("-")[0]);
    let yearEnd = parseInt(finalDate.split("-")[0]);
    let monthStart = parseInt(startDate.split("-")[1]);
    let monthEnd = parseInt(finalDate.split("-")[1]);
    let dayStart = parseInt(startDate.split("-")[2]);
    let dayEnd = parseInt(finalDate.split("-")[2]);
    switch (periodicity) {
      case "1":
        countOfPayments =
          Math.floor(
            (new Date(finalDate).getTime() - new Date(startDate).getTime()) /
              (24 * 60 * 60 * 1000)
          ) + 1;
        break;
      case "2":
        countOfPayments =
          Math.floor(
            (new Date(finalDate).getTime() - new Date(startDate).getTime()) /
              (7 * 24 * 60 * 60 * 1000)
          ) + 1;
        break;
      case "3":
        dayEnd >= dayStart
          ? (countOfPayments =
              (yearEnd - yearStart) * 12 + (monthEnd - monthStart) + 1)
          : (countOfPayments =
              (yearEnd - yearStart) * 12 + (monthEnd - monthStart));
        break;
      case "4":
        monthEnd >= monthStart && dayEnd >= dayStart
          ? (countOfPayments = yearEnd - yearStart + 1)
          : (countOfPayments = yearEnd - yearStart);
        break;
    }

    let savings = parseInt(payment) * countOfPayments;
    return (
      <>
        <div>Вы накопите</div>
        <div className={s.total}>
          {savings} {pickUpWordToMoney(savings)}
        </div>
      </>
    );
  };

  return calculate();
}
