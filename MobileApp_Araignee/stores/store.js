import { configureStore } from '@reduxjs/toolkit'
import parametersReducer from './sliceParameters'

const store = configureStore({
  reducer: {
    parameters: parametersReducer
  }
})

export default store