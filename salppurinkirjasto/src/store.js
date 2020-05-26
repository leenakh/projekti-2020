import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import booksReducer from './reducers/booksReducer'
import isbnReducer from './reducers/isbnReducer'
import copyReducer from './reducers/copyReducer'
import titleReducer from './reducers/titleReducer'
import bookReducer from './reducers/bookReducer'
import messageReducer from './reducers/messageReducer'
import errorMessageReducer from './reducers/errorMessageReducer'
import customerReducer from './reducers/customerReducer'
import selectedBooksReducer from './reducers/selectedBooksReducer'
import bookTitlesReducer from './reducers/bookTitlesReducer'

const reducer = combineReducers({
    books: booksReducer,
    isbn: isbnReducer,
    copy: copyReducer,
    title: titleReducer,
    book: bookReducer,
    message: messageReducer,
    errorMessage: errorMessageReducer,
    customer: customerReducer,
    selectedBooks: selectedBooksReducer,
    bookTitles: bookTitlesReducer
})

const store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
)

store.subscribe(() => {
    const storeNow = store.getState()
    console.log(storeNow)
})

export default store