export const bookReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_BOOK':
            return action.data
        default:
            return state
    }
}

export const setBook = (book) => {
    return {
        type: 'SET_BOOK',
        data: book
    }
}

export default bookReducer