import React, { useEffect,useRef,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../hooks/debounce";
import { setTextCalc } from "../redux/calcSlice";
import {Link} from 'react-router-dom'
import CreateReport from "./TextCalculator/createReport";
import s from "./textcalc.module.css";
import m from "./UI/input-and-selection-fields.module.css";


export default function TextCalculator() {
  const dispatch = useDispatch();
  const isAuth = useSelector(state=> state.authReducer.isAuth)
  const init = useSelector((state) => state.calcReducer);
  const [inputText, setInputText] = useState(init.textCalc);
  const [ownValue, setOwnValue] =
    useState(""); /* значение, введенное пользователем для подсчета */
  const [isSaving, setIsSaving] = useState(false)
  const linkRef = useRef()

  useEffect(() => {
    dispatch(setTextCalc(inputText));
  }, [inputText]);

  /* Анализ текста */
  const calculateText = () => {
    let text = useDebounce(inputText);

    /* подсчет числа символов */
    let length = text.replaceAll(/\t|\v/g, "").length;

    /* разбиение текста на элементы по пробелу и переносу строки, исключение отдельно стоящих символов */
    let splittedElements = text
      .split(/\n| /)
      .filter((el) => el !== "")
      .filter((el) => /[a-zа-я0-9]/i.test(el));

    /* подсчет количества слов */
    let allWords = splittedElements.length;

    /* подсчет количества слов с буквами разных яыков */
    let difLettersWords = 0;
    splittedElements.forEach((el) => {
      if (/[a-z]+/i.test(el) && /[а-я]+/i.test(el)) {
        difLettersWords++;
      }
    });

    /* подсчет слов, содержащих числа */
    let numberWords = 0;
    splittedElements.forEach((el) => {
      if (/[0-9]+/.test(el)) {
        numberWords++;
      }
    });

    /* подсчет всех пробелов */
    let spaces;
    try {
      spaces = text.match(/ /g).length;
    } catch {
      spaces = 0;
    }

    /* подсчет пробелов, повторенных более 1 раза подряд */
    let doubleSpaces;
    try {
      doubleSpaces = text.match(/ {2,}/g).length;
    } catch {
      doubleSpaces = 0;
    }

    /* подсчет количества абзацев */
    let paragraph;
    try {
      paragraph = text.match(/\n/g).length + 1;
    } catch {
      text === "" ? (paragraph = 0) : (paragraph = 1);
    }

    /* подсчет числа цифр */
    let numbers;
    try {
      numbers = text.match(/[0-9]/g).length;
    } catch {
      numbers = 0;
    }

    /* подсчет числа русских и английских гласных и согласных */
    let vowelsEn = 0;
    let vowelsRu = 0;
    let consonantsEn = 0;
    let consonantsRu = 0;

    text.split("").forEach((el) => {
      if (/[eyuioa]/i.test(el)) {
        vowelsEn++;
      }
    });
    text.split("").forEach((el) => {
      if (/[qwrtpsdfghjklzxcvbnm]/i.test(el)) {
        consonantsEn++;
      }
    });
    text.split("").forEach((el) => {
      if (/[уеыаоэяию]/i.test(el)) {
        vowelsRu++;
      }
    });
    text.split("").forEach((el) => {
      if (/[йцкнгшщзхъфвпрлджчсмтьб]/i.test(el)) {
        consonantsRu++;
      }
    });

    let lettersEn = vowelsEn + consonantsEn;
    let lettersRu = vowelsRu + consonantsRu;

    /* подсчет числа знаков пунктуации и символов */
    let symbols = 0;
    text.split("").forEach((el) => {
      if (/[\!"'{}\[\]№;%\:\?\*\(\)_\+\-\=\\/\,\.`~@#$^&<>]/i.test(el)) {
        symbols++;
      }
    });

    /* подсчет количества введенных пользователем вхождений*/
    const ownCount = () => {
      let expr = new RegExp(`${ownValue}`, "g");
      try {
        return text.match(expr).length;
      } catch {
        return 0;
      }
    };

    const saveResult = () => {
     localStorage.setItem('report', JSON.stringify({text, length, spaces, lettersEn, lettersRu, vowelsEn, vowelsRu, consonantsEn, consonantsRu, numbers, symbols, allWords, numberWords, difLettersWords, paragraph, doubleSpaces, ownValue}))
    linkRef.current.click()
    }

    return (
      <>
        <div className={s.block}>
          <div className={s.total}>
            Всего символов: <span className={s.count}>{length}</span>
          </div>
          <div className={s.totalincludes}>
            <div>
              - пробелов: <span className={s.count}>{spaces}</span>
            </div>
            <div>
              - букв: <span className={s.count}>{lettersEn + lettersRu}</span>
              <div className={s.attachment}>
                <div className={s.line}>
                  <div>
                    - русских: <span className={s.count}>{lettersRu}</span>{" "}
                  </div>
                  <div className={s.attachmentincludes}>
                    (гласных: <span className={s.count}>{vowelsRu}</span>,
                    согласных: <span className={s.count}>{consonantsRu}</span>)
                  </div>
                </div>
                <div className={s.line}>
                  <div>
                    - английских: <span className={s.count}>{lettersEn}</span>{" "}
                  </div>
                  <div className={s.attachmentincludes}>
                    (гласных: <span className={s.count}>{vowelsEn}</span>,
                    согласных: <span className={s.count}>{consonantsEn}</span>)
                  </div>
                </div>
              </div>
            </div>
            <div>
              - цифр: <span className={s.count}>{numbers}</span>
            </div>
            <div>
              - знаков пунктуации и символов:{" "}
              <span className={s.count}>{symbols}</span>
            </div>
            <div>
              - спецсимволов:{" "}
              <span className={s.count}>
                {length - symbols - numbers - lettersEn - lettersRu - spaces}
              </span>
            </div>
          </div>
        </div>
        <div className={s.block}>
          <div className={s.total}>
            Слов: <span className={s.count}>{allWords}</span>
          </div>
          <div className={s.totalincludes}>
            - содержащих цифры: <span className={s.count}>{numberWords}</span>
          </div>
          <div className={s.totalincludes}>
            - с буквами разных языков:{" "}
            <span className={s.count}>{difLettersWords}</span>
          </div>
        </div>
        <div className={s.block}>
          <div className={s.total}>
            Абзацев: <span className={s.count}>{paragraph}</span>
          </div>
        </div>
        <div className={s.block}>
          <div className={s.total}>
            Количество двух и более пробелов подряд:{" "}
            <span className={s.count}>{doubleSpaces}</span>
          </div>
        </div>
        <div className={s.block}>
          <div className={s.total}>
            Количество
            <div className={s.symbolinput}>
              <input
                className={m.input}
                type="text"
                value={ownValue}
                onChange={(e) => setOwnValue(e.target.value)}
                placeholder="символ/слово/фраза"
              />
            </div>
            {ownValue && ":"}
            <span className={s.count}>{ownValue && ownCount()}</span>
          </div>
        </div>
        {isAuth && inputText && <button className={`${s.btn} ${s.save}`} disabled={!inputText}>
        <i className="fa-solid fa-download" onClick={saveResult}></i>
        <Link to={'/textcalcreport'} ref={linkRef} className={s.link} target="_blank"/>
        </button>}
      </>
    );
  };


  return (
    <div className={s.window}>
      <div className={s.userinput}>
        <div className={s.title}>Анализ текста</div>
        <div className={s.textfield}>
          <textarea
          id='textarea'
            className={m.textarea}
            value={inputText}
            placeholder="Вставьте или введите текст..."
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>

        <button className={s.btn} disabled={!inputText}>
          <i
            className="fa-solid fa-trash-can"
            onClick={() => setInputText("")}
          ></i>
        </button>
      </div>
      <div className={s.result}>{calculateText()}</div>
     {/*  {isSaving && <CreateReport values={isSaving} setIsSaving={setIsSaving}/>} */}
    </div>
  );
}
