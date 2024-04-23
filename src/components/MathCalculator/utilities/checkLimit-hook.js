import { setLimit } from "../../../redux/calcSlice";
import { useDispatch } from "react-redux";

 /* проврка, не превышает ли длина строки установленный лимит.
  Если превышает - принятое состояние setLimit устанавливается в true на 1 секунду и блокирует дальнейший ввод */
export function useCheckLimit() {
    const dispatch = useDispatch()
    const checkLimit = (input)=>{
        if (
            input.length >= 31 
          ) {
            dispatch(setLimit(true));
            setTimeout(() => {
              dispatch(setLimit(false));
            }, 1000);
            return true;
          }
            
          else return false;
    }
    return {checkLimit}
}