
/* Вычисление результата */

/* Форматирование результата: удаление лишнего количеста 0 после запятой */
export const checkAndFormatResult = (unformattedResult) => {
    if (unformattedResult === "Infinity" || unformattedResult === "NaN" || !/\./.test(unformattedResult)) {
      return unformattedResult;
    } else {
      let fractionalPartOfResult = unformattedResult
        .split(".")[1]
        .replace(/0{1,}$/, "")
      if (fractionalPartOfResult)
        return unformattedResult.split(".")[0] + "." + fractionalPartOfResult;
      else return unformattedResult.split(".")[0];
    }
  };

  /* Форматирование представления формулы на экране: удаление операторов в конце формулы, за которыми не идут числа, подстановка знака = */
  export const modifyResultFormula = (formula) => {
    const operatorAtTheAnd = /\+$|-+$|x$|÷$|\+-+$|x-+$|÷-+$|\.$/;
    return formula.replace(operatorAtTheAnd, "").replaceAll('--', '+').replaceAll('++', "+").replaceAll('x+', 'x').replaceAll('÷+', '÷') + "=";
  };

  /* Подсчет результата
  Принимает модифицированную формулу, возвращает число с 9 знаками после запятой */
  const calculateResult = (expression) => {
    const func = new Function("return " + expression.replace("=", ""));
    return func().toFixed(9); 
  };


  /* resultExpression - создание из формулы выражения, доступного для программного вычисления (не отображается на экране пользователя), 
  далее выражение отправляетс в функцию подсчета calculateResult,
  результат вычислений передается в функцию checkAndFormatResult для форматирования.
  Возвращает массив с 2 значениями - форматированный результат вычислений, статус true - установится в isResult при успешном вычислении*/
  export const generalizeResult = (formula) => {
       if (formula) {
      let resultExpression = formula.replaceAll("x", "*").replaceAll("÷", "/").replaceAll('--', "+").replaceAll('++', "+").replaceAll('*+', '*').replaceAll('/+', '/')
      let totalResult = calculateResult(resultExpression)
      let totalResultFormatted = checkAndFormatResult(totalResult
      );
      return [totalResultFormatted, true];
    } else return ["0", false];

  };
