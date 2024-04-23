import { useDispatch } from 'react-redux'
import s from './errorinfo.module.css'
import { setConfirmation } from '../../../../redux/appSlice'

export default function ErrorInfo ({error, deleteById}) {
const dispatch = useDispatch()
    return (
    <>
    {error.date && <>
    <div className={s.errorinfo}>
        <div className={s.message}>{error.error.message}</div>
        <div>
            <div>{new Date(error.date).toLocaleString()}</div>
            <i className='fa-solid fa-trash' onClick={()=>dispatch(setConfirmation({text: 'Удалить ошибку?', function: deleteById}))}></i>
            
        </div>
        
    </div>
       <div className={s.stack}>{error.error.stack.split('\n').map((str)=> <div key={Math.random()}>{str}</div>)}</div>
       
    </>}
    </>)
}