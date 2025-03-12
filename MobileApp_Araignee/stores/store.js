import { configureStore } from '@reduxjs/toolkit'
import parametersReducer from './sliceParameters'
import screenReducer from './sliceScreen'

const store = configureStore({
  reducer: {
    parameters: parametersReducer,
    screen: screenReducer
  }
})

export default store