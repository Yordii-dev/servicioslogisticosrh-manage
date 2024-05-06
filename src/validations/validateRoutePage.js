import { successResponse, errorResponse } from '../helpers/methodResponse'
import {
  validateUserId,
  validateOperatorTk,
  validateActiveOperator,
} from './validateParts'

//Controllers       -> Models
//ValidateRoutePage -> validatePage

const validateRoutePage = async () => {
  try {
    //Pages to return
    let login = {
      name: 'login',
      params: { userId: localStorage.getItem('userId') },
    }

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

    return { validate: successResponse() }
  } catch (error) {
    return error.statusText ? error : errorResponse(`Al validar pagina de ruta`)
  }
}

export { validateRoutePage }
