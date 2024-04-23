import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../hooks/http-hook";
import { setPage} from "../redux/navigationSlice";
import {
  clearEvents,
  clearNotes,
  saveName,
  saveEmail,
  setNotesCount,
  getProfilePageData
} from "../redux/userInfoSlice";
import { logout } from "../redux/authSlice";
import ChangePassword from "../components/ProfilePage/changePassword";
import NameField from "../components/ProfilePage/NameField";
import Notes from "../components/ProfilePage/Notes";
import Events from "../components/ProfilePage/Events";
import Devices from "../components/ProfilePage/Devices";
import Spinner from "../components/Loaders/Spinner";
import DeletionConfirmation from "../components/ProfilePage/DeletionConfirmation";
import s from "./profilepage.module.css";
import Button from "../components/UI/Button";
import { setConfirmation } from "../redux/appSlice";



/* Страница профиля */
export default function ProfilePage() {
  
  const [edit, setEdit] = useState(false); /* true - редактирование профиля, false - основная страница профиля */
  const [changePass, setChangePass] = useState(false); /* true- отображение компонента смены пароля */
  const { loading, request } = useHttp();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.userInfoReducer.email);
  const updating = useSelector(state=>state.navReducer.updating)/* индикатор открытия и перезагрузки страницы */
  const [isDeletingProfile, setIsDeletingProfile] = useState(false) /* true - отображение компонента для удаления профиля */
  const [viewChildren, setViewChildren] = useState(false) /* Отображение заметок и событий только после получения данных о пользователе */

  /* при загрузке компонента,
  если открыто не редактирование профиля, а основная страница, выполняется функция получения данных с сервера.
  При размонтировании из store удаляются массивы заметок и событий для их корректного отображения при последующей загрузке 
  (в случае их изменения с другого устройства) */

  // useEffect(() => {
  //     if (!edit) {
  //     getUserInfo();
  //   } 

  //   return () => {
  //     dispatch(clearNotes());
  //     dispatch(clearEvents());
  //     setViewChildren(false)
  //   };
  // }, [updating, edit]); 

  useEffect(()=> {
    dispatch(getProfilePageData())
  }, [updating, dispatch])

  /* Получение данных о пользователе с сервера */
  const getUserInfo = async () => {
    try {
      const data = await request("/profile/get");
      dispatch(saveName(data.name));
      dispatch(saveEmail(data.email));
      dispatch(setNotesCount(data.notes))
      setViewChildren(true) /* Отрисовка Notes и Events после выполнения запроса */
    } catch {}
  };

  /* Отправка запроса на выход из системы */
  const exitFromSystem = async () => {
    try {
      await request('/auth/logout', 'GET')
    } catch {}
  }

  /* Функция кнопки выхода, удаление данных о пользователе из store (там же из localStorage), переход на страницу авторизации. */
  const exitApplication = () => {
    exitFromSystem()
    dispatch(logout())
    dispatch(setPage('auth'))
  };


  return (
    <div className={s.window}>
      {(!edit && loading) ? <Spinner/> : 
      <div className={s.profile}>
      {/* Стрелка возврата из режима редактирования на основной экран */}
      {edit && <div className={s.back}>
        <i className="fa-solid fa-backward" onClick={()=>{
          setEdit(false)
          setChangePass(false)
          setIsDeletingProfile(false)
          }}></i>
      </div>}
      <div className={s.info}>
        <div className={s.infofield}>
            <NameField edit={edit} setEdit={setEdit}/>
            {!edit ? (
              <div className={s.email}>{email}</div>
            ) : (
              <div className={s.password}>
                {!changePass ? (
                  <Button onClick={() => setChangePass((prev) => !prev)} text='Изменить пароль' size={'small'}/>

                ) : (
                  <ChangePassword setChangePass={setChangePass} />
                )}
              </div>
            )}
            </div>
          </div>
        <div className={s.field}>
          
          {!edit && <div className={s.actions}>
            {viewChildren && <Notes/>}
            {viewChildren && <Events/>}
          </div>}
          {edit && <div className={s.actions}><Devices/></div>}
          {!isDeletingProfile ? <div className={s.btns}>
            <Button onClick={()=>dispatch(setConfirmation({text: 'Выйти из аккаунта?', function: exitApplication}))} text='Выйти'size={'long'}/>
            {edit && (
                <Button onClick={()=>setIsDeletingProfile(true)} text='Удалить профиль' size={'long'} warning={true}/>

            )}
          </div>
           : <DeletionConfirmation setDeletingState={setIsDeletingProfile} component={'profile'}/>}
        </div>
        </div>}
    </div>
  );
}


