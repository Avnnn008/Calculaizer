import s from './dots.module.css'

export default function Dots (props) {
    return (
        <div className={props.dark ? `${s.dots} ${s.dark}` : s.dots} ><div></div><div></div><div></div></div>
    )
}