export const selectedBooksReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_SELECTED_BOOKS':
            return action.data
        default:
            return state
    }
}

export const setSelectedBooks = (selectedBooks) => {
    return {
        type: 'SET_SELECTED_BOOKS',
        data: selectedBooks
    }
}

export default selectedBooksReducer