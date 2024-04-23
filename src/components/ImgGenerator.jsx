import { useState, useRef, useEffect } from "react";
import { useHttp } from "../hooks/http-hook";
import { useDispatch } from "react-redux";
import { setNotice } from "../redux/appSlice";
import Gallery from "./ImgGenerator/Gallery";
import s from "./imggenerator.module.css";
import m from "./UI/input-and-selection-fields.module.css";
import Spinner from "./Loaders/Spinner";
import Dots from "./Loaders/Dots";

/* Генератор изображений */
export default function ImgGenerator() {
  const LOADING_STATUSES = {
    waiting: "0",
    process: "1",
    ready: "2",
  };
  const [isError, setIsError] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(LOADING_STATUSES.waiting);
  const [generation, setGeneration] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const dispatch = useDispatch();
  const imgUrl = useRef([]);
  const { loading, request } = useHttp();
  const [limit, setLimit] = useState();
  const [currentAI, setCurrentAI] = useState({});

  useEffect(() => {
    getUserLimitAndCurrentAI();
  }, []);

  /* Получение лимита запросов для пользователя*/
  const getUserLimitAndCurrentAI = async () => {
    try {
      const currentAiData = await request("/imggen/currentai");
      setCurrentAI({ ...currentAiData.currentAi });
      const data = await request("/imggen/limit");
      setLimit({ points: data.points, time: data.time });
    } catch {}
  };

  /* генерация изображения с сервера */
  const getImage = async (e) => {
    e.preventDefault();
    setLoadingStatus(LOADING_STATUSES.waiting);

    /* получение описания из текстового поля формы */
    const prompt = new FormData(e.target).get("prompt").replaceAll("/n", "");
    if (!prompt) {
      dispatch(setNotice("Вы не ввели описание картинки!"));
    } else {
      const size = new FormData(e.target).get("size");
      if (!size) {
        dispatch(setNotice("Выберите размер картинки!"));
      } else {
        setGeneration(true);
        try {
          const data = await request("/imggen/generateimg", "POST", {
            prompt,
            size,
          });
          imgUrl.current = data.message;
          await getUserLimitAndCurrentAI();
          setGeneration(false);
        } catch {
          setGeneration(false);
        }
      }
    }
  };

  /* Сохранение изображения в галерею */
  const saveToGallery = async () => {
    let url = imgUrl.current[0];
    let name = imgUrl.current[1];
    let size = imgUrl.current[2];
    setShowGallery(false);
    try {
      setLoadingStatus(LOADING_STATUSES.process);
      await request("/imggen/save", "POST", { url, name, size });
      setLoadingStatus(LOADING_STATUSES.ready);
    } catch {
      setLoadingStatus(LOADING_STATUSES.waiting);
    }
  };

  return (
    <div className={s.generator}>
      <div className={s.window}>
        <div className={s.title}>
          <div className={s.maintitle}>Генератор картинок</div>
          <div className={s.ai}>
            <a href={currentAI?.link} target="_blank">
              {currentAI?.name}
            </a>
          </div>
          <div className={s.notice}>
            {" "}
            Запрещено создавать контент, содержащий насилие, материалы для
            взрослых или политические материалы.
            <div>
              Подробнее:{" "}
              <a href={currentAI?.policy} target="_blank">
                {currentAI?.policy}
              </a>
            </div>
          </div>
        </div>
        <div className={s.input}>
          <form onSubmit={(e) => getImage(e)}>
            <div className={s.fields}>
              <div className={s.textfield}>
                <textarea
                  className={m.textarea}
                  placeholder="Введите описание (до 500 символов)"
                  name="prompt"
                  maxLength={500}
                ></textarea>
              </div>
              <select className={m.select} name="size" defaultValue="0">
                <option value="0" disabled={true}>
                  Размер
                </option>
                <option value="256x256">256x256</option>
                <option value="512x512">512x512</option>
                <option value="1024x1024">1024x1024</option>
              </select>
            </div>
            <button disabled={generation}>Сгенерировать</button>
          </form>
        </div>
        <div className={s.limit}>
          {!generation &&
            !loading &&
            (limit ? (
              <>
                <div>
                  Осталось запросов: <span>{limit.points}</span>
                </div>
                <div>
                  Обновление лимита: <span>{limit.time}</span>
                </div>
              </>
            ) : (
              <div>Не удалось получить данные о доступном лимите запросов</div>
            ))}
        </div>
        {
          <div className={s.output}>
            {/* при обработке запроса - картинка загрузки,
            при полученной картинке - эта картинка,
            при отсутствии описания - текст */}
            {generation ? (
              <div className={s.loading}>
                <Spinner />
              </div>
            ) : imgUrl.current[0] ? (
              <div className={s.image}>
                <a href={imgUrl.current[0]} target="_blank">
                  <img
                    src={imgUrl.current[0]}
                    alt={imgUrl.current[0]}
                    onError={() => setIsError(true)}
                    onLoad={() => setIsError(false)}
                  />
                </a>
                {!isError && (
                  <>
                    {loadingStatus === LOADING_STATUSES.waiting && (
                      <div className={s.save} onClick={saveToGallery}>
                        Сохранить в галерею
                      </div>
                    )}
                    {loadingStatus === LOADING_STATUSES.process && (
                      <div className={s.process}>
                        <Dots />
                      </div>
                    )}
                    {loadingStatus === LOADING_STATUSES.ready && (
                      <div className={s.ready}>Сохранено!</div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className={s.info}>Тут будет Ваша картинка!</div>
            )}
          </div>
        }
        {limit && (
          <div
            className={s.galleryBtn}
            onClick={() => setShowGallery((prev) => !prev)}
          >
            <div>{showGallery ? "Скрыть" : "Галерея"}</div>
          </div>
        )}
        {showGallery && <Gallery />}
      </div>
    </div>
  );
}
