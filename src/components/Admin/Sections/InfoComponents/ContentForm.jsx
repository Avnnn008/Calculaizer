import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setNotice } from "../../../../redux/appSlice";
import { useHttp } from "../../../../hooks/http-hook";
import Button from "../../../UI/Button";
import s from './infosection.module.css'
import Dots from "../../../Loaders/Dots";

/* Форма создания или редактирования контента */
export default function ContentForm({initialText, initialImage, getSubsectionInfo, edit, setEdit, id}) {
    const { request, loading } = useHttp();
    const dispatch = useDispatch();
    const [file, setFile] =
    useState(""); /* Загрууженный файл изображения в подразделе */
  const [imageURL, setImageURL] =
    useState(initialImage); /* ссылка на загруженное изображение для предпросмотра */
  const fileReader = new FileReader();
  fileReader.onloadend = () => {
    setImageURL(fileReader.result);
  };
  const [text, setText] =
    useState(initialText); /* Редактирование описания в подразделе */
    const fileRef = useRef();

      /* Загрузка изображения */
  const loadImage = (e) => {
    setFile(e.target.files[0]);
    fileReader.readAsDataURL(e.target.files[0]);
  };

   /* Сброс загруженного файла, изображения для предпросмотра */
   const resetFile = () => {
    fileRef.current.value = null;
    setFile("");
    setImageURL("");
  };

    /* Создание нового контента */
    const newContent = async () => {
       if (text && file) {
         const formData = new FormData();
         formData.append("file", file);
         formData.append("text", text);
         formData.append("sectionId", id);
         try {
           await request("/admin/newcontent", "POST", formData);
           dispatch(setNotice("Создано!"));
           getSubsectionInfo();
           resetFile()
           setText('')
         } catch {}
       }
     };

    const updateContent = async () => {
        const formData = new FormData()
        formData.append('contentId', edit)
        if (file) {
            formData.append('file', file)
        }
       if (text && text!==initialText) {
        formData.append('text', text)
       } 
       try {
        await request("/admin/updatecontent", "POST", formData);
        
        dispatch(setNotice("Обновлено!"));
        getSubsectionInfo()
        
      } catch {}
    }

    return (
      <div className={s.form}>
        <div className={s.input}>
          <div className={s.preview}>
            {imageURL ? (
              <img src={imageURL} alt="" />
            ) : (
              <div className={s.noimage}>
                <i className="fa-solid fa-image"></i>
                <div>No image</div>
              </div>
            )}
          </div>

          <div className={s.textarea}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className={s.formfooter}>
          <div className={s.file}>
            <input
              type="file"
              ref={fileRef}
              accept="image/*,.jpg, .png"
              onChange={(e) => loadImage(e)}
            />
            {imageURL && (
              <i className="fa-solid fa-trash" onClick={resetFile}></i>
            )}
          </div>
          {loading && <Dots dark={true}/>}
          {edit ? (
            <div className={s.formicons}>
              {(file || (text!==initialText && text)) && <i className="fa-solid fa-check" onClick={updateContent}></i>}
              <i className="fa-solid fa-xmark" onClick={()=>setEdit('')}></i>
            </div>
          ) : (
            <Button
              size="small"
              onClick={newContent}
              text={"Создать"}
              disabled={!text || !file}
            />
          )}
        </div>
      </div>
    );
}