/* Подбор слова по падежам к определенному числу дней, часов, минут, секунд */
export const pickUpWords = (days, hours, minutes, seconds) => {
    const WORDS = {
      days: ["дней", "день", "дня"],
      hours: ["часов", "час", "часа"],
      minutes: ["минут", "минута", "минуты"],
      seconds: ["секунд", "секунда", "секунды"],
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

    let daysWord = switchFunction(days, "days");
    let hoursWord = switchFunction(hours, "hours");
    let minutesWord = switchFunction(minutes, "minutes");
    let secondsWord = switchFunction(seconds, "seconds");

    return [daysWord, hoursWord, minutesWord, secondsWord];
  };