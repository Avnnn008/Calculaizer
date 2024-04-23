import { useDispatch, useSelector } from "react-redux";
import { setInput, setFormula, setIsResult } from "../redux/calcSlice";
import {
  checkInputFieldLength,
  checkForDigit,
  checkForDot,
  checkForOperators,
} from "../components/MathCalculator/utilities/checking";
import { useCheckLimit } from "../components/MathCalculator/utilities/checkLimit-hook";

export const useMath = () => {
  const dispatch = useDispatch();
  const { input, isResult, formula } = useSelector((state) => ({
    input: state.calcReducer.mathInput,
    isResult: state.calcReducer.mathIsResult,
    formula: state.calcReducer.mathFormula,
  }));
  const { checkLimit } = useCheckLimit();

  const setNewValuesInFields = (newInput, newFormula = newInput) => {
    checkInputFieldLength(newInput);
    dispatch(setInput(newInput));
    dispatch(setFormula(newFormula));
  };

  const setNewValueInInput = (newInput) => {
    checkInputFieldLength(newInput);
    dispatch(setInput(newInput));
  };

  /* ------------------------------ AC ------------------------------------ */
  /* Очистка полей ввод и формулы при нажатии "АС" */
  const resetFields = () => {
    setNewValuesInFields("0", "");
    dispatch(setIsResult(true));
  };

  /* ------------------------------ CANCEL ------------------------------------ */

  /* Функция отмены последнего ввода. */
  const cancelInput = () => {
    /* Если в формуле есть знак = */
    const newCalculation = () => {
      dispatch(setIsResult(false));
      let updateFormula =
        formula.split(
          "="
        )[0]; /* в формуле оставляется только то, что было до знака = */
      dispatch(setFormula(updateFormula));
      let splitFormula =
        updateFormula.split(
          /\+|\-|x|÷/
        ); /* Формула разбивается по операторам - получается массив числовых ззначений */
      let updateInput =
        splitFormula[
          splitFormula.length - 1
        ]; /* Последний элемент массива - последнее введенное число, устанавливается в поле ввода */
      setNewValueInInput(updateInput);
    };

    const currentCalculation = () => {
      /* Если в поле ввода оператор */
      if (checkForOperators(input) && !checkForDigit(input)) {
        let splitFormula = formula.split(/\+|\-|x|÷/);
        let updateInput =
          splitFormula[
            splitFormula.length - 2
          ]; /* Значение в формуле перед удаляемым оператором, если там оператор - пустая строка*/
        /* Если это значение не оператор, в поле ввода устанавливается все число, а не 1 последняя цифра. Если оператор - он устанавливается в поле ввода*/
        updateInput
          ? setNewValuesInFields(updateInput, formula.slice(0, -1))
          : setNewValuesInFields(
              formula[formula.length - 2],
              formula.slice(0, -1)
            );
      } else if (input.length === 1) {
        /* Если в поле ввода 1 символ*/
        /* Если поле ввода совпадает с формулой и содержит 1 число: сброс значений до 0.
         Если в поле ввода 1 число и формула ему не равна (до числа идет оператор): в поле ввода устанавливается предыдущий оператор из формулы, число удалется из формулы */
        if (formula.length <= 1) {
          setNewValuesInFields("0", "");
          dispatch(setIsResult(true));
        } else {
          setNewValuesInFields(formula.slice(-2, -1), formula.slice(0, -1));
        }
      } else if (/√/.test(input)) {
        /* Если в поле ввода извлечение корня */
        /* Если n не задан: отмена знака извлечения корня в поле ввода */
        if (/ⁿ√/.test(input)) {
          setNewValueInInput(input.replace(/ⁿ√/, ""));
        } else if (/\d{2,}|\d+\./.test(input.split("√")[0])) {
          /* Если степень - число более 1 знака: удаление последнего знака из степени */
          setNewValueInInput(
            input.split("√")[0].slice(0, -1) + "√" + input.split("√")[1]
          );
        } else {
          /* Если степень состоит из 1 знака, возврат степени к значению n для ввода числа */
          setNewValueInInput("ⁿ√" + input.split("√")[1]);
        }
      } else if (/\^/.test(input)) {
        /* Если в поле ввода возведение в степень */
        if (/^-\d$/.test(input.split("^")[1])) {
          setNewValueInInput(input.slice(0, -1));
        } else if (/NaN|Infinity/.test(input)) {
          setNewValueInInput(input.replace(/NaN|Infinity/, ""));
        } else {
          setNewValueInInput(
            input.slice(0, -1)
          ); /* Удаление последней цифры из степени или самого знака степени, если степень не указана */
        }
      } else if (/NaN|Infinity/.test(input)) {
        /* Если в поле ввода NaN или Infinity */
        if (formula === input) {
          /* Если поле ввода совпадает с формулой - сброс полей до 0 */
          setNewValuesInFields("0");
        } else {
          /* Если имеется формула: поле ввода заменяется предыдущим символом из формулы (оператор), в формуле удаляется NaN или Infinity */
          let updateInput = formula.replace(/NaN$|Infinity$/, "");
          setNewValuesInFields(
            updateInput[updateInput.length - 1],
            formula.replace(/NaN$|Infinity$/, "")
          );
        }
      } else if (input[0]==='-' && input.length===2 && input===formula) {
        /* В поле ввода и формуле 1 отрицательная цифра - например, при вычислении косинуса пи, - сброс значений до 0*/
        setNewValuesInFields(0)
      }
      
      else {
        /* Во всех остальных случаях удаляется 1 знак из формулы и поля ввода */
        setNewValuesInFields(input.slice(0, -1), formula.slice(0, -1));
      }
    };

    formula && (isResult ? newCalculation() : currentCalculation());
  };

  /* ------------------------------ DIGIT ------------------------------------ */
  const addDigit = (value) => {
    /* Новое вычисление: в поля ввода и формулы устанавливается введенная цифра */
    const newCalculation = () => {
      dispatch(setIsResult(false));
      setNewValuesInFields(value);
    };

    /* Текущее вычисление */
    const currentCalculation = () => {
      if (!checkLimit(input) && !/NaN|Infinity/.test(input)) {
        /* Цифра вставляется только если не превышен лимит ввода и в поле ввода не NaN или Infinity*/
        if (/√/.test(input)) {
          /* Если имеется знак извлечения корня, то заменяется n, цифра припысывается к выражению слева от знака извлечения корня  */
          if (
            (value[0] === "-" && input.split("√")[0].replace("ⁿ", "") === "") ||
            value[0] !== "-"
          ) {
            setNewValueInInput(
              input.split("√")[0].replace("ⁿ", "") +
                value +
                "√" +
                input.split("√")[1]
            );
          }
        } else if (/\^/.test(input)) {
          /* Если имеется знак возведения в степень, то цифра припысывается к выраженю справа */
          if (
            (value[0] === "-" && input.split("^")[1] === "") ||
            value[0] !== "-"
          ) {
            setNewValueInInput(input + value);
          }
        } else if (checkForOperators(input)) {
          /* Если в поле ввода только оператор */
          value[0] === "-"
            ? /* Если при вставке из истории вставляется отрицательное число, в поле ввода вставляется только число без знака, в формулу со знаком */
              setNewValuesInFields(value.slice(1), formula + value)
            : /* Если число положительное - цифра приписывается к формуле, вставляется в поле ввода */
              setNewValuesInFields(value, formula + value);
        } else if (input === "0") {
          /* Если в поле ввода 0, цифра заменяет его */
          setNewValuesInFields(input.replace(/0$/, "") + value);
        } else if (
          /* Если в поле ввода число или 0., цифра добавляется к ним в поле ввода и формуле */

          checkForDigit(input) ||
          checkForDot(input)
        ) {
          value[0] === "-"
            ? setNewValuesInFields(value.slice(1), formula + value)
            : setNewValuesInFields(input + value, formula + value);
        }
      }
    };

    isResult ? newCalculation() : currentCalculation();
  };

  /* ------------------------------ DOT ------------------------------------ */
  /* Функция ввода точки */
  const addDot = () => {
    /* Новое вычисление */
    const newCalculation = () => {
      /* Если в поле ввода - число, к нему добавляется точка в формуле и поле ввода*/
      if (/^-?\d+$/.test(input)) {
        dispatch(setIsResult(false));
        setNewValueInInput(input + ".");
        /* формула может быть пустой, если не было предыдущих вычислений, тогда при вводе точки в формулу установится 0. */
        formula
          ? dispatch(setFormula(formula.split("=")[1] + "."))
          : dispatch(setFormula("0."));
      }
    };
    /* Текущее вычисление
        Функция выполняется если не превышен лимит ввода и в поле ввода не NaN или Infinity*/
    const currentCalculation = () => {
      if (!checkLimit(input) && !/NaN|Infinity/.test(input)) {
        if (/√/.test(input) && !checkForDot(input.split("√")[0])) {
          /* Если в поле ввода есть знак извлечения корня и под корнем еще нет точки */
          input.split("√")[0] === "ⁿ"
            ? setNewValueInInput(
                input.split("√")[0].replace("ⁿ", "0.") +
                  "√" +
                  input.split("√")[1]
              )
            : setNewValueInInput(
                input.split("√")[0] + ".√" + input.split("√")[1]
              );
        } else if (/\^/.test(input) && !checkForDot(input.split("^")[1])) {
          /* Если в поле ввода знак возведения в степень и в степени еще не было точки*/
          input.split("^")[1] === ""
            ? setNewValueInInput(input + "0.")
            : setNewValueInInput(input + ".");
        } else if (checkForOperators(input)) {
          /* Если в поле ввода оператор, поле ввода изменяется на 0. и 0. добавляется в формулу */
          setNewValueInInput("0.");
          dispatch(setFormula(formula + "0."));
        } else if (!checkForDot(input)) {
          /* В других случаях если в поле ввода нет точки (в поле ввода целое число) точка ддобавляется в поле ввода и формулу*/
          setNewValuesInFields(input + ".", formula + ".");
        }
      }
    };

    isResult ? newCalculation() : currentCalculation();
  };

  /* ------------------------------ OPERATORS ------------------------------------ */

  const addOperator = (value) => {
    /* Новое вычисление.
        В поле ввода устанавливается оператор, в формуле приписывается к предыдущему результату или 0 */
    const newCalculation = () => {
      dispatch(setIsResult(false));
      setNewValueInInput(value);
      formula
        ? dispatch(setFormula(formula.split("=")[1] + value))
        : dispatch(setFormula("0" + value));
    };

    /* Текущее вычисление */
    const currentCalculation = () => {
      if (/√/.test(input) && !/ⁿ/.test(input)) {
        /* Если в поле ввода знак извлечения корня и указана степень */
        let digit = input.split("√")[1];
        let n = input.split("√")[0];
        let degreeRoot = Math.pow(digit, 1 / n);
        /* В поле ввода устанавливается оператор, в формуле предыдущее число ззменяется результатом вычисления корня, дописывается оператор*/
        setNewValuesInFields(
          value,
          formula.slice(0, -digit.length) + degreeRoot + value
        );
      } else if (/\^/.test(input) && input.split("^")[1] !== "") {
        /* Если в поле ввода знак возведения в степень и указана степень */
        let digit = input.split("^")[0];
        let n = input.split("^")[1];
        let degreeRoot = Math.pow(digit, n);
        /* В поле вводда устанавливается оператор, в формуле предыдущее число ззменяется результатом вычисления степени, дописывается оператор */
        setNewValuesInFields(
          value,
          formula.slice(0, -digit.length) + degreeRoot + value
        );
      } else if (checkForOperators(input)) {
        /* Если в поле ввода оператор */
        if (checkForOperators(formula[formula.length - 2])) {
          /* Если до этого в формуле уже есть оператор, то есть вводится уже 3 по счету */
          setNewValuesInFields(
            value,
            formula.slice(0, -2) + value
          ); /* В поле ввода устанавливается новы оператор, в формуле им заменяются 2 предыдуущих */
        } else if (value !== "-") {
          /* В формуле до этого 1 оператор, вводится не - */
          setNewValuesInFields(
            value,
            formula.slice(0, -1) + value
          ); /* Предыдущий оператор заменяется новым */
        } else if (value === "-") {
          /* В формуле до этого 1 оператор, вводится - */
          setNewValuesInFields(
            value,
            formula + value
          ); /* В поле ввода устанавливается -, добавляется к формуле */
        }
      } else {
        /* Другие случаи: в поле ввода NaN, Infinity, корни и возведения в степень без указания степени, числа */
        /\.$/.test(input)
          ? setNewValuesInFields(value, formula.slice(0, -1) + value)
          : setNewValuesInFields(
              value,
              formula + value
            ); /* В поле ввода устанавливается оператор, допиывается к формуле */
      }
    };

    isResult ? newCalculation() : currentCalculation();
  };

  /* ------------------------------ ZERO ------------------------------------ */
  /* Добавление 0 */
  const addZero = () => {
    /* Новое вчисление: в полее ввода и формулу устанавливается 0 */
    const newCalculation = () => {
      dispatch(setIsResult(false));
      setNewValuesInFields("0");
    };

    /* Текущее вычисление: выполняется если не превышен лимит ввода и в поле ввода не 0 (недопущение ввода нескольких 0 подряд), NaN или Infinity */
    const currentCalculation = () => {
      if (!checkLimit(input) && input !== 0 && !/NaN|Infinity/.test(input)) {
        if (/√/.test(input) && input.split("√")[0] !== "0") {
          /* Если в поле ввода знак извлечения корня и в степени не 0 */
          setNewValueInInput(
            input.split("√")[0].replace("ⁿ", "") +
              "0" +
              "√" +
              input.split("√")[1]
          ); /* 0 дописывается к степени в поле ввода*/
        } else if (/\^/.test(input) && input.split("^")[1] !== "0") {
          /* Если в поле ввода возведение в степень и степень не 0 */
          setNewValueInInput(
            input + "0"
          ); /* 0 дописывается к степени в поле ввода*/
        } else if (checkForOperators(input)) {
          /* Если в поле ввода оператор */
          setNewValuesInFields(
            "0",
            formula + "0"
          ); /* В полее ввода устанавливается 0 и дописывается в формулу */
        } else {
          /* В других случаях (в поле ввода число, в том числе десятичное) */
          setNewValuesInFields(
            input + "0",
            formula + "0"
          ); /* 0 приписывается в поле ввода и формулу */
        }
      }
    };

    isResult ? newCalculation() : currentCalculation();
  };

  return { resetFields, cancelInput, addDigit, addDot, addOperator, addZero };
};
