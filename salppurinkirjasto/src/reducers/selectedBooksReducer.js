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

export const filterSelectedBooks = (selectedBooks, changedBook) => {
    return async dispatch => {
        const books = selectedBooks.map(b => b.id !== changedBook.id ? b : changedBook)
        dispatch({
            type: 'SET_SELECTED_BOOKS',
            data: books
        })
    }
}

export default selectedBooksReducer