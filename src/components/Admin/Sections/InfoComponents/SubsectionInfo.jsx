import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setConfirmation, setNotice } from "../../../../redux/appSlice";
import { useHttp } from "../../../../hooks/http-hook";
import ContentForm from "./ContentForm";
import s from "./infosection.module.css";
import Dots from "../../../Loaders/Dots";

export default function SubsectionInfo({ data, setUpdating }) {
  const dispatch = useDispatch();
  const { request, loading } = useHttp();
  const [edit, setEdit] = useState("");
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (data._id && !data.subsections) {
      getSubsectionInfo();
    }
  }, [data]);

  /* Отмена редактирования или создания контента, загрузка данных контента */
  const getSubsectionInfo = async () => {
    setEdit("");
    try {
      const contentData = await request(`/admin/content?id=${data._id}`);
      setContent(contentData.content);
    } catch {}
  };

  /* Удаление абзаца контента */
  const deleteContent = async (id) => {
    try {
      await request(`/admin/deletecontent?id=${id}`);
      dispatch(setNotice("Удалено!"));
      getSubsectionInfo();
    } catch {}
  };


  return (
    <div className={s.infosection}>
      <div className={s.line}>
        <div className={s.title}>{data.name}</div>
      </div>
      {loading ? (
        <div className={s.loading}>
          <Dots dark={true} />
        </div>
      ) : (
        content &&
        content
          .sort((a, b) => a.order - b.order)
          .map((el) =>
            edit !== el._id ? (
              <div className={s.contentline} key={el._id}>
                <div className={s.image}>
                  <a href={el.img} target="_blank">
                    <img src={el.img} alt="" />
                  </a>
                </div>
                <div className={s.description}>
                  {el.description.map((paragraph) => (
                    <div key={Math.random()}>{paragraph}</div>
                  ))}
                </div>
                <div className={s.icons}>
                  <i
                    className="fa-solid fa-pen"
                    onClick={() => setEdit(el._id)}
                  ></i>
                  <i
                    className="fa-solid fa-trash"
                    onClick={() =>
                      dispatch(
                        setConfirmation({
                          text: "Удалить контент?",
                          function: () => deleteContent(el._id),
                        })
                      )
                    }
                  ></i>
                </div>
              </div>
            ) : (
              <ContentForm initialImage={el.img} initialText={`${el.description.join("\n")}`} edit={edit} setEdit={setEdit} key={el._id} getSubsectionInfo={getSubsectionInfo}/>
            )
          )
      )}
      {!edit && <ContentForm initialImage={''} initialText={''} getSubsectionInfo={getSubsectionInfo} edit={edit} id={data._id}/>}
    </div>
  );
}
