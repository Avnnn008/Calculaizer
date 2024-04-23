import React, {useEffect, useRef } from "react";
import { useMath } from "../../../hooks/mathcalc-hook";
import { checkForZero} from "../utilities/checking";
import { btnClickHandler } from "../utilities/btnClickHandler";
import s from '../buttons.module.css'


export default function ZERO_BTN() {
  const {addZero} = useMath()
  const zero = useRef(null)

  useEffect(()=> {
    document.addEventListener('keypress', pressZeroBtn)
  return ()=>document.removeEventListener('keypress', pressZeroBtn)
  })

  const pressZeroBtn = (e) => {
    if(checkForZero(e.key)) {
      btnClickHandler(zero.current)
      addZero()
    }
  }

  const zeroBtnHandler = (event) => {
    btnClickHandler(event.target)
    addZero()
  }



  return (
    <button ref={zero} className={s.zero} onClick={ zeroBtnHandler }>
      0
    </button>
  );
}
