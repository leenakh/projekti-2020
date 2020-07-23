import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import './index.css'
import App from './App'
import 'react-app-polyfill/stable'
import Container from '@material-ui/core/Container'

ReactDOM.render(
  
  <Provider store={store}>
    <Container>
    <App />
    </Container>
  </Provider>,
  document.getElementById('root')
  
)
