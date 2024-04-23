import React, {  useState } from "react";
import { useHttp } from "../../hooks/http-hook";
import { useDispatch } from "react-redux";
import { setNotice } from "../../redux/appSlice";
import s from "./changePassword.module.css";
import Dots from "../Loaders/Dots";
import Password from "../UI/Password";


export default function ChangePassword(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [warning, setWarning] = useState(["",0]); /* Текст предупреждения, 0 - ни один пароль не подсвечивается, 1- поле нового пароля, 2 - старого, 3 - оба  */
  const { loading, request } = useHttp();
const dispatch = useDispatch()

  const newPasswordInput = (e) => {
    setNewPassword(e.target.value);
    setWarning(["", 0]);
  };

  const currentPasswordInput = (e) => {
    setCurrentPassword(e.target.value);
    setWarning(["", 0]);
  };

  const changePassword = async () => {
    if (currentPassword.length >= 6) {
      if (newPassword.length >= 6) {
        if (currentPassword !== newPassword) {
        try {
          await request("/profile/changepassword", "POST", {
            currentPassword,
            newPassword,
          });
         dispatch(setNotice("Ваш пароль успешно изменен!"))
          props.setChangePass((prev) => !prev);
        } catch  {}
        } else {
          setWarning(["Новый пароль совпадает со старым!", 3]);
        }
        
      } else {
        setWarning(["Минимальная длина пароля - 6 символов", 1]);
      }
    } else {
      setWarning(["Минимальная длина пароля - 6 символов", 2]);
    }
  };

  if (loading) {
    return (
        <div className={s.changing}>
            <Dots dark={true}/>
        </div>
    )
  } else {
  return (
    
    <div className={s.changing}>
        <div className={s.passwords}>
        <Password label={'Текущий пароль:'} value={currentPassword} onChange={currentPasswordInput} warning={warning[1] === 2 || warning[1]===3}/>
      <Password label={'Новый пароль:'} value={newPassword} onChange={newPasswordInput} warning={warning[1] === 1 || warning[1]===3}/>
      <div className={s.buttons}>
        <i className="fa-solid fa-circle-check" onClick={changePassword}></i>
        <i
          className="fa-solid fa-xmark"
          onClick={() => {
            props.setChangePass((prev) => !prev);
            setCurrentPassword("");
            setNewPassword("");
          }}
        ></i>
      </div>
      </div>
      
      <div className={s.hint}>{warning[0]}</div>
    </div>
  );}
}
