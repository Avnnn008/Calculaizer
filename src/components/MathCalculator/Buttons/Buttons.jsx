
import AC_BTN from './Ac'
import CANCEL_BTN from './Cancel';
import DIGIT_BTN from './Digit'
import DOT_BTN from './Dot'
import EQUAL_BTN from "./Equal";
import OPERATORS_BTN from './Operators'
import ZERO_BTN from "./Zero";
import s from '../buttons.module.css'

/* Вывод компонентов с основными кнопками калькулятора */
export default function Buttons({buttons}) {

  return (
    <div ref={buttons} className={s.buttons}>
      <AC_BTN />
      <CANCEL_BTN/>
      <DIGIT_BTN />
      <ZERO_BTN />
      <EQUAL_BTN />
      <OPERATORS_BTN />
      <DOT_BTN />
    </div>
  );
}
