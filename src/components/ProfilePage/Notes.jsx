import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http-hook";
import { saveNote, deleteNote, updateNote, setNotesCount } from "../../redux/userInfoSlice";
import TextModal from "../ModalWindows/TextModal";
import { setNotice } from "../../redux/appSlice";
import { useInView } from 'react-intersection-observer';
import s from "./notes.module.css";
import Dots from "../Loaders/Dots";


export default function Notes() {
  const [isNewNote, setIsNewNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isViewNote, setIsViewNote] = useState(false);
  const [isEditNote, setIsEditNote] = useState(false);
  const [changingNote, setChangingNote] = useState("");
  const { request, loading } = useHttp();
  const notes = useSelector((state) => state.userInfoReducer.notes);
  const notesCount = useSelector((state) => state.userInfoReducer.notesCount);
  const dispatch = useDispatch();
  const limit = 20
  const skip = useRef(null)

  useEffect(()=> {
    getNotes()
  }, [skip.current])


  const { ref, inView} = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) {
        skip.current = notes.length
      }
    }
  });

  const getNotes = async () => {
    if (skip.current !== notesCount) {
      try {
      const data = await request(`/note/all?limit=${limit}&skip=${skip.current? skip.current : 0}`)
      data.notes.forEach((el) =>
      dispatch(saveNote({date: el.date, text: el.text })))

    } catch {}
    }
    
  }

  const savingNote = async () => {
    let date = `${new Date()}`;
    let text = newNote.trim();
    try {
      await request("/note/new", "POST", { date, text });
      dispatch(saveNote({ date, text: newNote.trim() }));
      dispatch(setNotesCount(1))
      setIsNewNote((prev) => !prev);
      setNewNote("");
    } catch {
      dispatch(setNotice("Упс! Что-то пошло не так... Попробуйте снова!"));
    }
  };


  const deletingNote = async (e) => {
    let key = e.target.parentNode.dataset.key;
    try {
      await request(`/note/delete`, "POST", { key });
      dispatch(deleteNote(`${key}`));
      dispatch(setNotesCount(-1))
    } catch {}
      
  };

  const editNote = async () => {
    if (isViewNote[1] !== changingNote.trim()) {
      try {
        await request("/note/update", "POST", {
          date: isViewNote[0],
          text: changingNote.trim(),
        });
        dispatch(
          updateNote({ date: isViewNote[0], text: changingNote.trim() })
        );
        setIsViewNote(false);
        setIsEditNote(false);
      } catch {
        dispatch(setNotice("Упс! Что-то пошло не так... Попробуйте снова!"));
      }
    } else {
      setIsViewNote(false);
      setIsEditNote(false);
    }
  };

  const drawNotes = (el, index) => {
    return (
      <div className={s.note} key={el.date} ref={index === (notes.length-2) ? ref : undefined }>
        <div
          className={s.info}
          onClick={() => setIsViewNote([el.date, el.text])}
        >
          <div className={s.name}>{el.text}</div>
          <div className={s.date}>{new Date(el.date).toLocaleDateString()}</div>
        </div>
        <div className={s.delete} data-key={el.date}>
          <i onClick={deletingNote} className="fa-solid fa-trash"></i>
        </div>
      </div>
    );
  };

  return (
    <div className={s.notesblock}>
      <div className={s.head}>
        <div className={s.title}>{`Заметки (${notesCount})`}</div>
        {loading && <div className={s.loading}><Dots dark={true}/></div>}
        <div className={s.add} onClick={() => setIsNewNote((prev) => !prev)}>
          <i className="fa-solid fa-plus"></i> Новая заметка
        </div>
      </div>
      <div className={s.notelist}>
        {notesCount > 0 ? (
          notes.map((el, index) => drawNotes(el, index))
        ) : (
          <div className={s.nonotes}>Заметок пока нет</div>
        )}
      </div>
      {isNewNote && (
        <TextModal
          placeholder="Введите текст заметки."
          title={loading ? <Dots dark={true} /> : "Новая заметка"}
          text={newNote}
          condition={newNote.length < 1 || loading}
          setText={setNewNote}
          close={()=>setIsNewNote(false)}
          onSubmit={savingNote}
          submittext="Сохранить"
        />
      )}
      {isViewNote && !isEditNote && (
        <TextModal
          title={new Date(isViewNote[0]).toLocaleDateString()}
          text={isViewNote[1]}
          close={()=>setIsViewNote(false)}
          params={true}
          onSubmit={() => {
            setIsEditNote(true);
            setChangingNote(isViewNote[1]);
          }}
          submittext="Изменить"
        />
      )}
      {isViewNote && isEditNote && (
        <TextModal
          title={loading ? <Dots dark={true} /> : "Редактирование заметки"}
          text={changingNote}
          setText={setChangingNote}
          close={()=>{
            setIsEditNote(false)
            setIsNewNote(false)}}
          onSubmit={editNote}
          conditional={changingNote.length < 1 || loading}
          submittext="Сохранить"
        />
      )}
    </div>
  );
}
