import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComponent} from "../redux/navigationSlice";
import MathCalculator from "../components/MathCalculator";
import DateCalculator from "../components/DateCalculator";
import SavingsCalculator from "../components/SavingsCalculator";
import TextCalculator from "../components/TextCalculator";
import ImgGenerator from "../components/ImgGenerator";
import s from "./calculatorspage.module.css";
import ExpenseCalculator from "../components/ExpenseCalculator";


/* Страница калькуляторов */
export default function CalculatorsPage() {
  const [choise, setChoise] =
    useState(true); /* true - меню выбора калькуляторов */
  const isAuth = useSelector(state=>state.authReducer.isAuth)
  const dispatch = useDispatch();
  const component = useSelector(
    (state) => state.navReducer.component
  ); /* компонент калькуляторов - математический, дат, накоплений и т.п */
  const page = useSelector((state) => state.navReducer.page);
  const updating = useSelector((state) => state.navReducer.updating);

/* Возврат страницы к начальному виду при повтороном обновлении */
useEffect(()=> {
  if (updating !== 0) {
    dispatch(setComponent(null));
      setChoise(true);
  }
}, [updating])  

  /* Если при загрузке установлен компонент - убрать меню выбора калькуляторов.
При размонтировании очищается выбор компонента, удаляются данные калькуляторов */
useEffect(() => {
    if (component) {
      setChoise(false);
    } 
    return () => {
      dispatch(setComponent(null));
    };
  }, [page]);

  /* компоненты возможностей для всех пользователей (калькуляторов и сервисов)
при их установке открывается соответствующий калькулятор или сервис */

  const POSSIBILITIES = {
    'Калькуляторы' : {
      "Математический калькулятор": "math",
      "Калькулятор дат": "datecalc",
      "Калькулятор накоплений": "savings",
      "Калькулятор по тексту": "textcalc",
    },
    'Сервисы' : {}
  }

  /* Дополнительные возможности для авторизованных пользователей*/
  if (isAuth) {
    POSSIBILITIES['Сервисы']["Генератор картинок"]  = "imggenerator",
    POSSIBILITIES['Калькуляторы']["Калькулятор расходов"] = "expense"
  }

  return (
    <>
      <div className={s.window}>
        {!component ? (
          <div className={s.empty}></div>
        ) : (
          <i
            className={
              choise ? "fa-solid fa-caret-up" : "fa-solid fa-caret-down"
            }
            onClick={() => setChoise((prev) => !prev)}
          ></i>
        )}
        {choise && 
        <div className={s.list}>
        {Object.keys(POSSIBILITIES).map(obj=> (
          <div key={obj}>
          <div className={s.title}>{obj}</div>
          {Object.keys(POSSIBILITIES[obj]).length > 0 ? Object.keys(POSSIBILITIES[obj]).map(el=>(
            <div
            key={el}
            className={component ? `${s.calc} ${s.inverse}` : s.calc}
            onClick={() => {
              dispatch(setComponent(POSSIBILITIES[obj][el]));
              setChoise(false);
            }}
          >
            {el}
          </div>
          )) : <div className={s.noavailable}>Нет доступных</div>}
          </div>
        ))}
        </div>}
      </div>
      {component === "math" && <MathCalculator />}
      {component === "datecalc" && <DateCalculator />}
      {component == "savings" && <SavingsCalculator />}
      {component === "textcalc" && <TextCalculator />}
      {component === 'expense' && <ExpenseCalculator/>}
      {component === "imggenerator" && <ImgGenerator />}
    </>
  );
}
