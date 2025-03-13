import { configureStore } from '@reduxjs/toolkit'
import parametersReducer from './sliceParameters'
import screenReducer from './sliceScreen'
import refreshReducer from './sliceRefresh'

const store = configureStore({
  reducer: {
    parameters: parametersReducer,
    screen: screenReducer,
    refresh: refreshReducer
  }
})

export default store