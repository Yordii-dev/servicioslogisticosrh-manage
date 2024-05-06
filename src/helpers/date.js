export const actualDateTime = () => {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60 * 1000
  const dateLocal = new Date(now.getTime() - offsetMs)
  const str = dateLocal
    .toISOString()
    .slice(0, 19)
    .replace(/-/g, '-')
    .replace('T', ' ')

  return str
}

export const weekNumber = (fecha) => {
  const DIA_EN_MILISEGUNDOS = 1000 * 60 * 60 * 24,
    DIAS_QUE_TIENE_UNA_SEMANA = 7,
    JUEVES = 4
  fecha = new Date(
    Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
  )
  let diaDeLaSemana = fecha.getUTCDay() // Domingo es 0, sábado es 6
  if (diaDeLaSemana === 0) {
    diaDeLaSemana = 7
  }
  fecha.setUTCDate(fecha.getUTCDate() - diaDeLaSemana + JUEVES)
  const inicioDelAño = new Date(Date.UTC(fecha.getUTCFullYear(), 0, 1))
  const diferenciaDeFechasEnMilisegundos = fecha - inicioDelAño
  return Math.ceil(
    (diferenciaDeFechasEnMilisegundos / DIA_EN_MILISEGUNDOS + 1) /
      DIAS_QUE_TIENE_UNA_SEMANA
  )
}

export const compareDateTimes = (firstDate, secondDate) => {
  try {
    return Date.parse(firstDate) > Date.parse(secondDate)
  } catch (error) {
    return false
  }
}

export const compareTimes = (firstHour, secondHour) => {
  try {
    return (
      Date.parse('1/1/1990 ' + firstHour) > Date.parse('1/1/1990 ' + secondHour)
    )
  } catch (error) {
    return false
  }
}

//Obtiene la fecha minima de un array de fechas de string
export const minDateTime = (dates) => {
  try {
    let min = dates.reduce((date1, date2) => {
      return new Date(date1) < new Date(date2) ? date1 : date2
    })
    return min
  } catch (error) {
    return false
  }
}

//Obtiene la fecha maxima de un array de fechas de string
export const maxDateTime = (dates) => {
  try {
    let min = dates.reduce((date1, date2) => {
      return new Date(date1) > new Date(date2) ? date1 : date2
    })
    return min
  } catch (error) {
    console.log(
      'Error de Front: Al obtener mayor fecha de gestionados de usuario ' +
        error
    )
    return false
  }
}

export const onlyDate = (date) => {
  try {
    return date.split(' ')[0]
  } catch (error) {
    return false
  }
}

export const onlyTime = (date) => {
  try {
    return date.split(' ')[1]
  } catch (error) {
    return false
  }
}
