import s from "./tables.module.css";

export default function Table({
  data,
  name,
  search,
  loading,
  sort,
  reverse,
  setSort,
  setReverse,
  setInfo,
}) {


  function Headers(headersObj) {
    return (
      <thead className={s.head}>
        <tr>
          {headersObj.headers.map(
            (el) =>
              el.indexOf("_") === -1 && el!=='order' && (
                <th key={el}>
                  {name === "users" && (
                    <i
                      className={
                        sort === el && reverse
                          ? `fa-solid fa-sort-up ${s.sorted}`
                          : "fa-solid fa-sort-up"
                      }
                      onClick={() => {
                        setSort(el);
                        setReverse(true);
                      }}
                    ></i>
                  )}
                  {el}
                  {name === "users" && (
                    <i
                      className={
                        sort === el && !reverse
                          ? `fa-solid fa-sort-down ${s.sorted}`
                          : "fa-solid fa-sort-down"
                      }
                      onClick={() => {
                        setSort(el);
                        setReverse(false);
                      }}
                    ></i>
                  )}
                </th>
              )
          )}
        </tr>
      </thead>
    );
  }

  function BodyList({ bodyObj }) {
    const formatedValue = (value, key) => {
      if (value === true) {
        return "да";
      }
      if (value === false) {
        return "нет";
      }
      if (/date/i.test(key)) {
        if (name === "errors") {
          return new Date(value).toLocaleString();
        } else return new Date(value).toLocaleDateString();
      }
      if (/error/i.test(key)) {
        return value.message;
      }
      return value;
    };
    if (name!=='infoSection') {
      return (
      <tr
        className={search && !loading && name === "users" ? s.finded : s.line}
        onClick={() => setInfo(bodyObj)}
      >
        {Object.keys(bodyObj).map(
          (el) =>
            el.indexOf("_") === -1 && (
              <td
                key={el}
                className={el === sort && name === "users" ? s.sort : undefined}
              >
                {formatedValue(bodyObj[el], el)}
              </td>
            )
        )}
      </tr>
    );
    } else {
      const subsections = bodyObj.subsections.sort((a,b)=>a.order - b.order)
      return (  
        <>
        <tr className={s.infotr}>
        <td rowSpan={subsections.length!==0 ? subsections.length : 1} onClick={()=>setInfo({data: bodyObj, name: 'chapter'})}>{bodyObj.name}</td>
        {subsections.length !== 0 ? <td onClick={()=>setInfo({data: subsections[0], name: 'subsections'})}>{subsections[0].name}</td> : <td></td>}
        </tr>
        {subsections.length !== 0 && subsections.map((el, index)=> index!==0 && <tr key={el._id} className={s.infotr}><td onClick={()=>setInfo({data: el, name: 'subsections'})}>{el.name}</td></tr>)}
</>
      )
    }
    
  }

  return (
    <div className={s.table}>
      <table>
        {data[name] && data[name].length !== 0 && <Headers headers={Object.keys(data[name][0])} />}
        <tbody className={s.body}>
          {!loading && name === "users" && search && data[name] && data[name].length === 0 &&  (
            <tr className={s.fill}>
              <td colSpan={3}>Не найдено: {search}</td>
            </tr>
          )}
          {!loading && name === "errors" && data[name] && data[name].length === 0 && (
            <tr className={s.fill}>
              <td colSpan={2}>Ошибки не зарегистрированы или удалены</td>
            </tr>
          )}
          {data[name]  && data[name].length !== 0 &&
            Object.values(data[name]).map((dataEl) => (
              <BodyList bodyObj={dataEl} key={dataEl._id} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
