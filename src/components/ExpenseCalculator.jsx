import { useEffect, useRef, useState } from 'react'
import NewExpense from './ExpenseCalculator/NewExpense'
import s from './expensecalculator.module.css'
import { useHttp } from '../hooks/http-hook'
import Categories from './ExpenseCalculator/Categories'
import Dots from './Loaders/Dots'
import Report from './ExpenseCalculator/Report'

export default function ExpenseCalculator () {
    const {request, loading} = useHttp()
    const [categories, setCategories] = useState()
    const [updateReport, setUpdateReport] = useState(false) /* для обновления таблицы расходов при добавлении нового расхода */

    useEffect(()=> {
          getUserExpenseCategories()  
    }, [])

    /* Получение массива пользовательских категорий расходов*/
    const getUserExpenseCategories = async () => {
        try {
            const data = await request('/expenses/categories/get')
            setCategories(data.categories) 
        } catch {}
    }

    return (
        <div className={s.window}>
            {!categories && loading && <Dots/>}
              {categories && <NewExpense categories={categories} setUpdateReport={setUpdateReport} />}
              {categories && <Categories categories={categories} getUserExpenseCategories={getUserExpenseCategories} setUpdateReport={setUpdateReport}/>}  
              {categories && <Report updateReport={updateReport}/>}        
        </div>
    )
}