
/* Проверки принятых в качестве аргументов строк на соответсвие */
/* математические операторы */
const checkForOperators = (string) => {
    return /[\+|\-|÷|x|]/.test(string);
  };

  /* числа 1-9 */
  const checkForDigit = (string) => {
    return /[1-9]/.test(string);
  };

  /* ноль */
  const checkForZero = (string) => {
    return /0/.test(string);
  };

  /* точка */
  const checkForDot = (string) => {
    return /\./.test(string);
  };



  /* Проверка длины введенной строки дл установки оптимального шрифта в поле ввода */
  export const checkInputFieldLength = (value) => {
    let fontSize = 2.25
    let padding = 0
    if (value.length > 28) {
      fontSize = 0.85
      padding= 0.85
    }
    else if (value.length > 24) {
      fontSize = 0.95
      padding=0.85
    }
    else if (value.length > 20) {
      fontSize = 1.1
      padding = 0.85
    }
    else if (value.length > 16) {
      fontSize = 1.25
      padding = 0.75
    } else if (value.length > 14) {
     fontSize = 1.5
     padding = 0.6
    } else if (value.length > 11) {
      fontSize = 1.75
      padding = 0.5
    } 
    document.getElementById('display').style.fontSize = `${fontSize}rem`
    document.getElementById('display').style.paddingTop = `${padding}rem`
  }



  export {checkForOperators, checkForDigit, checkForZero, checkForDot}