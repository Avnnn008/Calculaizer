import React, {useEffect, useRef} from "react";
import { useMath } from "../../../hooks/mathcalc-hook";
import { btnClickHandler } from "../utilities/btnClickHandler";
import s from '../buttons.module.css'


/* Кнопа очистки полей */
export default function AC_BTN () {
  const clear = useRef(null)

const {resetFields} = useMath()
    /* Слушатель ввода с клавиатуры */
    useEffect(()=> {
      document.addEventListener('keydown', pressResetBtn)
    return ()=>document.removeEventListener('keydown', pressResetBtn)
    })
  

    /* Обработка нажатия кнопки клавиатуры: визуальные эффекты, вызов функции */
    const pressResetBtn = (e) => {
      if(e.key === 'Delete' || e.key === 'Escape') {
        e.preventDefault()
        btnClickHandler(clear.current)
        resetFields()
      }
    }
  /* Обработка нажатия кнопки калькулятора: визуальные эффекты, вызов функции */
    const resetBtnHandler = (event) => {
      btnClickHandler(event.target)
      resetFields()
    }

  return (
    <button ref={clear} className={s.clear} onClick={resetBtnHandler}>AC</button>
  )
}
