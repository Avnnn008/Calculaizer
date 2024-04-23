import React, {useState } from "react";
import { useDispatch } from "react-redux";
import { useHttp } from "../../hooks/http-hook";
import { logout } from "../../redux/authSlice";
import { setPage } from "../../redux/navigationSlice";
import { deleteDevice } from "../../redux/userInfoSlice";
import { setNotice } from "../../redux/appSlice";
import s from './deletionconfirmation.module.css'
import Dots from "../Loaders/Dots";
import Password from "../UI/Password";


export default function DeletionConfirmation ({setDeletingState, component, endSession}) {
    const [password, setPassword] = useState('') /* ввод текущего пароля (для удаления профиля) */
    const [warning, setWarning] = useState(false) /* Для установки стиля ошибки на пароле */
    const {request, loading} = useHttp()
    const dispatch = useDispatch()

    const componentData = {
      title: '',
      funct: ()=>{},
      back: ()=>{}
    }
    switch (component) {
      case 'profile': 
      componentData.title = 'Для удаления профиля введите пароль:'
      componentData.funct = ()=>{(checkPassword()) && deleteProfile()}
      componentData.back = ()=> {
        setDeletingState(false)
            setPassword('')
      }
      break
      case 'device' :
        componentData.title = `Для завершения сессии ${endSession[1]} введите пароль:`
      componentData.funct = ()=>{(checkPassword()) && deleteSession()}
      componentData.back = ()=> {
        setDeletingState(false)
            setPassword('')
      }
      break

      }

      /* Проверка, что введенныйпароль не менее 6 символов */
      const checkPassword = () => {
        if (password.length < 6) {
          setWarning(true)
          return false
        } else return true
      }
    

      /* Удаление профиля: отправка запроса на сервер, удаление данных о пользователе из store (там же из localStorage), переход на страницу авторизации. */
  async function deleteProfile  () {
    try {
      await request("profile/delete", "POST", {password});
      
      dispatch(logout())
      dispatch(setPage('auth'))
      dispatch(setNotice("Ваш аккаунт удален!"));
    } catch  {}
  };

  /* Удаление сессии на выбранном устройстве */
  async function deleteSession ()  {
    const id = endSession[0]
 try {
    await request('profile/device/delete', 'POST', {password, id})
    dispatch(deleteDevice(id))
    dispatch(setNotice(`Сессия ${endSession[1]} удалена!`))
    componentData.back()

 } catch  {}
}

  if (loading) {
    return (
        <div className={s.load}>
           <Dots dark={true}/> 
        </div>
    )
  } else {
    return (
        <div className={s.password}>{componentData.title}
        <div className={s.input}>
          <Password label={''} value={password} onChange={(e)=>{
            setPassword(e.target.value) 
            setWarning(false)}} warning={warning}/>
        </div>
            <div className={s.buttons}>
            <i className="fa-solid fa-circle-check" onClick={componentData.funct}></i>
        <i
          className="fa-solid fa-xmark"
          onClick={componentData.back}
        ></i>
            </div>
           {warning && <div className={s.hint}>Минимальная длина пароля - 6 символов!</div>}
            </div>
           
    )
  }

    
}