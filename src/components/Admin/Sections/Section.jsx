import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./section.module.css";
import { useDebounce } from "../../../hooks/debounce";
import { useHttp } from "../../../hooks/http-hook";
import Table from "./Tables/Table";
import PageSwitcher from "./PageSwitcher";
import Mailing from "./Mailing";
import Info from "./Info";
import Dots from "../../Loaders/Dots";
import CreateInfoComponent from "./CreateInfoComponent";
import { setConfirmation } from "../../../redux/appSlice";

export default function Section({ name, getCountOfAdminSectionsDocuments }) {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.adminReducer[name + "Count"]);
  const limit = 10; /* количество строк, отображаемых на 1 странице таблицы */
  const pages = Math.ceil(count / limit); /* количество страниц таблицы*/
  const [page, setPage] = useState(1); /* текущая страница таблицы */
  const [valueToSearch, setValueToSearch] =
    useState(""); /* ввод поискового запроса пользователем */
  const [sort, setSort] = useState("email"); /* сортировка таблицы */
  const [reverse, setReverse] = useState(false); /* обратная сортировка */
  const [updating, setUpdating] =
    useState(false); /* обновление данных, например, при удалении */
  const [info, setInfo] = useState("");
  const { request, loading } = useHttp();
  const search = useDebounce(
    valueToSearch,
    500
  ); /* для запроса на поиск, чтобы запрос отправлялся не при каждом изменении input  */
  const [data, setData] = useState([]);
  const searchCount = useRef(0);

  useEffect(() => {
    setInfo("");
  }, [name]);

  useEffect(() => {
    if (updating) {
      setInfo("");
      getData();
    }
  }, [updating]);

  useEffect(() => {
    if (page < 1) {
      setPage(1);
    } else {
      getData();
    }
  }, [page]);

  useEffect(() => {
    page !== 1 ? setPage(1) : getData();
  }, [sort, reverse, search, name]);

  const deleteErrors = async () => {
    try {
      const errorsList = data.errors.map((el) => el._id);
      await request("/admin/deleteerrorlist", "POST", { errorsList });
      getCountOfAdminSectionsDocuments();
      setUpdating(true);
    } catch {}
  };

  const getData = async () => {
    try {
      const response = await request(
        `/admin/${name}${
          name === "infoSection"
            ? ""
            : `?page=${page}${
                name === "users"
                  ? `&sort=${sort}&reverse=${
                      reverse ? true : ""
                    }&search=${search}`
                  : ""
              }&limit=${limit}`
        }`
      );
      if (response[name].length === 0 && page > 1) {
        setPage((prev) => prev - 1);
      }
      setData(response);
      if (search && name === "users") {
        searchCount.current = response.searchCount;
      }
      setUpdating(false);
    } catch {}
  };

  return (
    <>
      {name === "users" && (
        <div className={s.search}>
          <label>Поиск:</label>
          <input
            placeholder="email/имя"
            type="text"
            value={valueToSearch}
            onChange={(e) => setValueToSearch(e.target.value)}
          />
        </div>
      )}
      {name === "errors" && data.errors && (
        <div className={s.deleteerrors}>
          <div
            onClick={() =>
              dispatch(
                setConfirmation({
                  text: `Удалить все ошибки с данной страницы?`,
                  function: deleteErrors,
                })
              )
            }
          >
            Удалить ошибки ({data.errors.length})
          </div>
        </div>
      )}
      {loading && (
        <div className={s.loading}>
          <Dots dark={true} />
        </div>
      )}
      {
        <Table
          data={data}
          name={name}
          search={search}
          loading={loading}
          sort={sort}
          reverse={reverse}
          setSort={setSort}
          setReverse={setReverse}
          setInfo={setInfo}
        />
      }
      {pages > 1 && (
        <PageSwitcher
          page={page}
          pages={
            search && name === "users"
              ? Math.ceil(searchCount.current / limit) === 0
                ? 1
                : Math.ceil(searchCount.current / limit)
              : pages
          }
          setPage={setPage}
        />
      )}
      {info ? (
        <Info
          name={name}
          info={info}
          setInfo={setInfo}
          setUpdating={setUpdating}
        />
      ) : (
        (name === "users" && !loading && <Mailing />) ||
        (name === "infoSection" && !loading && (
          <CreateInfoComponent
            component={"chapter"}
            setUpdating={setUpdating}
          />
        ))
      )}
    </>
  );
}
