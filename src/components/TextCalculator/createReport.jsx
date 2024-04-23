import { useEffect, useRef } from "react";
import s from "./reportStyle.module.css";
import generatePDF, { Margin } from "react-to-pdf";
import { Navigate } from "react-router-dom";

export default function CreateReport() {
  const targetRef = useRef();

  const values = JSON.parse(localStorage.getItem('report'))
  if (!values) {
    return <Navigate to={'/'}/>
  }
  const {
    text,
    length,
    spaces,
    lettersEn,
    lettersRu,
    vowelsEn,
    vowelsRu,
    consonantsEn,
    consonantsRu,
    numbers,
    symbols,
    allWords,
    numberWords,
    difLettersWords,
    paragraph,
    doubleSpaces,
    ownValue,
  } = values;

  useEffect(() => {
    generatePDF(targetRef, {
      filename: "report.pdf",
      page: { margin: Margin.LARGE },
      method: "save",
    });
    localStorage.removeItem('report')
  }, []);

  return (
    <div className={values ? s.file : `${s.file} ${s.hide}`} ref={targetRef}>
      <div className={s.title}>CALCULAIZER - калькулятор по тексту</div>
      <div className={s.input}>
        <div className={s.texttitle}>Исходный текст:</div>
        <div className={s.text}>{text}</div>
      </div>
      <div>
        <div className={s.outputtitle}>ОТЧЕТ</div>
        <div className={s.report}>
          <div className={s.block}>
            <div>
              Всего символов: <span>{length}</span>
            </div>
            <div className={s.totalincludes}>
              <div>
                - пробелов: <span>{spaces}</span>
              </div>
              <div>
                - букв: <span>{lettersEn + lettersRu}</span>
                <div className={s.attachment}>
                  <div className={s.line}>
                    <div>
                      - русских: <span>{lettersRu}</span>
                    </div>
                    <div>
                      (гласных: <span>{vowelsRu}</span>, согласных:{" "}
                      <span>{consonantsRu}</span>)
                    </div>
                  </div>
                  <div className={s.line}>
                    <div>
                      - английских: <span>{lettersEn}</span>
                    </div>
                    <div>
                      (гласных: <span>{vowelsEn}</span>, согласных:{" "}
                      <span>{consonantsEn}</span>)
                    </div>
                  </div>
                </div>
              </div>
              <div>
                - цифр: <span>{numbers}</span>
              </div>
              <div>
                - знаков пунктуации и символов:
                <span>{symbols}</span>
              </div>
              <div>
                - спецсимволов:
                <span>
                  {length - symbols - numbers - lettersEn - lettersRu - spaces}
                </span>
              </div>
            </div>
          </div>
          <div className={s.block}>
            <div>
              Слов: <span>{allWords}</span>
            </div>
            <div className={s.totalincludes}>
              - содержащих цифры: <span>{numberWords}</span>
            </div>
            <div className={s.totalincludes}>
              - с буквами разных языков:
              <span>{difLettersWords}</span>
            </div>
          </div>
          <div className={s.block}>
            <div>
              Абзацев: <span>{paragraph}</span>
            </div>
          </div>
          <div className={s.block}>
            <div>
              Количество двух и более пробелов подряд:
              <span>{doubleSpaces}</span>
            </div>
          </div>
          {ownValue !== "" && (
            <div className={s.block}>
              <div>
                Количество "{ownValue}":
                {
                  <span>
                    {text.match(new RegExp(`${ownValue}`, "g")).length}
                  </span>
                }
              </div>
            </div>
          )}
        </div>
        <div className={s.datefield}>
          Отчет сформирован:{" "}
          <span className={s.date}>
            {new Date().toLocaleString().replace(/:\d+$/, "")}
          </span>
        </div>
      </div>
    </div>
  );
}
