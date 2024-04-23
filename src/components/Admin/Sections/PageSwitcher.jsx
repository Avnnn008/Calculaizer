import s from './pageswitcher.module.css'

export default function PageSwitcher ({page, pages, setPage}) {
    return (
        <div className={s.pageSwitcher}>
            <i
              className={page===1 ? `fa-solid fa-caret-left ${s.hide}` : "fa-solid fa-caret-left"}
              onClick={() => page !== 1 && setPage((prev) => prev - 1)}
            ></i>
            <div>{page}</div>
            <i
              className={page===pages ? `fa-solid fa-caret-right ${s.hide}` : "fa-solid fa-caret-right"}
              onClick={() => page !== pages && setPage((prev) => prev + 1)}
            ></i>
          </div>
    )
}