import { useDispatch, useSelector } from 'react-redux';
import { setPage} from '../redux/navigationSlice';
import { APP_PAGES } from '../constants';
import s from './navigator.module.css'

/* Навигация по страницам (компонентам) приложения. 
При выборе компонента, он записывается в page navigationSlice (redux) */
export default function Navigator () {
  const isAuth = useSelector(state=> state.authReducer.isAuth)
  const dispatch = useDispatch()
 
  return (
    <nav className={s.navBar}>
        <div className={s.title}><a onClick={()=>dispatch(setPage(APP_PAGES.MAIN))}>Calculaizer</a></div>
        <div className={s.navLinks}>
          <div><a onClick={()=>dispatch(setPage(APP_PAGES.ABOUT))}><i className="fa-solid fa-question"></i></a></div>
            <div><a onClick={()=>dispatch(setPage(APP_PAGES.CALC))}><i className="fa-solid fa-calculator"></i></a></div>
            <div>{isAuth ? <a onClick={()=>dispatch(setPage(APP_PAGES.PROFILE))}><i className="fa-solid fa-user"></i></a>:<a onClick={()=>dispatch(setPage(APP_PAGES.AUTH))}><i className="fa-solid fa-right-to-bracket"></i></a>}</div>
        </div>
    </nav>
  )
}
