import React, { useState, useEffect} from "react";
import { useDispatch} from "react-redux";
import { clearMath} from "../../redux/userInfoSlice";
import HistoryList from "./HistoryComponents/HistoryList";
import s from './history.module.css'

/* Компонент истории операций для зарегистрированных пользователей */
export default function History() {
  const [visibleHistory, setVisibleHistory] = useState(false); /* true - история видна, false - история скрыта */
  const dispatch = useDispatch()


  /* Удаление истории из store при закрытии окна истории */
  useEffect(()=> {
    return () => {
      dispatch(clearMath())
    }
  }, [visibleHistory])


  return (
    <div className={s.history}>
      <button
        className={visibleHistory? s.visibleHistoryBtn : s.visibleHistoryBtn + ' ' + s.moveBtn}
        onClick={() => setVisibleHistory((prev) => !prev)}
      >
        {visibleHistory ? (
          <i className="fa-solid fa-caret-left"></i>
        ) : (
          <i className="fa-solid fa-caret-right"></i>
        )}
      </button>
      <div className={visibleHistory? s.historyField :s.historyField + ' ' + s.hide}>
         {visibleHistory &&  <HistoryList/>}
        
      </div>
      
    </div>
  );
}
