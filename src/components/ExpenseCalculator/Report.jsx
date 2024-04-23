import { useLayoutEffect, useState } from 'react'
import s from './report.module.css'
import Table from './Table'
import { useHttp } from '../../hooks/http-hook'
import Dots from '../Loaders/Dots'
import { checkings } from './checkings'
import DayExpensesInfo from './DayExpensesInfo'

/* Отчет о расходах пользователя */
export default function Report({updateReport}) {
    const [period, setPeriod]= useState('all') /* период, для которого отображаются расходы. all - все расходы по годам */
    const {request, loading} = useHttp()
    const [data, setData] = useState([]) /* массив данных для отображения сууммы расходов в заданном периоде */
    const [categories, setCategories] = useState([]) /* массив данных для отображения расходов по категориям в заданном периоде */

    /* вызов функции получении данных при изменении стейта updateReport
    (при добавлении нового расхода или изменения названия категории)
    или при изменении периода отображения расходов */
    useLayoutEffect(()=> {
           getData() 
    }, [period, updateReport])


    /* Получения данных в зависимости от выбранного периода */
    const getData = async () => {
        let requestParams
        /* по всем годам */
        if (checkings.isAll(period)) {
            requestParams = '/expenses/allyears'
        }
        /* по 1 году */
        else if (checkings.isYear(period)) {
            requestParams = `/expenses/inyear?year=${period}`
        }
        /* по 1 месяцу */
        else if (checkings.isMonth(period)) {
            requestParams = `/expenses/inmonth?year=${period.split('-')[0]}&month=${period.split('-')[1]}`
        }
        else if (checkings.isDay(period)) {
            requestParams = `/expenses/inday?year=${period.split('-')[0]}&month=${period.split('-')[1]}&day=${period.split('-')[2]}`
        }
        else return
        try {
            const res = await request(requestParams)
            setData(res.data)
            setCategories(res.categories)
            
        } catch {}
    }

    /* Заголовок для  */
    const getPeriodTitle = () => {
        if (checkings.isAll(period)){
            return 'все время'
        }
        if (checkings.isYear(period)) {
            return `${period} г.`
        }
        if (checkings.isMonth(period)) {
            return new Date(`${period}-01`).toLocaleDateString('ru', {month: 'long', year: 'numeric'})
        }
        if (checkings.isDay(period)) {
            return new Date(`${period}`).toLocaleDateString('ru', {day: 'numeric', month: 'long', year: 'numeric'})
        }
    }

    const previewPeriod = () => {
        if (checkings.isYear(period)) return setPeriod('all')
        if (checkings.isMonth(period)) return setPeriod(prev=> prev.split('-')[0])
        if (checkings.isDay(period)) return setPeriod(prev=>{
            let splitted = prev.split('-')
            return `${splitted[0]}-${splitted[1]}`
        })
    }

    const setName = () => {
        if (checkings.isYear(period)) return 'year'
        if (checkings.isMonth(period)) return 'month'
        if (checkings.isAll(period)) return 'all'
    }

    return (
        <div className={s.report}>
            <div className={s.title}>Ваши траты</div>
            
            {loading ? <Dots/> :
            <>
            <div className={s.subtitle}>{!checkings.isAll(period) && <i className={`fa-solid fa-arrow-left ${s.lefticon}`} onClick={previewPeriod}></i>} {getPeriodTitle()}
            </div>
           {checkings.isDay(period) ? <DayExpensesInfo data={data} getData={getData}/> :
           <>
           <Table data={data} setPeriod={setPeriod} name={setName()}/>
            <div className={s.categoriestitle}>По категориям</div>
            <Table name={'categories'} data={categories}/> 
           </>
             }
            </>
             }
    
        </div>
    )
}
