import s from './spinner.module.css'

export default function Spinner() {
  return (
    <div className={s.loader}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
