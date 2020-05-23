export const booksReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_BOOKS':
            return action.data
        case 'NEW_BOOK':
            return [...state, action.data]
        default:
            return state
    }
}

export const createBook = (book) => {
    return {
        type: 'NEW_BOOK',
        data: book
    }
}

export const setBooks = (books) => {
    return {
        type: 'SET_BOOKS',
        data: books
    }
}

export default booksReducer