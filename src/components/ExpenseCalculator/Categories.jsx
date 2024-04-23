import { useEffect, useState, useLayoutEffect } from 'react'
import s from './categories.module.css'
import m from '../UI/input-and-selection-fields.module.css'
import { setConfirmation, setNotice } from '../../redux/appSlice'
import { useDispatch } from 'react-redux'
import { useHttp } from '../../hooks/http-hook'
import Dots from '../Loaders/Dots'

/* Пользовательские категории */
export default function Categories({categories, getUserExpenseCategories, setUpdateReport}) {
    const [showCategories, setShowCategories] = useState(false) /* показать/скрыть категории */
    const [newCategory, setNewCategory] = useState('') /* название новой категории */
    const [newName, setNewName] = useState('') /* новое название редактируемой категории */
    const [edit, setEdit]= useState('') /* редактируемая категорий */
    const dispatch = useDispatch()
    const {request, loading} = useHttp()

/* отмена добавления и редактирования категорий при развораничвании/скрытии списка категорий */
    useEffect(()=> {
        setNewCategory('')
        setEdit('')
    }, [showCategories])

    /* При редактировании названия новое название изначально устанавливается исходным */
    useLayoutEffect(()=> {
        setNewName(edit)
    }, [edit])

    useEffect(()=> {
        if (newName.length === 30 || newCategory.length === 30) {
            dispatch(setNotice('Максимальная длина названия категории - 30 символов!'))
        }
    }, [newName, newCategory])
    
    const categoryInputHandler = (e) => {
        if (e.target.value.length>30) {
            dispatch(setNotice('Максимальная длина названия категории - 30 символов!'))
            if (e.target.name === 'new') {
               newCategory ? e.target.value = newCategory : setNewCategory(e.target.value.slice(0,30)) 
            }
            
            if (e.target.name === 'edit') newName ? e.target.value = newName : setNewName(e.target.value.slice(0,30))
            return
        }
        if (e.target.name === 'new') setNewCategory(e.target.value)
        if (e.target.name === 'edit') setNewName(e.target.value)
    }

    /* Сохранение новой категории */
    const saveNewCategory = async () => {
        if (!newCategory) {
            dispatch(setNotice('Вы не ввели название категории!'))
            return false
        } else {
          await request('/expenses/categories/new', 'POST', {newCategory})
          setNewCategory('')
          getUserExpenseCategories() /* вызов функции для обновления списка категорий */
        }
    }

    /* Удаление категории */
    const deleteCategory = async (el) => {
        try {
            await request('/expenses/categories/delete', 'POST', {name: el})
            getUserExpenseCategories() /* вызов функции для обновления списка категорий */
        } catch {}
    }

    /* Обновление названия категории */
    const updateCategory = async () => {
        if (newName !== edit && newName) {
            try {
                await request('/expenses/categories/update', 'POST', {edit, newName})
                getUserExpenseCategories() /* вызов функции для обновления списка категорий */
                setUpdateReport(prev=>!prev) /* обновление стейта updateReport для обновления таблицы расходов  */
            } catch {}
        }
        setEdit('')
    }


    return (
        <div className={s.categories}>
           <div className={s.title}>Мои категории
           {showCategories 
           ? <i onClick={()=>setShowCategories(false)} className='fa-solid fa-angle-up'></i> 
           : <i onClick={()=>setShowCategories(true)} className='fa-solid fa-angle-down'></i>}</div>
           {showCategories && <div className={s.list}>
            {loading && <div className={`${s.line} ${s.center}`}><Dots/></div>}
            {categories && categories.length ? <div className={s.elements}>
                {categories.map(el=> edit===el ? <div className={s.line} key={el}>
                    <i className='fa-solid fa-xmark' onClick={()=>setEdit('')}></i>
                    <i className='fa-solid fa-check' onClick={updateCategory}></i>
                    <input type="text" name='edit' className={m.input} value={newName} onChange={categoryInputHandler}/>
                </div> : <div className={s.line} key={el}>
                    <i className='fa-solid fa-trash' onClick={()=>dispatch(setConfirmation({text: `Удалить категорию ${el}?`, function: ()=>deleteCategory(el)}))}></i>
                    <i className='fa-solid fa-pen' onClick={()=>setEdit(el)}></i>
                    {el}
                </div>)}
            </div> : <div className={`${s.line} ${s.center}`}>Нет созданных категорий</div>}

             <div className={`${s.line} ${(!categories || !categories.length) && s.center}`}>
                Добавить
                <input type="text" name='new' className={m.input} placeholder='например, еда' value={newCategory} onChange={categoryInputHandler}/>
                <i className='fa-solid fa-check' onClick={saveNewCategory}></i>
            </div>
            </div>}
           
        </div>
    )
}