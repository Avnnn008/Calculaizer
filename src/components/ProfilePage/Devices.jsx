import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeletionConfirmation from './DeletionConfirmation';
import s from './notes.module.css';
import { useHttp } from '../../hooks/http-hook';
import { saveDevice } from '../../redux/userInfoSlice';
import Dots from '../Loaders/Dots';

export default function Devices () {
    const devices = useSelector(state=> state.userInfoReducer.devices)
    const dispatch = useDispatch()
    /* Данные из состояния передаются в компонент подтверждения удаления девайса паролем.
    Массив - 0 элемент - id устройства, 1 - описание*/
    const [endSession, setEndSession] = useState(false) 
    const {request, loading} = useHttp()
    
    useEffect(()=> {
      getDevices()
    }, [])

    const getDevices = async () => {
      try {
        const data = await request('/profile/device/all')
        dispatch(saveDevice(data.devices))
      } catch {}
    }

    const drawDevice = (el) => {
        return (
        <div className={s.dev} key={el._id}>
          <div className={s.info}>
            <div className={s.name}>{`${el.device}, ${el.os}, ${el.browser}, ${el.location}`}</div>
            <div className={s.date}>
                <div>{new Date(el.date).toLocaleString('ru', {dateStyle: 'short'})},</div>
                <div>{new Date(el.date).toLocaleString('ru', {timeStyle: 'short'})}</div>
            </div>
          </div>
          <div className={s.delete} data-key={el.id}>
            <i onClick={()=>setEndSession([el._id, `${el.device}, ${el.os}, ${el.browser}, ${el.location}`])} className="fa-solid fa-trash"></i>
          </div>
        </div>)
    };

   


  return (
    <div className={s.notesblock}>
      <div className={s.head}>
        <div className={s.title}>{`Активные сеансы (${devices.length})`}</div>
      </div>
      <div className={s.notelist}>
          {loading? <Dots dark={true}/> : devices.map(el=>drawDevice(el))}
      </div>
      {endSession && 
      <DeletionConfirmation setDeletingState={setEndSession} component={'device'} endSession={endSession}/>
        }
      </div>
  )
}