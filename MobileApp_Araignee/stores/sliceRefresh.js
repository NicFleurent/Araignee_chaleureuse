import { createSlice } from "@reduxjs/toolkit";

const refreshSlice = createSlice({
  name:"sliceRefresh",
  initialState:{
    refreshHome:false,
  },
  reducers:{
    setRefreshHome:(state, action) => {
      state.refreshHome = action.payload;
    }
  }
})

export const { 
  setRefreshHome
} = refreshSlice.actions;

export default refreshSlice.reducer;