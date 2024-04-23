import s from './button.module.css'

export default function Button ({onClick, disabled=false, text, size, warning=false}) {

    return (
        <button className={warning ? `${s.button} ${s[size]} ${s.warning}` :`${s.button} ${s[size]}`} onClick={onClick} disabled={disabled}>{text}</button>
    )
}