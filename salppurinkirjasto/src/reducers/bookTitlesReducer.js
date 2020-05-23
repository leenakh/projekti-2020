export const bookTitlesReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_BOOK_TITLES':
            return action.data
        default:
            return state
    }
}

export const setBookTitles = (bookTitles) => {
    return {
        type: 'SET_BOOK_TITLES',
        data: bookTitles
    }
}

export default bookTitlesReducer