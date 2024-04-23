import { useState } from 'react'
import s from './createinfocomponent.module.css'
import { useHttp } from '../../../hooks/http-hook'
import { useDispatch } from 'react-redux'
import { setNotice } from '../../../redux/appSlice'
import Dots from '../../Loaders/Dots'

/* Создание нового раздела или подраздела в ззависимости от входного component */
export default function CreateInfoComponent ({component, setUpdating, id}) {
    const [text, setText] = useState('')
    const {request, loading} = useHttp()
    const dispatch = useDispatch()

    const createNewComponent = async () => {
        if (text) {
            try {
            await request(`/admin/new${component}`, 'POST', {text, id})
            dispatch(setNotice(`Создано!`))
            setText('')
            setUpdating(true)

        } catch{}
        }
        
    }
if (loading) {
    return <Dots dark={true}/>
} else {
return (
        <div className={s.newcomponent}>
            <label>Добавить: <input type="text" value={text} onChange={(e)=>setText(e.target.value)}/></label>
            <i className="fa-solid fa-check" onClick={createNewComponent}></i>
        </div>
    )
}

    
}