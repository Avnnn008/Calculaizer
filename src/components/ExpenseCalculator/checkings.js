class Checkings {
    isAll = (value)=> {
            if (value === 'all') return true 
            else return false
        }
     isYear = (value) => {
            if (/^[0-9]{4}$/.test(value)) return true
            else return false
        }
    isMonth = (value) => {
        if (/^[0-9]{4}-[0-9]{2}$/.test(value)) return true
        else return false
    }

    isDay = (value) => {
        if (/^[0-9]{4}-[0-9]{2}-[0-9]+$/.test(value)) return true
        else return false
    }
}
export const checkings = new Checkings()
