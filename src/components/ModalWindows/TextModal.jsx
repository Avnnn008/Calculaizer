import { useRef } from 'react';
import m from './modal.module.css';
import s from './textmodal.module.css';
import Button from '../UI/Button';

export default function TextModal ({placeholder, text, title, params, setText, close, condition, onSubmit, submittext}) {
  const modal = useRef(null)
  const closeModal = (e)=> {
    if (e.target === modal.current && (text==='' || params)) {
      close();
    }
  }
    return (
        <div className={m.textmodal} ref={modal} onClick={(e)=>closeModal(e)}>
          <div className={s.review}>
            <div>{title}</div>
            <textarea
              className={s.textarea}
              autoFocus
              onFocus={(e)=>{
                  e.target.setSelectionRange(text.length, text.length)           
              }}
              disabled={params}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
            ></textarea>

            <div>
              <Button onClick={onSubmit} disabled={condition} text={submittext} size={'medium'}/>
              <Button onClick={() => {
                  close()
                  if (setText) {
                    setText("");}
                }} text={'Отмена'} size={'medium'}/>
            </div>
          </div>
        </div>
    )
}