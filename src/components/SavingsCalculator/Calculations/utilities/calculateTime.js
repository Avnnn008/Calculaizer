

export const calculateTime = (start, period, count)=> {
    let year = parseInt(start.split('-')[0])
    let month = parseInt(start.split('-')[1])-1
    let day = parseInt(start.split('-')[2])
    let startTime = new Date(`${start}T00:00:00`).getTime()

    /* В зависимости от периода к начальной дате прибавляются дни, месяцы или годы 
    и высчитывается разница в мс между получившейся датой и начальной  */
    switch (period) {
      case '1':
          return new Date(year, month, day+count).getTime() - startTime
      case '2':
          return new Date(year, month, day+7*count).getTime() - startTime
      case '3':
          return new Date(year,month+count,day).getTime() - startTime
      case '4' :
          return new Date(year+count,month,day).getTime()-startTime
    }
}