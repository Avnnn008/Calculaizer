import React, {useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput, setFormula, setIsResult } from "../../../redux/calcSlice";
import { saveMath } from "../../../redux/userInfoSlice";
import { useHttp } from "../../../hooks/http-hook";
import { btnClickHandler } from "../utilities/btnClickHandler";
import {
  generalizeResult,
  modifyResultFormula,
} from "../utilities/forEqualOperator";
import { checkInputFieldLength } from "../utilities/checking";
import { setNotice } from "../../../redux/appSlice";
import s from "../buttons.module.css";

export default function EQUAL_BTN() {
  const {input, isResult, formula, isAuth} = useSelector(state=>({
    input: state.calcReducer.mathInput,
    isResult: state.calcReducer.mathIsResult,
    formula: state.calcReducer.mathFormula,
    isAuth: state.authReducer.isAuth
  }))
  const dispatch = useDispatch();
  const { request } = useHttp();
  const equals = useRef(null)

  useEffect(() => {
    document.addEventListener("keypress", pressEqualBtn);
    return () => document.removeEventListener("keypress", pressEqualBtn);
  });

  const saveResult = async (expression) => {
    if (isAuth) {
      let date = `${new Date()}`;
      dispatch(saveMath({ date, expression }));
      try {
        await request("/math/save", "POST", { expression, date });
      } catch (e) {}
    }
  };

  const pressEqualBtn = (e) => {
    if (e.key === "=" || e.key === "Enter") {
      e.preventDefault();
      btnClickHandler(equals.current);
      equalOperator();
    }
  };

  const equalBtnHandler = (event) => {
    btnClickHandler(event.target);
    equalOperator();
  };

  const rootOrDegreeConversion = () => {
    if (/√/.test(input) && !/ⁿ/.test(input)) {
      let digit = input.split("√")[1];
      let n = input.split("√")[0];
      let degreeRoot = Math.pow(digit, 1 / n);
      return [degreeRoot, digit];
    } else if (/\^/.test(input) && input.split("^")[1] !== "") {
      let digit = input.split("^")[0];
      let n = input.split("^")[1];
      let degreeRoot = Math.pow(digit, n);
      return [degreeRoot, digit];
    } else return [false, false];
  };

  const equalOperator = () => {
    const [degreeRoot, digit] = rootOrDegreeConversion();
    try {
      if (!isResult) {
        let modifyedFormula;
        degreeRoot
          ? (modifyedFormula = modifyResultFormula(
              formula.slice(0, -digit.length) + degreeRoot
            ))
          : (modifyedFormula = modifyResultFormula(formula));

        let [totalResult, statusResult] = generalizeResult(modifyedFormula);
        if (totalResult == '-0') {
          totalResult = '0'
        }
        checkInputFieldLength(totalResult);
        dispatch(setInput(totalResult));
        statusResult
          ? dispatch(setFormula(modifyedFormula + totalResult))
          : dispatch(setFormula(""));
        dispatch(setIsResult(statusResult));

        saveResult(modifyedFormula + totalResult);
      } 
    } catch {
      dispatch(setIsResult(true));
      dispatch(setInput("0"));
      dispatch(setFormula("0"));
      checkInputFieldLength("0");
      dispatch(setNotice(
        "Упс! Что-то пошло не так... Вероятно, Вы пытались вычислить слишком большое число."
      ));
    }
  };

  return (
    <button
      ref={equals}
      className={s.equals}
      onClick={equalBtnHandler}
    >
      =
    </button>
  );
}
