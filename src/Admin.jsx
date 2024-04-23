import React, { useState} from "react";
import { useHttp } from "./hooks/http-hook";
import { useDispatch } from "react-redux";
import { resetModal } from "./redux/appSlice";
import AdminConsole from "./components/Admin/AdminConsole";
import Spinner from './components/Loaders/Spinner'
import Modal from "./components/ModalWindows/Modal";
import Timer from "./components/Admin/Timer";
import s from "./admin.module.css";
import Button from "./components/UI/Button";
import Password from "./components/UI/Password";
import { useNavigate } from "react-router-dom";


export default function Admin() {
  const [password, setPassword] = useState("");
  const [isEntered, setIsEntered] = useState(false);
  const [time, setTime] = useState(null)
  const { request, loading } = useHttp();
  const dispatch = useDispatch();
  const navigate = useNavigate()


  const adminEnter = async () => {
    try {
        dispatch(resetModal())
      const data = await request("/admin/enter", "POST", { password });
      setTime(data.time)
      localStorage.setItem('adminAccess', data.access)
      setIsEntered(true);
    } catch  {} 
  };

  const adminExit = async () => {
    try {
      await request('/admin/logout')
      localStorage.removeItem('adminAccess')
      setIsEntered(false)
      navigate('/')
  } catch{}
  }

  return (
    <div className={s.admin}>
      <div className={s.back}><i className='fa-solid fa-arrow-left' onClick={adminExit}/></div>
      <Modal/>
      {isEntered && <Timer time={time} setIsEntered={setIsEntered}/>}
      {isEntered ? (
        <AdminConsole/>
      ) : loading ? <Spinner/> : (
        <div className={s.passwordwindow}>
          <Password
            label={"Пароль администратора:"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={adminEnter} size={"small"} text={"войти"} />
        </div>
      )}
    </div>
  );
}
