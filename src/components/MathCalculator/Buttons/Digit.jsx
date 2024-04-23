import React, { useEffect} from "react";
import {
  checkForDigit
} from "../utilities/checking";
import { btnClickHandler } from "../utilities/btnClickHandler";
import { useMath } from "../../../hooks/mathcalc-hook";

/* Кнопки ввода цифр 1-9 */
 export default function DIGIT_BTN() {
  const {addDigit} = useMath()

    /* Слушатель нажатия кнопок на клавиатуре */
    useEffect(()=> {
      document.addEventListener('keypress', pressDigitBtn)
    return ()=>document.removeEventListener('keypress', pressDigitBtn)
    })

    /* Обработка нажатия кнопок на клавиатуре: визуальные эффекты, вызов функции */
    const pressDigitBtn = (e) => {
          if (checkForDigit(e.key)) {
        let btn = document.querySelector(`button[value="${e.key}"]`)
        btnClickHandler(btn)
        addDigit(e.key)
      }
    }

     /* Обработка нажатия кнопок на калькуляторе: визуальные эффекты, вызов функции */
  const digitBtnHandler = (event) => {
    btnClickHandler(event.target)
    addDigit(event.target.value)
  }  



  return (
    <>
      {Object.keys(DIGITS).map((el) => (
        <button key={el} value={DIGITS[el]} onClick={digitBtnHandler}>
          {DIGITS[el]}
        </button>
      ))}
    </>
  );
}
/* Объект, содержащий ключи и значения цифр калькулятора */
const DIGITS = {
  seven: 7,
  eight: 8,
  nine: 9,
  four: 4,
  five: 5,
  six: 6,
  one: 1,
  two: 2,
  three: 3
};


