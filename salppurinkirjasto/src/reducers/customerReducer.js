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

export default customerReducer