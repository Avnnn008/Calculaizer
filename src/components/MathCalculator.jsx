import { useSelector } from "react-redux";
import Calculator from "./MathCalculator/Calculator";
import History from "./MathCalculator/History";

/* Математический калькулятор.
Компонент калькулятора и для авторизованных пользователей истории. */
export default function MathCalculator() {
  const isAuth = useSelector(state=> state.authReducer.isAuth)
  return (
        <div id="math-calculator">
          <Calculator />
          {isAuth && <History />} {/* История доступна авторизованным пользователям */}
        </div>
   
  );
}
