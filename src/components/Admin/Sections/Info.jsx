import { useHttp } from '../../../hooks/http-hook'
import s from './info.module.css'
import Dots from '../../Loaders/Dots'
import UserInfo from './InfoComponents/UserInfo'
import ErrorInfo from './InfoComponents/ErrorInfo'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCounts } from '../../../redux/adminSlice'
import ChapterInfo from './InfoComponents/ChapterInfo'
import SubsectionInfo from './InfoComponents/SubsectionInfo'

/* name - название секции, info - выбранный элемент для отображения информации (пользователь, ошибка и тп), 
setInfo - состояние отображения/скрытия инфоблока*/
export default function Info ({name, info, setInfo, setUpdating}) {
    const dispatch = useDispatch()
    const {request, loading} = useHttp()
    const [user, setUser] = useState('')
    const [error, setError] = useState('')
    const [infoData, setInfoData] = useState('')

    useEffect(()=> {
        if (name === 'users') {
            setUser(info)
        }
        if (name === 'errors') {
            setError(info)
        }
        if (name==='infoSection') {
            setInfoData(info.data)
          
        }
    })



    const deleteById = async () => {
        try {
            await request(`/admin/delete${name.slice(0,-1)}`, 'POST', {id: info._id})
            const data = await request('/admin/count')
            dispatch(setCounts({usersCount: data.usersCount, errorsCount: data.errorsCount}))
            setUpdating(true)
            
        } catch {}
    }
        

    const CONTENT = {
        'users': <UserInfo user={user} deleteById={deleteById}/>,
        'errors': <ErrorInfo error={error} deleteById={deleteById}/>,
        'infoSection': info.name === 'chapter' 
        ?  <ChapterInfo data={infoData} setUpdating={setUpdating}/> 
        : info.name === 'subsections' 
        ? <SubsectionInfo data={infoData} setUpdating= {setUpdating}/> 
        : <div>Ошибка</div>
    }

    return (
        <div className={s.info}>
          <div className={s.close} onClick={()=> setInfo('')}><i className='fa-solid fa-xmark'></i></div>
          {loading && <div className={s.loading}><Dots dark={true}/></div>}
          {CONTENT[name]}
        </div>
    )
}