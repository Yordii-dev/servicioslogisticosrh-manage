import {
  getUserId,
  getRoute,
  getThisOperator,
  getActiveOperators,
  getDeliveryId,
  getDeliveries,
  getDeliveryDetail,
} from '../helpers/validateParts'
import { successResponse, failResponse } from '../helpers/methodResponse'
//For route
export const validateUserId = () => {
  let response = getUserId()
  if (!response)
    return failResponse(
      'Vuelve a iniciar sesion',
      'Area de trabajo no especificada.'
    )

  return successResponse() // En validate va el objeto response y un objeto pageToReturn
}
export const validateOperatorTk = async () => {
  let response = await getThisOperator()
  if (response.error) throw response

  if (response.status == 'fail')
    return failResponse('Vuelve a iniciar sesion', 'Token incorrecto.')

  return successResponse()
}
export const validateActiveOperator = async () => {
  let responseOperator = await getThisOperator()
  if (responseOperator.error) throw responseOperator

  let responseActOperators = await getActiveOperators(getUserId())
  if (responseActOperators.error) throw responseActOperators

  let operator = responseOperator.data.operator
  let actOperators = responseActOperators.data.operators

  let isActOperator = actOperators.find((el) => el.patent == operator.patent)

  if (!isActOperator)
    return failResponse('Cerrar sesion', 'Operador no activo.')

  return successResponse()
}
//For deliveries - multiMap
export const validateOperatorRoute = async () => {
  let response = await getRoute()
  if (response.error) throw response

  if (response.status == 'fail')
    return failResponse('Iniciar ruta', 'Ruta no iniciada')

  return successResponse()
}
//For management/handle - management/info - management/singleMap
export const validateDeliverySelection = async () => {
  let response = getDeliveryId()
  if (!response)
    return failResponse(
      'Seleccionar entrega',
      'No se selecciono ninguna entrega.'
    )
  return successResponse()
}
export const validateDeliveryOwnerShip = async () => {
  let responseDeliveries = await getDeliveries()
  if (responseDeliveries.error) throw responseDeliveries

  let deliveryId = getDeliveryId()

  let isOwnerShip = responseDeliveries.data.deliveries.find(
    (el) => el.id == deliveryId
  )

  if (!isOwnerShip)
    return failResponse(
      'Seleccionar otra entrega',
      'El operador no contiene la entrega.'
    )

  return successResponse()
}
export const validateDeliveryManagement = async () => {
  let response = await getDeliveryDetail(getDeliveryId())
  if (response.error) throw response

  if (response.data.detail.managed)
    return failResponse(
      'Seleccionar otra entrega',
      'Esta entrega ya fue gestionada.'
    )

  return successResponse()
}
export const validateOrdersManagement = async () => {
  let response = await getDeliveryDetail(getDeliveryId())
  if (response.error) throw response

  if (response.data.detail.ordersManaged)
    return failResponse(
      `Volver a 'Gestion'`,
      'Ya se gestionaron los pedidos de esta entrega.'
    )

  return successResponse()
}

export const validateDeliveryEvidence = async () => {
  let response = await getDeliveryDetail(getDeliveryId())
  if (response.error) throw response

  if (response.data.detail.evidenced)
    return failResponse(
      `Volver a 'Gestion'`,
      'Ya se entrego evidencia de esta entrega.'
    )

  return successResponse()
}
