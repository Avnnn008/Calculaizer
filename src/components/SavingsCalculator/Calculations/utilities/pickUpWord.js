export const pickUpWordToMoney = (count) => {
    switch (true) {
        case /11$|12$|13$|14$/.test(count):
          return 'рублей';
        case /.?1$/.test(count):
          return 'рубль';
        case /[2-4]$/.test(count):
          return 'рубля';
        default:
          return 'рублей';
      }
}

export const pickUpWordsToPeriod = (days, weeks, months, years) => {
  const WORDS = {
    day: ["дней", "день", "дня"],
    week: ["недель", "неделю", "недели"],
    month: ["месяцев", "месяц", "месяца"],
    year: ["лет", "год", "года"],
  };

  function switchFunction(time, key) {
    switch (true) {
      case /11$|12$|13$|14$/.test(time):
        return WORDS[key][0];
      case /.?1$/.test(time):
        return WORDS[key][1];
      case /[2-4]$/.test(time):
        return WORDS[key][2];
      default:
        return WORDS[key][0];
    }
  }

  let daysWord = switchFunction(days, "day");
  let weeksWord = switchFunction(weeks, "week");
  let monthsWord = switchFunction(months, "month");
  let yearsWord = switchFunction(years, "year");

  return [daysWord, weeksWord, monthsWord, yearsWord];
}