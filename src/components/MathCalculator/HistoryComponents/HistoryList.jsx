import { useDispatch, useSelector } from "react-redux";
import {
  setInput,
  setFormula,
  setIsResult,
} from "../../../redux/calcSlice";
import { clearMath, deleteMath, saveMath} from "../../../redux/userInfoSlice";
import { useHttp } from "../../../hooks/http-hook";
import { useMath } from "../../../hooks/mathcalc-hook";
import {
  checkForDot,
  checkForDigit,
  checkForOperators,
  checkForZero,
  checkInputFieldLength,
} from "../utilities/checking";
import { setNotice } from "../../../redux/appSlice";
import { useInView } from 'react-intersection-observer';
import s from "./historylist.module.css";
import { useEffect, useRef } from "react";
import Spinner from '../../Loaders/Spinner'

export default function HistoryList() {
  const { input, isResult, formula,  math } = useSelector((state) => ({
    input: state.calcReducer.mathInput,
    isResult: state.calcReducer.mathIsResult,
    formula: state.calcReducer.mathFormula,
    math: state.userInfoReducer.math,
  }));
  const { request, loading } = useHttp();
  const dispatch = useDispatch();
  const {  addDigit, addZero } = useMath();
  const limit = 50
  const skip = useRef(null)

  useEffect(()=> {
      getMathHistory()
  }, [skip.current])

  /* Получение истории с сервера и вызов функции ее сохранения в store */
  const getMathHistory = async() => {
      try{
      const data = await request(`/math/get?limit=${limit}&skip=${skip.current ? skip.current : 0}`, "GET")
      data.history.forEach(el=>dispatch(saveMath({date: el.date, expression: el.expression})))
    } catch {} 

  }

  /* Отлавливание элемента из списка для загрузки следующей порции математической истории */
  const { ref, inView} = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) {
        skip.current = math.length
      }
    }
  });

  /* Изменение поля ввода и формулы */
  const setNewValuesInFields = (newInput, newFormula = newInput) => {
    checkInputFieldLength(newInput);
    dispatch(setInput(newInput));
    dispatch(setFormula(newFormula));
  };

  /* Изменение только поля ввода */
  const setNewValueInInput = (newInput) => {
    checkInputFieldLength(newInput);
    dispatch(setInput(newInput));
  };

  /* Функция вставки значения из истории */
  const addInput = (value) => {
    /* Если новое вычисление, формула и поле ввода заменяются введенным значением */
    const newCalculation = () => {
      dispatch(setIsResult(false));
      if (value[0] === '-') {
        formula ? setNewValuesInFields(value.slice(1), formula.split('=')[1]+ value) :
        setNewValuesInFields(value.slice(1), '0'+value)
      } else {
        setNewValuesInFields(value);
      }
      
    };

    const currentCalculation = () => {
      if (checkForDigit(value)) {
        addDigit(value);
      } else if (checkForZero(value)) {
        addZero();
      } else if (/NaN|Infinity/.test(value) && !/NaN|Infinity/.test(input)) {
        if (/√/.test(input)) {
          setNewValueInInput(value + "√" + input.split("√")[1]);
        } else if (/\^/.test(input)) {
          setNewValueInInput(input.split("^")[0] + "^" + value);
        } else if (checkForOperators(input)) {
          setNewValuesInFields(value, formula + value);
        } else {
          setNewValuesInFields(value, formula.slice(0, -input.length) + value);
        }
      }
    };

    /* Сначала проверяются эти условия */
    if (
      (checkForDot(value) && checkForDot(input) && !/√|\^/.test(input)) ||
      (checkForDot(value) &&
        /√/.test(input) &&
        checkForDot(input.split("√")[0])) ||
      (checkForDot(value) &&
        /\^/.test(input) &&
        checkForDot(input.split("^")[1]))
    ) {
     dispatch(setNotice(
        "Нельзя добавить десятичное число внутрь другого десятичного числа."
      ));
    } else {
      isResult ? newCalculation() : currentCalculation();
    }
  };

  const putInInput = (event) => {
    let value;
    /* Присвоения value значения при нажатии кнопки  */
    if (event.target.localName === "i") {
      value = event.target.parentNode.dataset.value;
    } else {
      value = event.target.dataset.value;
    }
    addInput(value); /* Вызов функции вставки значение */
  };

  /* Удаление выражения из БД */
  const deleteFromDB = async (key) => {
    try {
      await request(`/math/delete?key=${key}`, "GET");
    } catch (e) {}
  };

  /* Удаление выражния из истории, вызов функции удаления из БД */
  const deleteExpression = async (event) => {
    let key = event.target.parentNode.dataset.key;
    try {
      await request(`/math/delete?key=${key}`, "GET");
      dispatch(deleteMath(key))
    } catch (e) {}
    
  };

  /* Очистка истории в БД */
  const clearFromDB = async () => {
    try {
      await request("/math/clear", "GET");
    } catch (e) {}
  };

  /* Очистка истории, вызов функции очистки истории в БД */
  const clearHistory = () => {
    clearFromDB();
    dispatch(clearMath());
  };

  /* Отрисовка строки истории операций (1 выражение) */
  const drawHistory = (el, index) => {
    return (
      <div className={s.historyItem} key={el.date} ref={index === (math.length-2) ? ref : undefined }>
        <button
          data-value={
            /=/.test(el.expression)
              ? el.expression.split("=")[1]
              : el.expression
          }
          onClick={putInInput}
        >
          <i className="fa-solid fa-right-to-bracket fa-flip-horizontal"></i>
        </button>
        <div className={s.expression}>{el.expression}</div>
        <button data-key={el.date} onClick={deleteExpression}>
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    );
  };

      return (
    <>
    {loading && <div className={s.loading}><Spinner/></div>}
      {math.length > 0 ? (
        <div className={s.clearHistory} onClick={clearHistory}>
          <p>Очистить историю</p>
        </div>
      ) : (
        !loading && <div className={s.emptyStore}>История операций пуста</div>
      )}
      <div className={s.historyList}>{math.map((el, index) => drawHistory(el, index))}</div>
    </>
  );

}
