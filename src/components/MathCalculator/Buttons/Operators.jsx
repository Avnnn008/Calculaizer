import React, {useEffect } from "react";
import { useMath } from "../../../hooks/mathcalc-hook";
import { btnClickHandler } from "../utilities/btnClickHandler";
import s from '../buttons.module.css'



export default function OPERATORS_BTN () {

const {addOperator} = useMath()


    useEffect(()=> {
      document.addEventListener('keypress', pressOperatorBtn)
      return ()=> document.removeEventListener('keypress', pressOperatorBtn)
    })
  
    const pressOperatorBtn = (e) => {
      let btn
      if(e.key === '+' || e.key === '-') {
        btn = document.querySelector(`button[value="${e.key}"]`)
        btnClickHandler(btn);
        addOperator(e.key)
      } else if (e.key === '*') {
        btn = document.querySelector(`button[value="x"]`)
        btnClickHandler(btn);
        addOperator('x')
      } else if (e.key === '/') {
        e.preventDefault()
        btn = document.querySelector(`button[value="÷"]`)
        btnClickHandler(btn);
        addOperator('÷')
      }
    }
  
  
    const operatorBtnHandler = (event) => {
      btnClickHandler(event.target);
      addOperator(event.target.value)
    };

const OPERATORS_BTN = {
  '+':  s.add,
  '-' : s.subtract,
  '÷' : s.divide,
  'x': s.multiply
}

  return (
    <>
    {Object.keys(OPERATORS_BTN).map(el=> <button key={el} className={OPERATORS_BTN[el]} value={el} onClick={operatorBtnHandler}>
       {el}
      </button>)}
  </>
  )
}


