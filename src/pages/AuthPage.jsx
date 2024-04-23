import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHttp } from "../hooks/http-hook";
import { login } from "../redux/authSlice";
import { setPage } from "../redux/navigationSlice";
import { setNotice } from "../redux/appSlice";
import { APP_PAGES } from "../constants";
import Spinner from "../components/Loaders/Spinner";
import Button from "../components/UI/Button";
import Password from "../components/UI/Password";
import s from "./authpage.module.css";

/* Страница авторизации и регистрации пользователя */
export default function AuthPage() {
  const { loading, request } = useHttp();
  const [registration, setRegistration] =
    useState(false); /*вид: false - вход в систему, true - регистрация */
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [repeatedRequest, setRepeatedRequest] =
    useState(false); /* ограничитель повторных ззапросов кода при регистрации */
  const [warning, setWarning] =
    useState(""); /*если не пустое - вывод предупреждения */
  const [timer, setTimer] =
    useState(0); /* для отсчета времени до повторного запроса */
  const dispatch = useDispatch();

  // Тексты предупреждений
  const WARNINGS = {
    NAME: "Имя должно состоять только из букв без пробелов!",
    EMAIL: "Некорректный формат email",
    PASSWORD: "Минимальная длина пароля - 6 символов",
    CODE: "Некорректный код",
    RECOVERY: "Введите email, использованный при регистрации",
    NULL: "",
  };

  // ----------------------------------------------------------------------------------------------------------
  // ФУНКЦИИ ОБРАЩЕНИЯ К API
  // ----------------------------------------------------------------------------------------------------------
  
  // Регистрация
  const registerHandler = async () => {
    await request("/auth/register", "POST", { email, password, name, code });
    dispatch(setNotice("Регистрация прошла успешно! Теперь Вы можете войти!"));
    changeField();
  };

  // Авторизация
  const loginHandler = async () => {
    const data = await request("/auth/login", "POST", {
      email,
      password,
    });
    dispatch(login()); /* установка состояния авторизации в redux */
    dispatch(setPage(APP_PAGES.PROFILE)); /* переход на страницу профиля */
    localStorage.setItem(
      "refresh_expires_in",
      data.refresh_expires_in
    ); /* Время окончания жизни refresh token */
    localStorage.setItem(
      "access_expires_in",
      data.access_expires_in
    ); /* Время окончания жизни access token */
  };

  // Восстановление пароля
  const recoveryPassword = async () => {
    if (!email) {
      setWarning(WARNINGS.RECOVERY);
    } else if (!checkEmail()) {
      setWarning(WARNINGS.EMAIL);
    } else {
      await request("/auth/recovery", "POST", { email });
      dispatch(
        setNotice(
          'Новый пароль отправлен на Вашу почту! Запросить пароль повторно можно через 90 секунд. Если письмо не приходит, проверьте папку "спам".'
        )
      );
      disableBtn();
    }
  };

  // Запрос на получение кода на email
  const getCode = async () => {
    if (checkEmail()) {
      await request("/auth/confirm", "POST", { email });
      dispatch(
        setNotice(
          'Код отправлен на Ваш email! Запросить код повторно можно через 90 секунд. Если письмо не приходит, проверьте папку "спам".'
        )
      );
      disableBtn();
    } else {
      setWarning("Введите корректный email!");
    }
  };


  // ----------------------------------------------------------------------------------------------------------
  /* Установки состояний при корректном вводе email, пароля, имени и кода */
  // ----------------------------------------------------------------------------------------------------------
  const emailInput = (e) => {
    setEmail(e.target.value);
    if (warning === WARNINGS.EMAIL || WARNINGS.RECOVERY) {
      setWarning(WARNINGS.NULL);
    }
  };
  const passwordInput = (e) => {
    setPassword(e.target.value);
    if (warning === WARNINGS.PASSWORD) {
      setWarning(WARNINGS.NULL);
    }
  };
  const nameInput = (e) => {
    setName(e.target.value);
    if (warning === WARNINGS.NAME) {
      setWarning(WARNINGS.NULL);
    }
  };
  const codeInput = (e) => {
    setCode(e.target.value);
    if (warning === WARNINGS.CODE) {
      setWarning(WARNINGS.NULL);
    }
  };

  // ----------------------------------------------------------------------------------------------------------
  /* Проверки корректности ввода  email, пароля, имени и кода*/
  // ----------------------------------------------------------------------------------------------------------
  const checkEmail = () => {
    if (/\w+@\w+\.\w+/.test(email)) return true;
    else return false;
  };
  const checkPassword = () => {
    if (password.length >= 6) return true;
    else return false;
  };
  const checkName = () => {
    if (/^[а-яa-z]+$/i.test(name)) return true;
    else return false;
  };
  const checkCode = () => {
    if (/^[0-9]+$/.test(code)) return true;
    else return false;
  };

  /* Проверка корректоности всех введенных данных.
  Если все корректно - return true, если нет - вывод предупреждения и return false */
  const checkData = () => {
    if (!checkEmail()) {
      setWarning(WARNINGS.EMAIL);
      return false;
    } else if (!checkPassword()) {
      setWarning(WARNINGS.PASSWORD);
      return false;
    } else if (registration && !checkName()) {
      setWarning(WARNINGS.NAME);
      return false;
    } else if (registration && !checkCode()) {
      setWarning(WARNINGS.CODE);
      return false;
    } else return true;
  };



  /* Переключение между регистрацией и авторизацией, сброс предупреждений */
  const changeField = () => {
    setRegistration((prev) => !prev);
    setWarning(WARNINGS.NULL);
  };

  /* Выполнение функции регистрации или авторизации в зависимости от состояния registration, если все данные введены корректно */
  const submitForm = (e) => {
    e.preventDefault();
    if (checkData()) {
      registration ? registerHandler() : loginHandler();
    }
  };

  /* Делает кнопку повторной отправки запроса недоступной на 90 секунд.
  Отсчет времени до повторного запроса и установка его в состояние timer */
  const disableBtn = () => {
    setRepeatedRequest(true);
    setTimer(90);
    let interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      setRepeatedRequest(false);
      clearInterval(interval);
      setTimer(0);
    }, 91000);
  };

  /* Представление времени до повторного запроса в формате мм:сс */
  const minSec = () => {
    let min = Math.floor(timer / 60);
    let sec = timer - min * 60;
    if (sec >= 10) {
      return `0${min}:${sec}`;
    } else {
      return `0${min}:0${sec}`;
    }
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className={s.window}>
        <div className={s.field}>
          <div className={s.title}>{registration ? "Регистрация" : "Вход"}</div>
          <form className={s.form} onSubmit={submitForm}>
            <label className={s.label}>
              Введите email:
              <input
                type="email"
                value={email}
                onChange={emailInput}
                className={
                  warning === WARNINGS.EMAIL
                    ? `${s.input} ${s.warning}`
                    : s.input
                }
              />
            </label>
            {registration && (
              <label className={s.label}>
                Введите Ваше имя:
                <input
                  type="text"
                  value={name}
                  onChange={nameInput}
                  className={
                    warning === WARNINGS.NAME
                      ? `${s.input} ${s.warning}`
                      : s.input
                  }
                />
              </label>
            )}
            {registration && (
              <>
                <label className={s.label}>
                  Подтвердите email:
                  <div className={s.confirm}>
                    <input
                      type="text"
                      maxLength={6}
                      value={code}
                      placeholder="Код из email"
                      onChange={codeInput}
                      className={
                        warning === WARNINGS.CODE
                          ? `${s.input} ${s.warning}`
                          : s.input
                      }
                    />
                    <Button
                      onClick={getCode}
                      disabled={repeatedRequest}
                      text={repeatedRequest ? minSec() : "Получить код"}
                      size={"small"}
                    />
                  </div>
                </label>
              </>
            )}
            <Password
              label={registration ? "Придумайте пароль:" : "Введите пароль:"}
              value={password}
              onChange={passwordInput}
              warning={warning === WARNINGS.PASSWORD}
            />
            <div className={s.hint}>{warning}</div>
            <Button
              type="submit"
              disabled={loading}
              text={registration ? "Зарегистрироваться" : "Войти"}
              size={"medium"}
            />
            {!registration && (
              <div className={s.recovery}>
                <p onClick={recoveryPassword} disabled={repeatedRequest}>
                  {repeatedRequest ? "" : "Не помню пароль"}
                </p>
              </div>
            )}
          </form>
          <div
            className={registration ? `${s.footer} ${s.regfooter}` : s.footer}
          >
            <p>{registration ? "Уже есть аккаунт?" : "Нет аккаунта?"}</p>
            <p className={s.link} onClick={changeField}>
              {registration ? "Войти" : "Зарегистрироваться"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
