import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./redux/authSlice";
import Navigator from "./components/Navigator";
import Modal from "./components/ModalWindows/Modal";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import { APP_PAGES } from "./constants";

export default function App() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.navReducer.page); // Текущая страница приложения, установленная в store

  /* Проверка, авторизован ли пользователь и не истекло ли время сессии */
  useLayoutEffect(() => {
    if (localStorage.getItem("refresh_expires_in")) {
      if (parseInt(localStorage.getItem("refresh_expires_in")) > Date.now()) {
        dispatch(login());
      } else {
        dispatch(logout());
      }
    }
    localStorage.removeItem(
      "adminAccess"
    ); /* удаление данных администратора, если они есть */
  }, [dispatch]);

  const PAGE_COMPONENT = {
    [APP_PAGES.MAIN]: <MainPage />,
    [APP_PAGES.AUTH]: <AuthPage />,
    [APP_PAGES.PROFILE]: <ProfilePage />,
    [APP_PAGES.ABOUT]: <AboutPage />,
    [APP_PAGES.CALC]: <CalculatorsPage />,
  };

  /* 
Navigator компонент - верхнее меню навигации. 
Выбранный элемент устанавливается в качестве page в navigationSlice (redux) и устанавливается через PAGE_COMPONENT.
*/
  return (
    <>
      <Navigator/>
      <div id="app">
        <Modal />
        {PAGE_COMPONENT[page]}
      </div>
    </>
  );
}
