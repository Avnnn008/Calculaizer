import { useSelector } from "react-redux";
import s from "../../savingscalc.module.css";
import {
  checkDateRange,
  checkNumberIntegrity,
  checkPaymentAndSumDifference,
  checkPeriodRange,
} from "./utilities/checkings";

export default function HowLongCalculation() {
  const { startDate, neededSum, periodicity, payment } = useSelector(
    (state) => ({
      startDate: state.calcReducer.savStartDate,
      neededSum: state.calcReducer.savNeededSum,
      periodicity: state.calcReducer.savPeriodicity,
      payment: state.calcReducer.savPayment,
    })
  );

  const checkings = () => {
    return (
      checkDateRange(startDate) ||
      checkNumberIntegrity(payment) ||
      checkNumberIntegrity(neededSum) ||
      checkPaymentAndSumDifference(payment, neededSum) ||
      checkPeriodRange(periodicity, parseInt(Math.ceil(parseInt(neededSum) / parseInt(payment)) - 1))
    );
  };

  const calculate = () => {
    let year = parseInt(startDate.split("-")[0]);
    let month = parseInt(startDate.split("-")[1]) - 1;
    let day = parseInt(startDate.split("-")[2]);

    /* В случае, если одна из функций проверки что-то вернет, 
    компонент вернет ее результат (предупреждение пользователю) и вычислять дальше не будет  */
    if (checkings()) {
      return checkings();
    }

    let countOfPayments =
      Math.ceil(parseInt(neededSum) / parseInt(payment)) - 1;
    let endDate;

    switch (periodicity) {
      case "1":
        endDate = new Date(
          year,
          month,
          day + countOfPayments
        ).toLocaleDateString();
        break;
      case "2":
        endDate = new Date(
          year,
          month,
          day + 7 * countOfPayments
        ).toLocaleDateString();
        break;
      case "3":
        endDate = new Date(
          year,
          month + countOfPayments,
          day
        ).toLocaleDateString();
        break;
      case "4":
        endDate = new Date(
          year + countOfPayments,
          month,
          day
        ).toLocaleDateString();
        break;
    }

    return (
      <>
        <div>Последнее вложение будет</div>
        <div className={s.total}>{endDate}</div>
      </>
    );
  };

  return calculate();
}
