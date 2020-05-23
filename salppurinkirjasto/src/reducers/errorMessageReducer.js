export const errorMessageReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_ERRORMESSAGE':
            return action.data
        default:
            return state
    }
}

export const setErrorMessage = (errorMessage) => {
    return {
        type: 'SET_ERRORMESSAGE',
        data: errorMessage
    }
}

export default errorMessageReducer