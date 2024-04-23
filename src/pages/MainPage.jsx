import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotice } from "../redux/appSlice";
import { setPage } from "../redux/navigationSlice";
import { useHttp } from "../hooks/http-hook";
import TextModal from "../components/ModalWindows/TextModal";
import Button from "../components/UI/Button";
import Dots from "../components/Loaders/Dots";
import s from "./mainpage.module.css";
import { APP_PAGES } from "../constants";

/* Главная страница приложения */
export default function MainPage() {
  const isAuth = useSelector(
    (state) => state.authReducer.isAuth
  ); /* информация авторизован пользователь или нет */
  const [review, setReview] = useState(""); /* текст отзыва */
  const [isReview, setIsReview] =
    useState(false); /* true - открытие компоннта для написания отзыва */
  const { request, loading } = useHttp();
  const dispatch = useDispatch();
  const updating = useSelector((state) => state.navReducer.updating);
  const [update, setUpdate] = useState(true);

  /* Для повтора анимации при повторном обновлении компонента */
  useEffect(() => {
    if (updating) {
      setUpdate(false);
      setTimeout(() => setUpdate(true), 10);
    }
  }, [updating]);

  /* Отправка отзыва */
  const sendReview = async (e) => {
    e.preventDefault();
    try {
      await request("/review", "POST", { review });
      setIsReview(false);
      dispatch(setNotice("Спасибо! Нам важно Ваше мнение!"));
    } catch (e) {
      setIsReview(false);
      dispatch(setNotice("Что-то пошло не так... Попробуйте снова!"));
    }
  };

  return (
    <div className={s.window}>
      {update && (
        <div className={s.field}>
          <div className={s.hello}>Привет!</div>
          <div className={s.title}>
            Это приложение <span className={s.name}>CALCULAIZER!</span>
          </div>
          <div className={s.about}>
            <div>Пока мы только начали развиваться.</div>
            <div>
              Совсем скоро здесь будут собраны калькуляторы и не только на
              разные случаи жизни.
            </div>
            <div className={s.info} onClick={() => dispatch(setPage(APP_PAGES.ABOUT))}>
              Узнайте больше!
            </div>
          </div>
          {/* Для авторизованных польователей - кнопка для оставления отзыва, 
      для неавторизованных - кнопка для перенаправления на страницуу авторизации */}
          <div className={s.buttons}>
            {isAuth ? (
              <Button
                onClick={() => {
                  setIsReview(true);
                  setReview("");
                }}
                text={"Помогите нам стать лучше!"}
                size={"large"}
              />
            ) : (
              <Button
                onClick={() => dispatch(setPage(APP_PAGES.AUTH))}
                text={"Присоединяйтесь к нам!"}
                size={"large"}
              />
            )}
          </div>
        </div>
      )}
      {/* Компонент отзыва */}
      {isReview && (
        <TextModal
          placeholder="Напишите здесь отзыв, пожелания или предложения. Пожалуйста, сообщите, если у Вас возникли какие-либо ошибки! Минимальная длина сообщения - 5 символов."
          title={loading ? <Dots dark={true} /> : "Поделитесь Вашим мнением!"}
          text={review}
          setText={setReview}
          close={()=>setIsReview(false)}
          condition={review.length < 5 || loading}
          onSubmit={sendReview}
          submittext="Отправить"
        />
      )}
    </div>
  );
}
