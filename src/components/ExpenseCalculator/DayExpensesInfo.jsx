import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import s from "./dayexpenseinfo.module.css";
import m from '../UI/input-and-selection-fields.module.css'
import { setConfirmation, setNotice } from "../../redux/appSlice";
import { useHttp } from "../../hooks/http-hook";
import Dots from "../Loaders/Dots";

export default function DayExpensesInfo({ data, getData }) {
  const dispatch = useDispatch();
  const { request, loading } = useHttp();
  const [loadElement, setLoadElement] = useState(); /* id редактируемого или удаляемого элемента для отображения Dots */
  const [editText, setEditText] = useState({ id: "", text: "" }); /* редактируемая запись расходов */
  const [newText, setNewText] = useState(""); /* новое описание расхода */

  /* Установка значения в input при выборе записи расходов для редфктирования или при отмене редфктирования */
  useEffect(()=> {
    setNewText(editText.text)
  }, [editText.text])

  /* Подсчет общей суммы расходов за день */
  const getTotalSum = () => {
    if (data && data.length) {
      const sum = data.map((el) => el.price).reduce((acc, cur) => acc + cur);
    if (sum) {
      return sum.toFixed(2);
    }
    } else {
      return 0
    }
    
  };

  /* Удаление записи о расходе */
  const deleteExpense = async (id) => {
    setLoadElement(id);
    try {
      await request(`/expenses/delete?id=${id}`);
      dispatch(setNotice("Удалено!"));
      getData();
      setLoadElement("");
    } catch {}
  };

/* Редактирование описания расхода */
  const editCategoryText = async () => {
    if (newText && newText !== editText.text) {
      try {
        setLoadElement(editText.id);
        await request("/expenses/edit", "POST", { id: editText.id, newText });
        getData();
        setLoadElement("");
        dispatch(setNotice('Описание изменено!'))
      } catch {}
    } 
    setEditText({ id: "", text: "" });
  };

  return (
    <div className={s.info}>
        <div className={s.total}>ИТОГ: {getTotalSum()}</div>
      <div className={s.list}>
        {(data &&
          data.length) ?
          data.map((el) => (
            <div key={el._id} className={s.line}>
              <div className={s.title}>
                <div className={s.expense}>
                  <div className={s.price}>
                    {el.price && el.price.toFixed(2)}
                  </div>
                  <div className={s.category}>{el.category}</div>
                </div>

                <div className={s.icons}>
                  {editText.id===el._id ? (
                    <>
                      <i
                        className="fa-solid fa-check"
                        onClick={editCategoryText}
                      ></i>
                      <i
                        className="fa-solid fa-xmark"
                        onClick={()=>setEditText({ id: "", text: "" })}
                      ></i>
                    </>
                  ) : (
                    <>
                      <i
                        className="fa-solid fa-pen"
                        onClick={() =>
                          setEditText({ id: el._id, text: el.text })
                        }
                      ></i>
                      <i
                        className="fa-solid fa-trash"
                        onClick={() =>
                          dispatch(
                            setConfirmation({
                              text: "Удалить запись из расходов?",
                              function: () => deleteExpense(el._id),
                            })
                          )
                        }
                      ></i>
                    </>
                  )}
                </div>
              </div>
              <div className={el.text ? s.text : `${s.text} ${s.empty}`}>
                {loading && loadElement === el._id ? (
                  <div className={s.loading}>
                    <Dots />
                  </div>
                ) : editText.id===el._id? <input type="text" autoFocus className={m.input} value={newText} onChange={(e)=>setNewText(e.target.value)}/> : el.text ? (
                  el.text
                ) : (
                  "без описания"
                )}
              </div>
            </div>
          )) : <div>Нет данных</div>}
      </div>
    </div>
  );
}
