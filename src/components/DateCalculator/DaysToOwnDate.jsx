import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDateTo } from "../../redux/calcSlice";
import TextModal from "../ModalWindows/TextModal";
import { useHttp } from "../../hooks/http-hook";
import { setNotice } from "../../redux/appSlice";
import s from "../datecalculator.module.css";
import m from '../UI/input-and-selection-fields.module.css'
import Dots from "../Loaders/Dots";

/* Режим ввести свою дату. */

export default function DaysToOwnDate() {
  const isAuth = useSelector((state) => state.authReducer.isAuth);
  const dateTo = useSelector(state=> state.calcReducer.dateTo) /* введенная дата события */
  const dispatch = useDispatch()
  const [newEvent, setNewEvent] = useState(""); /* текст для записи события */
  const [isNewEvent, setIsNewEvent] = useState(false); /* true - компонент для добавления события */
  const {request, loading} = useHttp()

    /* сохранение события в профиль */
    const saveEvent = async () => {
      const saveDate = `${dateTo} 00:00:00`;
      try {
        await request("/event/new", "POST", {
          date: saveDate,
          newEvent: newEvent.trim(),
        });
        setIsNewEvent(false);
        dispatch(setNotice(
          "Событие сохранено! Оно отобразится на странице Вашего профиля!"
        ));
      } catch (e) {}
    };

  return (
    <div className={s.input}>
      <input
        className={m.input}
        type="date"
        value={dateTo}
        placeholder="дд.мм.гггг"
        min="1000-01-01"
        max="9999-12-31"
        onChange={(e) => dispatch(setDateTo(e.target.value))}
      />
      {dateTo && isAuth && (
        <>
          <i
            onClick={() => {
              setIsNewEvent(true);
              setNewEvent("");
            }}
            className="fa-solid fa-plus"
          ></i>
        </>
      )}
      {isNewEvent && (
        <TextModal
          title={loading ? <Dots dark={true}/> : `Событие ${new Date(dateTo).toLocaleDateString()}`}
          text={newEvent}
          setText={setNewEvent}
          condition={newEvent.length < 3}
          placeholder={"Введите название события (от 3 символов)"}
          onSubmit={saveEvent}
          submittext="Сохранить"
          close={()=>setIsNewEvent(false)}
        />
      )}
    </div>
  );
}
