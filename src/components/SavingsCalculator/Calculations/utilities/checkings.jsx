
/* Проверка, что даты находятся в допустимом диапазоне */
export const checkDateRange = (date) =>{
    let year = parseInt(date.split('-')[0])
        if (year<2000 || year>2299) {
          return (
            <>
            <div>Допустимый диапазон дат:</div>
            <div>01.01.2000 - 31.12.2299</div>
            </>
          )
        }
}

/* Проверка, что целевая дата больше начальной */
export const checkDateDifference = (start, end) => {
    if (new Date(start).getTime() > new Date(end).getTime()) {
        return "Целевая дата должна быть больше начальной!";
      }
}

export const checkPaymentAndSumDifference = (payment, sum) => {
    if (parseInt(payment) >=  parseInt(sum)) {
        return "Целевая сумма должна быть больше суммы вложений!";
      }
}

/* Проверка, что введенное число является положительным целым*/
export const checkNumberIntegrity = (number) => {
    if (parseInt(number) < 1 || /\.|,/.test(number)) {
        return "Введенные числа должны быть положительными целыми!";
      }
}

/* Проверка, что продолжительность накоплений находится в допустимом диапазоне */
export const checkPeriodRange = (period, count) => {
    if (
        (period == 1 && count > 365250) ||
        (period == 2 && count > 52180) ||
        (period == 3 && count > 12000) ||
        (period == 4 && count > 1000)
      ) {
        return (
          <>
            <div>Копить больше 1000 лет!</div>
            <div>К сожалению, эликсир вечной жизни еще не изобрели 😞</div>
          </>
        );
      }
}

