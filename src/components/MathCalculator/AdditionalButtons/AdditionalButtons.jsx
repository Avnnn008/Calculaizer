import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput, setFormula, setIsResult } from "../../../redux/calcSlice";
import { btnClickHandler } from "../utilities/btnClickHandler"
import { checkForDigit, checkForOperators, checkForZero, checkInputFieldLength } from "../utilities/checking";
import { gamma} from "mathjs";
import { checkAndFormatResult } from "../utilities/forEqualOperator";
import { setNotice } from "../../../redux/appSlice";
import s from '../buttons.module.css'

/* Дополнительные кнопки калькултора */
export default function AdditionalButtons ({additionalButtons}) {
    const {input, isResult, formula} = useSelector(state=>({
        input: state.calcReducer.mathInput,
        isResult: state.calcReducer.mathIsResult,
        formula: state.calcReducer.mathFormula,
      }))
    const dispatch = useDispatch()
    const [isRad, setIsRad] = useState(true)


/* Извлечение квадратного корня. 
    Принимает событие нажатия на кнопку.
    Если в поле ввода (input) только положительное или отрицательное число, извлекает из него квадратный корень, 
    отправляет на проверку длины для установки шрифта, устанавливает вычисленное число в поле ввода (input), 
    заменяет исходное число на результат вычисления в поле формулы (formula) */
const squareRoot = (event) => {
    btnClickHandler(event.target)
    if (checkForDigit(input) && !/√|\^/.test(input)) {
        let digit = input
        let sqrt = Math.sqrt(digit)
        checkInputFieldLength(`${sqrt}`)
        dispatch(setInput(`${sqrt}`))
        if (isResult) {
            dispatch(setFormula(`${sqrt}`))
            dispatch(setIsResult(false))
        } else {
            dispatch(setFormula(formula.slice(0, -digit.length) + `${sqrt}`))
        }
    }
}
/* Извлечение кубического корня. 
    Принимает событие нажатия на кнопку.
    Если в поле ввода (input) только положительное или отрицательное число, извлекает изз него кубический корень, 
    отправляет на проверку длины для установки шрифта, устанавливает вычисленное число в поле ввода (input), 
    заменяет исходное число на результат вычисления в поле формулы (formula) */
const cubeRoot = (event) => {
    btnClickHandler(event.target)
    if (checkForDigit(input) && !/√|\^/.test(input)) {
        let digit = input
        let cbrt = Math.cbrt(digit)
        checkInputFieldLength(`${cbrt}`)
        dispatch(setInput(`${cbrt}`))
        if(isResult) {
            dispatch(setFormula(`${cbrt}`)) 
            dispatch(setIsResult(false))
        } else {
            dispatch(setFormula(formula.slice(0, -digit.length) + `${cbrt}`))
        } 
    }
}

/* Извлечение корня n степени. 
    Принимает событие нажатия на кнопку.
    Если в поле ввода (input) только положительное или отрицательное число,  
    отправляет на проверку длины для установки шрифта исходное значение и знак корня, 
    добавляет в поле ввода (input) перед исходным числом знак ⁿ√,
    не устанавливает окончание вычислений, так как ожидается степень корня 
     */
const degreeRoot = (event) => {
    btnClickHandler(event.target)
    let value = 'ⁿ√'
    if (checkForDigit(input) && !/√|\^/.test(input)) {
        checkInputFieldLength(value + input)
        if(isResult) {
            dispatch(setFormula(formula.split('=')[1]))
        }
        dispatch(setIsResult(false))
        dispatch(setInput(value + input))
    }
    

}
/* Воззведение в квадрат, куб и степень работают по аналогии с функиями извлечения корня */
/* Воззведение в квадрат */
const square = (event) => {
    btnClickHandler(event.target)
    if (checkForDigit(input) && !/√|\^/.test(input)) {
        let digit = input
        let square = Math.pow(digit, 2)
        checkInputFieldLength(`${square}`)
        dispatch(setInput(`${square}`))
        if (isResult) {
            dispatch(setFormula(`${square}`))
            dispatch(setIsResult(false))
        }  else {
            dispatch(setFormula(formula.slice(0, -digit.length) + `${square}`))
        } 
    }
}

/* Воззведение в куб */
const cube = (event) => {
    btnClickHandler(event.target)
    if (checkForDigit(input) && !/√|\^/.test(input)) {
        let digit = input
        let cube = Math.pow(digit, 3)
        checkInputFieldLength(`${cube}`)
        dispatch(setInput(`${cube}`))
        if (isResult) {
           dispatch(setFormula(`${cube}`))
           dispatch(setIsResult(false)) 
        }  else {
           dispatch(setFormula(formula.slice(0, -digit.length) + `${cube}`)) 
        } 
    }
}

/* Возведение в n степень */
const degree = (event)=>{
    btnClickHandler(event.target)
    let value = '^'
    if (checkForDigit(input) && !/√|\^/.test(input)) {
        checkInputFieldLength(input+value)
        if(isResult) {
            dispatch(setFormula(formula.split('=')[1]))
        }
        dispatch(setIsResult(false))
        dispatch(setInput(input + value))
    }
}

/* Вычисление факториала числа.
Принимает событие нажатия на кнопку.
    Если в поле ввода (input) только положительное или отрицательное число, преобразует его в тип float, считает факториаал с помощью функции gamma, 
    отправляет на проверку длины для установки шрифта, устанавливает вычисленное число в поле ввода (input), 
    заменяет исходное число на результат вычисления в поле формулы (formula) */
const factorial = (event) => {
    btnClickHandler(event.target)
    if (checkForDigit(input) && !/√|\^/.test(input)) {
        let digit = parseFloat(input)
        let fact = gamma(digit+1)
        checkInputFieldLength(`${fact}`)
        dispatch(setInput(`${fact}`))
        if(isResult) {
            dispatch(setFormula(`${fact}`))
            dispatch(setIsResult(false))
        }  else {
            dispatch(setFormula(formula.slice(0, -`${digit}`.length) + `${fact}`))
        } 
    }
}

/* Добавление констант: pi, e */
const addPi = (event) => {
    btnClickHandler(event.target)
    addConst('pi')
}

const addE = (event) => {
    btnClickHandler(event.target)
    addConst('e')
}

/* Поведение функции зависит от того, начинается ли новое вычисление или продолжается текущее.
Принимается строка с наименованием константы, преобразуется в числовое значение value */
const addConst = ( constant) => {
    let value
    if (constant === 'pi') {
        value = `${Math.PI}`
    } else if (constant === 'e') {
        value = `${Math.E}`
    }
   
    /* Если константа начинает новое вычисление, проверяется ее длина для устаноки шрифта, состояние начала вычисления устанавливается в false,
    в поле текущего ввода и формулы устанавливается зачение константы */
    const newCalculation = () => {
        checkInputFieldLength(value)
     dispatch(setIsResult(false));
     dispatch(setInput(value));
     dispatch(setFormula(value));
   };

   /* Если константа вставляется в текущее вычисление, проверяется ряд уусловий */
   const currentCalculation = () => {
    /* Идет после оператора: заменяет оператор в поле ввода, дописывается в формлу */
       if (checkForOperators(input)&&!checkForDigit(input)) {
        checkInputFieldLength(value)
        dispatch(setInput(value));
        dispatch(setFormula(formula + value));
     } else if (input === "0") { /* После 0: заменяет 0 в поле ввода и в формуле */
        checkInputFieldLength(value)
        dispatch(setInput(value))
        dispatch(setFormula(formula.replace(/0$/, "") + value));
     }  else if (checkForDigit(input)) { /* После числа */
        if (/√/.test(input)) {/* Число под корнем n степени: ставится вместо n или добавляется к имеющемуся n, если n - не десятичное чило*/
            if (!/\./.test(input.split('√')[0])){ 
                checkInputFieldLength(input+value)
                dispatch(setInput(input.split('√')[0].replace('ⁿ', '')+value + '√' + input.split('√')[1]))
            } else {
                dispatch(setNotice('Нельзя добавить десятичное число внутрь другого десятичного числа!'))
            }
            
        } else if (/\^/.test(input)&&!/\./.test(input.split('^')[1])) { /* Возведение в n степень: ставится вместо n или добавляется к имеющемуся n, если n - не десятичное чило */
            if (!/\./.test(input.split('^')[1])) {
                checkInputFieldLength(input+value)
                dispatch(setInput(input +value))
            } else {
                dispatch(setNotice('Нельзя добавить десятичное число внутрь другого десятичного числа!'))
            }
            
        }
        else { /* В других случаях константа заменяет введенное число в поле ввода и формуле */
            checkInputFieldLength(value)
            dispatch(setFormula(formula.slice(0, -input.length) + value))
            dispatch(setInput(value))
        }
     }   
   };

   isResult ? newCalculation() : currentCalculation();
}

/* Вычисление тригонометричесих функций.
Принимает событие нажатия на кнопку.
Если в поле ввода число, ноль и нет знаков извлечения корня или возведния в степень, высчитывает тригонометрическую функцию,
заменяет исходное число в поле ввода и формуле на вычисленное значение. */
const trigonometricFunct = (event, type) => {
    btnClickHandler(event.target)
    if ((checkForDigit(input) || checkForZero(input)) && !/√|\^/.test(input)) {
        let digit 
        isRad ? digit = Number(input) : digit = Number(input) *180 / Math.PI
        let result
        switch (type) {
            case 'cos':
                result = Math.cos(digit)
                break
            case 'sin':
                result = Math.sin(digit)
                break
            case 'tan':
                result = Math.tan(digit)
                break
        }
        result = checkAndFormatResult(result.toFixed(9))
        if (result==='-0') {
            result = '0'
        }
        checkInputFieldLength(`${result}`)
        dispatch(setInput(`${result}`))
        if(isResult) {
           dispatch(setFormula(`${result}`)) 
           dispatch(setIsResult(false))
        }  else {
            dispatch(setFormula(formula.slice(0, -digit.length) + `${result}`))
        } 
    }  
}


/* Вычисление обратного числа.
Принимает событие нажатия на кнопку.
Если в поле ввода число, ноль и нет знаков извлечения корня или возведния в степень, высчитывает обратное число,
заменяет исходное число в поле ввода и формуле на вычисленное значение. */
const reciprocalNumber = (event) => {
    btnClickHandler(event.target)
    if ((checkForDigit(input) || checkForZero(input)) && !/√|\^/.test(input)) {
        let digit = input
        let reciprocal = 1/input
        checkInputFieldLength(`${reciprocal}`)
        dispatch(setInput(`${reciprocal}`))
        if(isResult) {
             dispatch(setFormula(`${reciprocal}`))
             dispatch(setIsResult(false))
        } else {
            dispatch(setFormula(formula.slice(0, -digit.length) + `${reciprocal}`))
        } 
    }

}

/* Вычисление значения, противоположного по знаку.
Принимает событие нажатия на кнопку.
Изменяет знак у числа в поле вода и формуле. */
const oppositeFunct = (event) => {
    btnClickHandler(event.target)
    /* Изменяется знак у степеней, если они указаны */
    if (/√/.test(input) && checkForDigit(input.split('√')[0])) {
        input.split('√')[0][0] === '-' ? 
        dispatch(setInput(input.slice(1))) : dispatch(setInput('-' + input))
    } else if (/\^/.test(input) && checkForDigit(input.split('^')[1])) {
        input.split('^')[1][0] === '-' ? 
        dispatch(setInput(input.split('^')[0] + '^' + input.split('^')[1].slice(1))) : dispatch(setInput(input.split('^')[0] + '^' + '-' + input.split('^')[1]))
    } else if (checkForDigit(input) && (isResult || input===formula)) { /* Поле ввода совпатает с формулой */
        dispatch(setIsResult(false))
       if (input[0] === '-')  {
        dispatch(setFormula(`${input.slice(1)}`))
        dispatch(setInput(input.slice(1)))
       } else {
        dispatch(setFormula('0-'+input))
       }
    } else if (checkForDigit(input) && !/√|\^/.test(input)) {
        /* Если перед числом 1 знак - не минус */
        if (!/\-$/.test(formula.slice(0, -input.length))) {
            dispatch(setFormula(formula.slice(0, -input.length) + '-' + input))
        } else {
            /* Если перед числом минус, смотрим есть ли оператор до него */
            if (/\+$|-$|÷$|x$/.test(formula.slice(0, -input.length-1))) {
                /* Оператор есть - убераем минус */
                dispatch(setFormula(formula.slice(0, -input.length-1)+input))
            } else {
                /* Оператора нет - дописываем минус (в формуле двойной минус) */
                dispatch(setFormula(formula.slice(0, -input.length)+'-'+input))
            }
        }
    }
}

const ADDITIONAL_BTNS = {
    '²√' : squareRoot,
    '³√': cubeRoot,
    'ⁿ√': degreeRoot,
    '1/x': reciprocalNumber,
    'x²': square,
    'x³': cube,
    'xⁿ': degree,
    'x!': factorial,
    'cos': (e)=>trigonometricFunct(e, 'cos'),
    'sin': (e)=>trigonometricFunct(e, 'sin'),
    'tan': (e)=>trigonometricFunct(e,'tan'),
    'π': addPi,
    'e': addE,
    '⁺/₋': oppositeFunct

}

    return (
        <div className={s.additional} ref={additionalButtons}>
            {Object.keys(ADDITIONAL_BTNS).map(el=> <button key={el} onClick={ADDITIONAL_BTNS[el]}>{el}</button>)}
            <button className={s.degrad} onClick={()=>setIsRad(prev=>!prev)}>
                <>
                <div className={s.current}>{isRad ? 'Rad' : 'Deg'}</div>
                <div>{isRad? 'Deg' : 'Rad'}</div>
                </></button>   
        </div>
    )
}