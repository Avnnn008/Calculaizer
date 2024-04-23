import { useDispatch } from "react-redux";
import { useHttp } from "../../../../hooks/http-hook";
import s from "./userinfo.module.css";
import { useEffect, useState } from "react";
import { setConfirmation, setNotice } from "../../../../redux/appSlice";
import Button from "../../../UI/Button";
import TextModal from "../../../ModalWindows/TextModal";
import Dots from "../../../Loaders/Dots";

export default function UserInfo({ user, deleteById}) {
  const { request, loading } = useHttp();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [checked, setChecked] = useState(false);
  const [text, setText] = useState("");
  const [writeEmail, setWriteEmail] = useState(false);

  useEffect(() => {
    if (user) {
     getUserData()
    }
  }, [user]);



  const getUserData = async () => {
    try {
      let data = await request(`/admin/user?id=${user._id}`);
      setUserData(data);
      setChecked(data.user.isVIP);
    } catch {
      dispatch(setNotice("Не удалось загрузить данные"));
    }
  };


  const changeUserVipStatus = async () => {
    try {
      await request("/admin/user/changevip", "POST", {
        id: user._id,
        status: !checked,
      });
      setChecked((prev) => !prev);
    } catch {
      dispatch(setNotice("Произошла ошибка"));
    }
  };

  const sendEmail = async () => {
    try {
      await request("/admin/sendemail", "POST", {
        email: userData.user.email,
        text,
      });
      setWriteEmail(false);
      setText("");
      dispatch(setNotice("Сообщение отправлено!"));
    } catch {
      dispatch(setNotice("Произошла ошибка"));
    }
  };

  const deleteDevice = async (id) => {
    try {
      await request("/admin/deletedevice", "POST", { id });
      dispatch(setNotice("Устройство удалено!"));
      await getUserData();
    } catch {
      dispatch(setNotice("Произошла ошибка"));
    }
  };

  return (
    <>
    {loading && <div className={s.loading}><Dots dark={true}/></div>}
      {userData.user && (
        <div className={s.user}>
          <div>
            <div>{userData.user.name}</div>
            <div className={s.email}>
              <div>{userData.user.email}</div>
              <Button
                text={"Написать"}
                size={"small"}
                onClick={() => setWriteEmail(true)}
              />
            </div>
          </div>
          <div className={s.actions}>
            <div className={s.vip}>
            <div>VIP:</div>
            <label className={s.switch}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  dispatch(
                    setConfirmation({
                      text: `Изменить VIP-статус пользователя?`,
                      function: changeUserVipStatus,
                    })
                  )
                }
              />
              <span className={s.slider}></span>
            </label>
          </div>
          <i className="fa-solid fa-user-xmark" onClick={()=> dispatch(
                    setConfirmation({
                      text: `Удалить пользователя?`,
                      function: deleteById,
                    })
                  )}></i>
          </div>
          
        </div>
      )}
      {userData.tokens && (
        <div className={s.tokens}>
          <div>Устройств: {userData.tokens.length}</div>
          {userData.tokens.length > 0 && (
            <div className={s.tokenlist}>
              {userData.tokens.sort((a,b)=>b.date-a.date).map((el) => (
                <div key={el._id} className={s.device}>
                  <div>{`${el.device}, ${el.browser}, ${el.os}, ${el.location}`}</div>
                  <div>{new Date(el.date).toLocaleDateString()}</div>
                  <div>
                    <Button
                      size={"small"}
                      text={<i className="fa-solid fa-trash"></i>}
                      onClick={() =>
                        dispatch(
                          setConfirmation({
                            text: `Удалить устройство ${el.device}?`,
                            function: () => deleteDevice(el._id),
                          })
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {writeEmail && (
        <TextModal
        title={loading ? <Dots dark={true}/> : ''}
          text={text}
          setText={setText}
          close={()=>setWriteEmail(false)}
          submittext={"Отправить"}
          onSubmit={sendEmail}
          placeholder="Первый абзац - заголовок. После переноса строки - текст сообщения."
        />
      )}
    </>
  );
}
