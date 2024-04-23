import { useSelector } from "react-redux";
import { calculateTime } from "./utilities/calculateTime";
import { pickUpWordToMoney } from "./utilities/pickUpWord";
import s from "../../savingscalc.module.css";
import {
  checkDateRange,
  checkNumberIntegrity,
  checkPeriodRange,
} from "./utilities/checkings";

export default function HowMuchCalculation() {
  const { startDate, period, periodCount, periodicity, payment } = useSelector(
    (state) => ({
      startDate: state.calcReducer.savStartDate,
      period: state.calcReducer.savPeriod,
      periodCount: state.calcReducer.savPeriodCount,
      periodicity: state.calcReducer.savPeriodicity,
      payment: state.calcReducer.savPayment,
    })
  );
  /* Проверки ввода */
  const checkings = () => {
    return (
      checkDateRange(startDate) ||
      checkPeriodRange(period, parseInt(periodCount)) ||
      checkNumberIntegrity(payment) ||
      checkNumberIntegrity(periodCount)
    );
  };
  const calculate = () => {
    /* В случае, если одна из функций проверки что-то вернет, 
    компонент вернет ее результат (предупреждение пользователю) и вычислять дальше не будет  */
    if (checkings()) {
      return checkings();
    }
    /* Изначально устанавливаем количество вложений коэффициенту периода. Останется таким же, если совпадут значени периодичности и периода
    (вложения раз в месяц в течение нескольких месяцев) */
    let countOfPayments = parseInt(periodCount) 
    /* Если вложения ежемесячные, а период измеряется в годах, то коэффициент периода, находящийся в переменной countsOfPayments умножается на 12
    (в последующей фенкции использовать нельзя, тк разное количество дней в месяцах и некорректные результаты) */
    if (periodicity === '3' && period === '4') {
     countOfPayments *=12
    } else if (periodicity !== period) { /* Следующие случаи для периодичности в днях и месяцах, где период больше значенияя периодичности  */
      /* Время в мс до окончания накоплений */
    let timeToEnd = calculateTime(startDate, period, parseInt(periodCount));
    /* Время в мс между вложениями */
    let timeToPeriod = calculateTime(startDate, periodicity, 1);
    /* Количество вложений, округляется в меньшую сторону */
     countOfPayments = Math.floor(timeToEnd / timeToPeriod);
     /* При периодичности вложений раз в неделю и периоде, кратному месяцу или году, добавление 1 к количеству вложений,
         тк оно теряется при округлении Math.floor (не учитывается 1 вложение) */
    if (periodicity === "2" && (period === "3" || period === "4")) {
      countOfPayments += 1;
    }
    }
    
    /* Подсчет итоговой суммы: взнос умножается на количество вложений */
    let savings = parseInt(payment) * countOfPayments;

    return (
      <>
        <div>За данный период Вы накопите</div>
        <div className={s.total}>
          {savings} {pickUpWordToMoney(savings)}
        </div>
      </>
    );
  };

  return calculate();
}
