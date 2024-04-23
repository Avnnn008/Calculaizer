import { useEffect, useRef } from "react";
import { useHttp } from "../hooks/http-hook";
import BlockComponent from "../components/AboutPage/BlockComponent";
import s from "./aboutpage.module.css";
import Spinner from "../components/Loaders/Spinner";


/* Страница с информацией о приложении.
Возвращает BlockComponentы - первый уровень (заголовки разделов), полученные в CHAPTERS.current с сервера */
export default function AboutPage() {
  const CHAPTERS = useRef({})
  const {request, loading} = useHttp()

useEffect(()=> {
  getAppInfo()
}, [])

async function getAppInfo() {
  try {
    let data = await request('/appinfo')
    CHAPTERS.current = data.data
  } catch {}
  
}

  return (
    <div className={s.window}>
      {loading ? <Spinner/> : (CHAPTERS.current && Object.values(CHAPTERS.current).map(chapter=> (
            <BlockComponent name={chapter.name} key={chapter._id} subsections={chapter.subsections}/>
        )))}
        
    </div>
  );
}
