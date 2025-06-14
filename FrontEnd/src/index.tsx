import React from 'react'
import ReactDOM from 'react-dom/client'
import AppWrapper from './App'
import './i18n'
import { Provider } from 'react-redux'
import { store } from './redux/store'    // ← обязательно!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </React.StrictMode>
)
