import s from './table.module.css'
import { checkings } from './checkings'

export default function Table({name, data, setPeriod}) {


    const trClickHandler = (id) => {
        if (name==='categories') {
            return false
        }
        setPeriod(prev=> {
            let newValue
            if (checkings.isAll(prev)) {
                newValue= id
            }
            if (checkings.isYear(prev) || checkings.isMonth(prev)) {
                newValue= `${prev}-${id}`
            }
            return newValue
        })
    }

    const getHeadTitle = ()=> {
        switch (name) {
            case 'categories': return 'Категория'
            case 'all': return 'Год'
            case 'year': return 'Месяц'
            case 'month': return 'Число'
        }
    }

    const getTotalSum = () => {
        const sum = data.map(el=> (el.total)).reduce((acc, cur)=> (acc+cur))
        if (sum) {
           return sum.toFixed(2) 
        }
        
    }

    return (
        <div className={s.table}>
        <table>
        <thead className={s.head}>
        <tr>
          <th>{getHeadTitle()}</th>
          <th>Сумма</th>
        </tr>
      </thead>
          <tbody className={s.body}>
            {(data && data.length) ? data.map(el=> (
                <tr className={name!=='categories' ? s.line : undefined} key={el._id} onClick={()=>trClickHandler(el._id)}>
                <td>{name === 'year' ? new Date(`2023-${el._id}-01`).toLocaleDateString('ru', {month: 'long'}) : el._id}</td>
                <td>{el.total && (el.total).toFixed(2)}</td>
            </tr>
            )) : <tr><td colSpan={2}>Нет данных</td></tr>}
            

          </tbody>
          {(data && data.length && name!=='categories') ? <tfoot><tr>
            <td>Итог:</td>
            <td>{getTotalSum()}</td>
            </tr></tfoot> : <></>}
        </table>
      </div>
    )
}