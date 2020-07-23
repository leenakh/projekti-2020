import customerService from '../services/customers'

export const customerReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_CUSTOMER':
            return action.data
        default:
            return state
    }
}

export const setCustomer = (customer) => {
    return {
        type: 'SET_CUSTOMER',
        data: customer
    }
}

export const fetchCustomer = (customer) => {
    return async dispatch => {
        try {
            const requestedCustomer = await customerService.search(customer)
            dispatch(setCustomer(customer))
            if (requestedCustomer.length === 0) {
                dispatch(createCustomer(customer))
            }
        } catch (exception) {
        }
    }
}

export const createCustomer = (customer) => {
    return async dispatch => {
        try {
            await customerService.create({
                username: customer
            })
            dispatch(setCustomer(customer))
        } catch (exception) {

        }
    }
}

export default customerReducer