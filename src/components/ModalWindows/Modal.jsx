import { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resetModal } from "../../redux/appSlice"
import s from './modal.module.css'
import Button from "../UI/Button"

export default function Modal ()  {
    const {notice, confirmation} = useSelector(state=> ({
        notice : state.appReducer.notice,
        confirmation: state.appReducer.confirmation
    }))
    const dispatch = useDispatch()
    const modal = useRef(null)
    const imgfield = useRef(null)
    const closeModal = (e) => {
        if (e.target === modal.current || e.target === imgfield.current) {
            dispatch(resetModal())
        }
    }
    
        return (
        <div ref={modal} className={(notice || confirmation.text) ? s.modal :s.hide} onClick={(e)=>closeModal(e)}>
            {notice.indexOf('https')!==-1 ? 
            <div ref={imgfield} className={s.largeimage}>
                <img src={notice} alt={notice} />
               { <div className={s.closeimage} onClick={() => dispatch(resetModal())}>
            <i className="fa-solid fa-xmark"></i>
          </div>}
           </div>
            :
            <div className={s.window}>
            <div className={s.text}>{notice || confirmation.text}</div>
            {notice && <Button onClick={()=>dispatch(resetModal())} text={'OK'} size={'medium'}/>}
            {confirmation.text && 
            <div className={s.btns}>
              <Button onClick={()=>{
                confirmation.function()
                dispatch(resetModal())}} text={'Да'} size={'medium'}/>  
            <Button onClick={()=>dispatch(resetModal())} text={'Нет'} size={'medium'}/>
            </div>
            }
            
        </div>
        }
        
        </div>
    )
   
    
}