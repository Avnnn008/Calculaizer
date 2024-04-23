import React, { useEffect, useRef } from "react";
import {checkForDot} from "../utilities/checking";
import { btnClickHandler } from "../utilities/btnClickHandler";
import { useMath } from "../../../hooks/mathcalc-hook";
import s from '../buttons.module.css'

/* Кнопка ввода точки */
export default function DOT_BTN() {
   const {addDot} = useMath()
   const decimal = useRef(null)


    /* Слушатель нажатия кнопки на клавиатуре */
    useEffect(()=> {
      document.addEventListener('keydown', pressDotBtn)
    return ()=>document.removeEventListener('keydown', pressDotBtn)
    })
  
    /* Обработка нажтия кнопки на клавиатуре: визуальные эффекты, вызов функии */
    const pressDotBtn = (e) => {
      if(checkForDot(e.key)) {
        btnClickHandler(decimal.current)
        addDot()
      }
    }
  /* Обработка нажтия кнопки на калькуляторе: визуальные эффекты, вызов функии */
    const dotBtnHandler = (event) => {
      btnClickHandler(event.target)
      addDot()
    }
    


  return (
    <button  ref={decimal} className={s.decimal} onClick={ dotBtnHandler }>
      .
    </button>
  );
}