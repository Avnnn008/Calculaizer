import {useRef, useState } from 'react'
import m from '../UI/input-and-selection-fields.module.css'
import s from './newexpense.module.css'
import { useDispatch } from 'react-redux'
import { setConfirmation, setNotice } from '../../redux/appSlice'
import { useHttp } from '../../hooks/http-hook'
import Dots from '../Loaders/Dots'

/* Добавление нового расхода */
export default function NewExpense({categories, setUpdateReport}) {
    const today = new Date().toISOString({}).split('T')[0] 
    /* дата расхода, категория, цена и описание  */
    const [formData, setFormData] = useState({
        date: '',
        category: '',
        text: '',
        price: ''
    })
    const dispatch = useDispatch()
    const {request, loading} = useHttp()
    /* рефы для сбрасывания значений после сохранения расхода */
    const textRef = useRef()
    const priceRef = useRef()

    
    /* Сохранение нового расхода, сброс значений полей описания и цены*/
    const saveExpense = async () => {
        try {
            await request('/expenses/new', 'POST', {formData})
            dispatch(setNotice('Сохранено!'))
            textRef.current.value = ''
            priceRef.current.value = ''
            setFormData(prev=> {
                prev.text = '',
                prev.price = ''
                return prev
            })
            setUpdateReport(prev=>!prev) /* обновление стейта updateReport для обновления таблицы расходов  */
        } catch {}
    }

    /* Сохранение данных в стейт formData при пользовательском вводе  */
    const inputHandler = (e) => {
        setFormData(prev=>{
            prev[e.target.name]=e.target.value
        return prev})
    }

    /* Проверка введенных пользователем данных, если все верно - вызов функции сохранения нового расхода */
    const submitHandler = () => {
        if (!formData.date) {
           dispatch(setNotice('Не введена дата покупки!'))
           return false
        }
     /*    if (new Date(`${formData.date}T00:00:00`) > Date.now() || parseInt(formData.date.split('-')[0]) < 2023) {
            dispatch(setNotice(`Допустимый диапазон дат 01.01.2023 - ${new Date().toLocaleDateString()}`))
            return false
         } */
        if (!formData.category) {
            dispatch(setNotice('Не выбрана категория покупки!'))
            return false
         }  
         if (!formData.price || !/^[0-9]+[.,]?[0-9]{0,2}$/.test(formData.price)) {
            dispatch(setNotice('Стоимость покупки не указана или указана неверно! Стоимость может быть целым числом или десятичным с не более чем 2 знаками, стоящими после точки или запятой!'))
            return false
         } 
        if (!formData.text) {
            dispatch(setConfirmation({text: 'Сохранить без описания?', function: saveExpense}))
            return false
        }
        saveExpense()

    }

  return (
    <>{loading && <div className={s.loading}><Dots/></div>}
    <div className={s.form}>
        
        <div>
          <label>Дата: <input className={m.input} type="date" name='date' /* min='2023-01-01' */ max={today} onChange={inputHandler} /></label>
        <select className={m.select} name='category' onChange={inputHandler} defaultValue={'init'}>
            <option value={'init'} disabled>{(categories && categories.length) ? 'Выберите категорию' : 'Нет категорий'}</option>
            {(categories && categories.length) ? categories.sort().map(el=><option value={el} key={el}>{el}</option>) : 
            <option disabled>
            Создайте в разделе "Мои категории"</option>
       
          
           }
        </select>
        <input ref={priceRef} className={m.input} type="number" step={'0.01'} name='price' onChange={inputHandler} placeholder='стоимость' inputMode='decimal' />  
        </div>
        
        <div>
                <input ref={textRef} className={m.input} type="text" placeholder="описание (по желанию)" name='text' onChange={inputHandler}/>
            
        <i className="fa-solid fa-circle-check" onClick={submitHandler}></i>
            </div>
        
    </div></>
  );
}
