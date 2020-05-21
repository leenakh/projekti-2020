export const isbnReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_ISBN':
            return action.data
        default:
            return state
    }
}

export const setIsbn = (isbn) => {
    return {
        type: 'SET_ISBN',
        data: isbn
    }
}

export default isbnReducer