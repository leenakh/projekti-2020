import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import bookReducer from './reducers/bookReducer'
import isbnReducer from './reducers/isbnReducer'
import copyReducer from './reducers/copyReducer'
import titleReducer from './reducers/titleReducer'

const reducer = combineReducers({
  books: bookReducer,
  isbn: isbnReducer,
  copy: copyReducer,
  title: titleReducer
})

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
