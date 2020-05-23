import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
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

const store = createStore(reducer)

store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
