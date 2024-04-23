import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ItemComponent from "./ItemComponent";
import s from "./blockcomponent.module.css";

/* Компонент - первый уровень (разделы).
name: заголовок раздела, 
subsections - массив объектов с подразделами
При showMore = true показываются компоненты подразделов (ItemComponent) */

export default function BlockComponent({name, subsections}) {
  const updating = useSelector((state) => state.navReducer.updating);
  const [showMore, setShowMore] = useState(false);
  
  /* Сворачивание всех Block-компонентов при открытии и перезагрузке AboutPage */
  useEffect(() => {
    showMore && setShowMore(false);
  }, [updating]);

  return (
    <div className={s.block}>
      <div className={s.head} onClick={() => setShowMore((prev) => !prev)}>
        <div className={s.blockname}>{name}</div>
        {
          <i
            className={
              showMore ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down"
            }
          ></i>
        }
      </div>
      {showMore &&
        Object.values(subsections).sort((a,b)=>a.order-b.order).map((item) => (
          <ItemComponent name={item.name} key={item._id} id={item._id}/>
        ))}
    </div>
  );
}
