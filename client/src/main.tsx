import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import {store} from "../src/redux/store.ts"
import ToastProvider from './context/ToastContext.tsx'
import { LoadingProvider } from './context/LoadingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <LoadingProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LoadingProvider>
  </Provider>
)