import { errorResponse } from './methodResponse'

/* Base methods 
 (Como no tenemos setAppError, devolvemos todo un objeto 'errorResponse')
*/

export const getUserId = () => {
  let userId = localStorage.getItem('userId')
  if (!userId) return null
  return userId
}
export const getToken = () => {
  let operatorToken = localStorage.getItem('token-operator')
  if (!operatorToken) return null
  return operatorToken
}
export const getDeliveryId = () => {
  let deliveryId = localStorage.getItem('deliveryId')
  if (!deliveryId) return null
  return deliveryId
}
export const getRoute = async () => {
  try {
    const URL = `${process.env.VUE_APP_API_OPERATOR}/route/latest`

    let res = await fetch(URL, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
      }),
      response = await res.json()
    if (response.error) throw response
    return response
  } catch (error) {
    return errorResponse(error.statusText || ` Al obtener ruta`)
  }
}
export const getThisOperator = async () => {
  try {
    const URL = `${process.env.VUE_APP_API_OPERATOR}/operators-self`

    let res = await fetch(URL, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
      }),
      response = await res.json()
    if (response.error) throw response
    return response
  } catch (error) {
    return error.statusText
      ? error
      : errorResponse(`Al obtener datos del actual operador`)
  }
}
export const getActiveOperators = async (userId) => {
  try {
    const URL = `${process.env.VUE_APP_API_USER}/operators/A/${userId}`
    let res = await fetch(URL),
      response = await res.json()
    if (response.error) throw response
    return response
  } catch (error) {
    return error.statusText
      ? error
      : errorResponse(`Al obtener vehiculos de operadores activos`)
  }
}
export const getDeliveries = async () => {
  try {
    const URL = `${process.env.VUE_APP_API_OPERATOR}/deliveries/latest`

    let res = await fetch(URL, {
        headers: {
          Authorization: 'Bearer ' + getToken(),
        },
      }),
      response = await res.json()
    if (response.error) throw response
    return response
  } catch (error) {
    return error.statusText
      ? error
      : errorResponse(`Al obtener entregas de operador`)
  }
}
export const getDeliveryDetail = async (deliveryId) => {
  try {
    const URL = `${process.env.VUE_APP_API_DELIVERY}/detail/${deliveryId}`

    let res = await fetch(URL),
      response = await res.json()
    if (response.error) throw response
    return response
  } catch (error) {
    return error.statusText
      ? error
      : errorResponse(`Al obtener detalle de entrega`)
  }
}
