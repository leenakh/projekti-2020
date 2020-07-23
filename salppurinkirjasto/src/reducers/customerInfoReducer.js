import customerService from '../services/customers'

export const customerInfoReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_CUSTOMER_INFO':
            return action.data
        case 'INITIAL_CUSTOMERS':
            return action.data
        default:
            return state
    }
}

export const setCustomers = (customers) => {
    return {
        type: 'SET_CUSTOMER_INFO',
        data: customers
    }
}

export const getCustomers = () => {
    return async dispatch => {
        try {
            const customers = await customerService.getAll()
            dispatch({
                type: 'INITIAL_CUSTOMERS',
                data: customers
            })
        } catch (exception) {
            console.log('Asiakkaiden hakeminen ei onnistunut.')
        }
    }
}

export default customerInfoReducer