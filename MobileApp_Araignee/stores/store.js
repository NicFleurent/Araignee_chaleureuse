import { configureStore } from '@reduxjs/toolkit'
import noteReducer from './sliceNote'

const store = configureStore({
  reducer: {
    note: noteReducer
  }
})

export default store