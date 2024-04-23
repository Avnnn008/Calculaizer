import React, {useEffect, useRef, useState} from "react";
import { useSelector } from "react-redux";
import Buttons from "./Buttons/Buttons";
import AdditionalButtons from "./AdditionalButtons/AdditionalButtons";
import s from './calculator.module.css'


/* Компонент математического калькулятора */
export default function Calculator() {
    const {input, limit, formula} = useSelector(state=>({
      input: state.calcReducer.mathInput,
      limit: state.calcReducer.mathLimit,
      formula: state.calcReducer.mathFormula
    }))
    const [additional, setAdditional] = useState(false) /* true - открыта дополнительная клавиатура, false - основная */
    const buttons = useRef(null)
    const additionalButtons = useRef(null)

    /* Слушатель ввода с клавиатуры */
    useEffect(()=> {
      document.addEventListener('keydown', pressBtn)
      return ()=>{
        document.removeEventListener('keydown', pressBtn)
      }
    })

    /* Переключение между основными и дополнительными кнопками калькулятора с клавиатуры */
   const pressBtn = (e) => {
    if ((e.key === 'ArrowLeft' && !additional)||(e.key === 'ArrowRight' && additional)) {
      setAdditional(prev=>!prev)
      changeButtonsFields()
    } 
   }

   /* Отображение основных (main) или дополнительных (additional) кнопок в зависимости от состония additional */
   function changeButtonsFields () {
        if (!additional) {
      buttons.current.style.visibility = 'hidden'
      additionalButtons.current.style.visibility = 'visible'
    } else {
      buttons.current.style.visibility = 'visible'
      additionalButtons.current.style.visibility = 'hidden'
    }
   }

   /* Функция смены видимости кнопок (основных, дополнительных) */
  const showHideAdditional = () => {
    changeButtonsFields()
    setAdditional(prev=> !prev)
  }

    return (

      <div className={s.calculator}>
        <button className={additional ? s.showHideAdditional + ' ' + s.leftSide : s.showHideAdditional} onClick={showHideAdditional}>
        {!additional ? (
          <i className="fa-solid fa-caret-left"></i>
        ) : (
          <i className="fa-solid fa-caret-right"></i>
        )}
        </button>
        <div className={s.display}>
          <div className={s.smallDisplay}>{formula}</div>
          <div id="display" className={s.largeDisplay}>
            {limit ? "DIGIT LIMIT" : input}
          </div>
        </div>
        <Buttons buttons={buttons}/>
         <AdditionalButtons additionalButtons={additionalButtons}/>
         
        
      </div>
    );
  }
