import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./adminconsole.module.css";
import Section from "./Sections/Section";
import { useHttp } from "../../hooks/http-hook";
import { setCounts } from "../../redux/adminSlice";

export default function AdminConsole() {
  
  const SECTIONS = {
     "Пользователи": 'users',
    "Инфо раздел": 'infoSection',
    "Ошибки": 'errors',
}

  const [section, setSection] = useState('Пользователи');
  const {request} = useHttp()
  const dispatch = useDispatch()
const count = useSelector(state=> state.adminReducer[SECTIONS[section]+'Count'])

useEffect(()=> {
  if (SECTIONS[section] !== 'infoSection') {
    getCountOfAdminSectionsDocuments()
  }
  
}, [section])

async function getCountOfAdminSectionsDocuments () {
  try {
    const data = await request('/admin/count')
    dispatch(setCounts({usersCount: data.usersCount, errorsCount: data.errorsCount}))

  } catch {}
}

  return (
    <div className={s.consolewindow}>
    <div className={s.console}>
      <div className={s.sections}>
        {Object.keys(SECTIONS).map((el) => (
          <div
            key={el}
            className={el === section ? s.selected : undefined}
            onClick={()=>el!==section && setSection(el)}
          >
            {el}
          </div>
        ))}
      </div>
      {
        <div className={s.block}>
          <div className={s.title}>{`${section} ${SECTIONS[section] !== 'infoSection' ? `(${count})` : ''}`}</div>
          <Section name={SECTIONS[section]} getCountOfAdminSectionsDocuments={getCountOfAdminSectionsDocuments}/>
        </div>
      }
    </div>
    </div>
  );
}
