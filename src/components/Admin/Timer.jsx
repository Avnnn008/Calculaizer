import { useEffect, useState } from "react";
import s from './timer.module.css'
import { useDispatch } from "react-redux";
import { setNotice } from "../../redux/appSlice";


export default function Timer ({time, setIsEntered}) {
    const [timeLeft, setTimeLeft] = useState(time - Date.now())
    const dispatch = useDispatch()

    /* Оставшееся время сессии, по истечении - возврат к вводу пароля администратора */
    useEffect(()=> {
        let interval = setInterval(()=>{
            setTimeLeft(time - Date.now())
        }, 60000)
        if(timeLeft <= 300000 && timeLeft > 240000) {
            dispatch(setNotice('До окончания сессии 5 минут!'))
        }
        if (timeLeft <=0) {
            clearInterval(interval)
            setIsEntered(false)
            localStorage.removeItem('adminAccess')
        }
    }, [timeLeft])

    const hourMin = () => {
        let time =Math.ceil(timeLeft/1000/60) /* время в минутах */
        let hour = Math.floor(time / 60);
        let min = Math.ceil((time - hour * 60));
          return `${hour} ч ${min} мин`;
      };

    return (
        <div className={s.timerfield}>
            <div className={s.timer}>
                <div>Время до окончания сессии:</div>
          <div >{hourMin()}</div>
            </div>
            
        </div>
    )
}