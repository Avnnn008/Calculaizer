import { useDispatch, useSelector } from 'react-redux';
import { useHttp } from '../../hooks/http-hook';
import { deleteEvent, saveEvent } from '../../redux/userInfoSlice';
import {setPage, setComponent} from '../../redux/navigationSlice'
import { setNotice } from '../../redux/appSlice';
import s from './notes.module.css'
import { useEffect, useRef } from 'react';


export default function Events () {
const {request} = useHttp()
const dispatch = useDispatch()
const events = useSelector(state=> state.userInfoReducer.events)

useEffect(()=> {
  getEvents()
}, [])

const getEvents = async () => {
try {
  const data = await request('/event/all')
  data.events.forEach(el=> dispatch(saveEvent({id: el._id, date: el.date, text: el.newEvent })))
} catch {}
}

const getDifference = (dateTo) => {
   return (new Date(dateTo).getTime() - new Date().getTime())/3600000  
}

const eventText = (date, text) => {
  let hours = getDifference(date)
    let days = Math.ceil(hours/24)
    const dayWord = (count) => {
      switch (true) {
        case /11$|12$|13$|14$/.test(count):
          return 'дней';
        case /.?1$/.test(count):
          return 'день';
        case /[2-4]$/.test(count):
          return 'дня';
        default:
          return 'дней';
      }
    }
    if (hours >0 && hours<= 24) {
      return `Событие "${text}" будет завтра!`
   }
    else if (hours >24) {
        return `Событие "${text}" наступит через ${days} ${dayWord(days)}! (${new Date(date).toLocaleDateString()})`
     } else if (hours <= 0 && hours> -24) {
        return `${text} сегодня!`
     } else if (hours <= -24 && hours> -48) {
      return `Cобытие "${text}" было вчера!`
   } 
      else {
        return `Событие "${text}" было ${Math.abs(days)} ${dayWord(days)} назад! (${new Date(date).toLocaleDateString()})`
     }
}


const difference = (el) => {
  let hours = getDifference(el)
    let days = Math.ceil(hours/24)
    if (hours > 0 && hours<= 24) {
      return 'завтра'
   }
 else if (hours >24) {
    return `через ${days} д.`
 } else if (hours <= 0 && hours> -24) {
    return 'СЕГОДНЯ'
 } else if (hours <= -24 && hours> -48) {
  return 'вчера'
}
 else {
    return `${Math.abs(days)} д. назад`
 }
}

const deleteEventFromDB = async (key) => {
  try {
    await request(`/event/delete`, "POST", {key});
  } catch{}
}

const deletingEvent = (id) => {
    deleteEventFromDB(id)
    dispatch(deleteEvent(id))
}

const eventColor = (el) => {
let eventTime = getDifference(el)
if (eventTime > 0) {
  return s.upcoming
} else if (eventTime <=0 && eventTime > -24) {
  return s.today
} else return s.past
}

/* элемент одного события */
const drawEvents = (el) => {
  
  return (
    <div className={`${s.event} ${eventColor(el.date)}`} key={el.id}>
                  <div className={s.info} onClick={() => dispatch(setNotice(eventText(el.date, el.text)))}>
                  <div className={s.name}>
                    {el.text}
                  </div>
                  <div className={s.date}>
                    {new Date(el.date).toLocaleDateString()}
                  </div>
                  
                  <div className={s.difference}>
                    {difference(el.date)}
                  </div>
                  </div>
                  <div className={s.delete}>
                    <i onClick={()=>deletingEvent(el.id)} className="fa-solid fa-trash"></i>
                  </div>
                </div>
  )
}

/* Отрисовка сначала событий сегодняшнего дня, затем всех остальных */
const eventsList = () => {
  return (
    <>
    {events.filter(el=>(getDifference(el.date) <=0 && getDifference(el.date) > -24)).map(el=>drawEvents(el))}
    {events.filter(el=>(getDifference(el.date) >0)).sort((a, b) => new Date(a.date) - new Date(b.date)).map(el=>drawEvents(el))}
    {events.filter(el=>(getDifference(el.date) <= -24)).map(el=>drawEvents(el))}
    </>
  ) 
}



  return (
    <div className={s.eventsblock}>
    <div className={s.head}>
      <div className={s.title}>{`События (${events.length})`}</div>
      <div className={s.add} onClick={() => {
        dispatch(setPage('calc'))
        dispatch(setComponent('datecalc'))
      }}>
          <i className="fa-solid fa-plus"></i> Новое событие
        </div>
    </div>
    <div className={s.eventlist}>
      {
        events.length> 0 ? eventsList()
          : <div className={s.noevents}>Нет прошедших и предстоящих событий</div>
                }
    </div>
  </div>
  )
}