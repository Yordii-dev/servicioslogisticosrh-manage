import { successResponse, errorResponse } from '../helpers/methodResponse'
import {
  validateUserId,
  validateOperatorTk,
  validateActiveOperator,
  validateOperatorRoute,
  validateDeliverySelection,
  validateDeliveryOwnerShip,
  validateDeliveryManagement,
} from './validateParts'

//Controllers       -> Models
//validateHandlePage -> validateParts

const validateHandlePage = async () => {
  try {
    //Pages to return
    let login = {
      name: 'login',
      params: { userId: localStorage.getItem('userId') },
    }
    let route = { name: 'route' }
    let delivery = { name: 'deliveries' }

    //Validar user
    let validateUser = validateUserId()
    if (validateUser.status == 'fail')
      return { validate: validateUser, pageToReturn: login }

    //Validate operator token
    let validateOperator = await validateOperatorTk()
    if (validateOperator.status == 'fail')
      return { validate: validateOperator, pageToReturn: login }

    //Validate active operator
    let validateActOperator = await validateActiveOperator()
    if (validateActOperator.status == 'fail')
      return { validate: validateActOperator, pageToReturn: login }

    //Validate operator route
    let validateRoute = await validateOperatorRoute()
    if (validateRoute.status == 'fail')
      return { validate: validateRoute, pageToReturn: route }

    //Validate delivery selection
    let validateDeliverySelecti = await validateDeliverySelection()
    if (validateDeliverySelecti.status == 'fail')
      return { validate: validateDeliverySelecti, pageToReturn: delivery }

    //Validate delivery ownership of operator
    let validateDeliveryOwnerSh = await validateDeliveryOwnerShip()
    if (validateDeliveryOwnerSh.status == 'fail')
      return { validate: validateDeliveryOwnerSh, pageToReturn: delivery }

    //Validate managed delivery
    let validateDeliveryManagem = await validateDeliveryManagement()
    if (validateDeliveryManagem.status == 'fail')
      return { validate: validateDeliveryManagem, pageToReturn: delivery }

    return { validate: successResponse() }
  } catch (error) {
    return error.statusText ? error : errorResponse(`Al validar pagina handle`)
  }
}

export { validateHandlePage }
