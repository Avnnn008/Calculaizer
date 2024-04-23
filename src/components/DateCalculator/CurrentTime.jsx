import React, {useState, useEffect} from 'react';
import s from '../datecalculator.module.css'

/* Компонент вывода текущего времени и установки его в локальное состояние */
export default function CurrentTime () {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
    setCurrentTime(new Date());
  }, 500);
}, [currentTime]);
  return (
    <div className={s.current}>
          <div className={s.title}>Сейчас:</div>
          <div className={s.now}>
            <div>
              {currentTime.toLocaleDateString("ru", {
                day: "numeric",
                month: "long",
              })}{" "}
              {currentTime.getFullYear()}
            </div>
            <div>{currentTime.toLocaleTimeString()}</div>
          </div>
        </div>
  )
}