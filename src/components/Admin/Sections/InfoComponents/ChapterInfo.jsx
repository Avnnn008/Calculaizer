import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CreateInfoComponent from "../CreateInfoComponent";
import { setConfirmation, setNotice } from "../../../../redux/appSlice";
import { useHttp } from "../../../../hooks/http-hook";
import s from './infosection.module.css'

export default function ChapterInfo ({data, setUpdating}) {
    const dispatch = useDispatch();
    const { request, loading } = useHttp();
    const [editTitle, setEditTitle] =
      useState(
        {id: '', name: '', title: ''}
      ); /* Редактирование заголовка раздела или подразздела : id - раздела или подраздела, name - chapter или subsection, title - текущий заголовок */
    const [newTitle, setNewTitle] =
      useState(""); /* Обновленный заголовок раздела или подраздела */
  
    useEffect(() => {
      if (editTitle.title) {
        setNewTitle(editTitle.title);
      }
    }, [editTitle.title]);
  
  
    /* Удаление подраздела или целого раздела */
    const deleteComponent = async (id) => {
      try {
        await request(
          `/admin/delete${
            id ? "subsection"  : "chapter"
          }?id=${id? id : data._id}`
        );
        dispatch(setNotice("Удалено!"));
        setUpdating(true);
      } catch {}
    };
  
    /* Обновление заголовка раздела или подраздела */
    const saveNewTitle = async () => {
      if (newTitle !== editTitle.title && newTitle!== '') {
        try {
          await request("/admin/newtitle", "POST", {
            id: editTitle.id,
            name: editTitle.name,
            newTitle,
          });
          dispatch(setNotice("Изменено!"));
          setUpdating(true);
        } catch {}
      }
      setEditTitle({id: '', name: '', title: ''});
    };
    
    return (
        <div className={s.infosection}>
        {data && <div className={s.line}>
          {editTitle.id === data._id ? (
            <input
              type="text"
              defaultValue={data.name}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          ) : (
            <div className={s.title}>{data.name}</div>
          )}
          <div className={s.icons}>
            {editTitle.id === data._id  ? (
              <i
                className="fa-solid fa-check"
                onClick={
                  editTitle.title === newTitle
                    ? () => setEditTitle({id: '', name: '', title: ''})
                    : saveNewTitle
                }
              ></i>
            ) : (
              <i
                className="fa-solid fa-pen"
                onClick={() => setEditTitle({id: data._id, name: 'chapter', title: data.name})}
              ></i>
            )}
            <i
              className="fa-solid fa-trash"
              onClick={() =>
                dispatch(
                  setConfirmation({
                    text: `Удалить раздел ${data.name} целиком?`,
                    function: () => deleteComponent(),
                  })
                )
              }
            ></i>
          </div>
        </div>}

        {data && data.subsections && data.subsections.map((el) => (
          <div className={s.line} key={el._id}>
            <div className={s.icons}>
              {editTitle.id === el._id ? (
                <i
                  className="fa-solid fa-check"
                  onClick={
                    editTitle.title === newTitle
                      ? () => setEditTitle({id: '', name: '', title: ''})
                      : saveNewTitle
                  }
                ></i>
              ) : (
                <i
                  className="fa-solid fa-pen"
                  onClick={() => setEditTitle({id:el._id, name: 'subsection', title: el.name })}
                ></i>
              )}
              <i
                className="fa-solid fa-trash"
                onClick={() =>
                  dispatch(
                    setConfirmation({
                      text: `Удалить ${el.name} со всем содержимым?`,
                      function: () => deleteComponent(el._id),
                    })
                  )
                }
              ></i>
            </div>
            {editTitle.id === el._id ? (
              <input
                type="text"
                defaultValue={el.name}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            ) : (
              <div>{el.name}</div>
            )}
          </div>
        ))}
        {data && <CreateInfoComponent
          component={"subsection"}
          setUpdating={setUpdating}
          id={data._id}
        />}
      </div>
    )
} 