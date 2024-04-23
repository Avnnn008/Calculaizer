import s from './mailing.module.css'
import m from '../../UI/input-and-selection-fields.module.css'
import Button from '../../UI/Button'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import TextModal from '../../ModalWindows/TextModal'
import { useHttp } from '../../../hooks/http-hook'
import { setNotice } from '../../../redux/appSlice'
import Dots from '../../Loaders/Dots'

export default function Mailing () {
    const RECIPINTS = {
        'all' :  'всем',
        'old': 'давно не заходившим (60д)',
        'vip': 'VIP пользователям',
        'novip' : 'не VIP пользователям'
    }
    const [recipients, setRecipients] = useState('all')
    const [text, setText] = useState('')
    const [isNewMail, setIsNewMail] = useState(false)
    const dispatch = useDispatch()
    const {request, loading } = useHttp()


    const sendMails = async ()=> {
        try {
          await request('/admin/sendemail', 'POST', {text, recipients}) 
          setText('') 
          setIsNewMail(false)
          dispatch(setNotice('Сообщения отправлены!'))
        } catch {
            dispatch(setNotice('Произошла ошибка'))
        }
        
    }
    return (
        <div className={s.mailing}>
            <div>Рассылка:</div>
                <select className={m.select} defaultValue={'all'} onChange={(e)=>setRecipients(e.target.value)}>
                    {Object.keys(RECIPINTS).map(el=><option value={el} key={el} >{RECIPINTS[el]}</option>)}
                </select>
           
            <Button size={'small'} onClick={()=>setIsNewMail(true)} text={'Написать'}/>
            {isNewMail && <TextModal title={loading? <Dots dark={true}/> : ''} text={text} setText={setText} onSubmit={sendMails} submittext='Отправить' close={()=>setIsNewMail(false)} placeholder='Первый абзац - заголовок. После переноса строки - текст сообщения.'/>}
        </div>
    )
}