import {useEffect, useRef, useState } from "react";
import s from "./blockcomponent.module.css";
import { useDispatch } from "react-redux";
import {setNotice} from '../../redux/appSlice'
import { useHttp } from "../../hooks/http-hook";
import Spinner from "../Loaders/Spinner";

/* Возвращает контент для конкретного подраздела: 
name - имя подраздела*/

export default function ItemComponent({name, id}) {
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch()
  const {request, loading} = useHttp()
  const content = useRef()

  useEffect(()=> {
    showMore && getContent()
  }, [showMore])

  const getContent = async () => {
    try {
      const data = await request(`/content?id=${id}`)
      content.current = data.content
    } catch {}
  }

  return (
    <div className={s.item}>
      <div className={s.title} onClick={() => setShowMore((prev) => prev ? false : id)}>
        <div>{name}</div>
        {
          <i
            className={
              showMore ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down"
            }
          ></i>
        }
      </div>
      {showMore && 
      <div className={s.infoblock}>
        {loading ? <Spinner/> : content.current &&
        Object.values(content.current).map((el) => (
          <div className={s.info} key={Math.random()}>
             <div className={s.image}>
               <img
                onClick={(e) => dispatch(setNotice(e.target.src))} /* выводится модальное окно с увеличенным изображением */
                src={el.img}
                alt="Не удалось загрузить изображение :("
              />
            </div>
            <div className={s.text}>
              {el.description.map((paragraph) => (
                <div key={Math.random()}>{paragraph}</div>
              ))}
            </div>
          </div>
        ))}
        </div>
        }
    </div>
  );
}
