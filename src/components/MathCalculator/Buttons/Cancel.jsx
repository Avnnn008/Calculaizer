import React, { useEffect, useRef } from "react";
import { btnClickHandler } from "../utilities/btnClickHandler";
import s from "../buttons.module.css";
import { useMath } from "../../../hooks/mathcalc-hook";


/* Кнопка отмены последнего ввода */
export default function CANCEL_BTN() {
  const {cancelInput} = useMath()
  const cancel = useRef(null)

  /* Слушатель ввода с клавиатуры */
  useEffect(() => {
    document.addEventListener("keydown", pressCancelBtn);
    return () => document.removeEventListener("keydown", pressCancelBtn);
  });

  /* Обработка нажатия кнопки клавиатуры: визуальные эффекты, вызов функции */
  const pressCancelBtn = (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      btnClickHandler(cancel.current); 
      cancelInput();
    }
  };

  /* Обработка нажатия кнопки на калькуляторе: визуальные эффеты, вызов функции */
  const cancelBtnHandler = (event) => {
    btnClickHandler(event.target); 
    cancelInput();
  };




  return (
    <button
      ref={cancel}
      className={s.cancel}
      onClick={cancelBtnHandler}
    >
      C
    </button>
  );
}
