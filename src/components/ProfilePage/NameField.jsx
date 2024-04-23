import React, { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http-hook";
import { saveName } from "../../redux/userInfoSlice";
import { setNotice } from "../../redux/appSlice";
import s from "./namefield.module.css";


export default function NameField({ edit, setEdit }) {
  /* данные name получаются с сервера и хранятся в store */
  const name = useSelector((state) => state.userInfoReducer.name);
  const dispatch = useDispatch();
  const { request } = useHttp();
  const [newName, setNewName] = useState(name); /* используется при изменении имени пользователя */
    

  const checkName = () => {
    if (/^[а-яa-z]+$/i.test(newName)) return true;
    else return false;
  };

  const updateName = async () => {
    if (!checkName()) {
      dispatch(setNotice("Имя должно состоять только из букв без пробелов!"));
    } else if (newName === name) {
      dispatch(setNotice("Введенное имя совпадает с текущим"));
    } else {
      try {
        await request("/profile/changename", "POST", {
          name: newName,
        });
        dispatch(setNotice("Имя успешно изменено!"));
        dispatch(saveName(newName));
      } catch {}
    }
  };

  return (
    <div className={s.name}>
      <div className={s.namefield}>
        {edit ? (
          <input
            type="text"
            onFocus={(e)=>{
              e.target.setSelectionRange(newName.length, newName.length)
            }}
            value={newName}
            onChange={(e)=>setNewName(e.target.value)}
            placeholder="Введите имя"
          />
        ) : (
          <h2>{name}</h2>
        )}
        {edit ? (
           newName !== name && <i className="fa-solid fa-circle-check" onClick={updateName}></i>
    
        ) : (
          <i
            className="fa-solid fa-pen"
            onClick={() => {
              setEdit((prev) => !prev);
              setNewName(name);
            }}
          ></i>
        )}
      </div>
    </div>
  );
}
