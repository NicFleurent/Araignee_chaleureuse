import { createSlice } from "@reduxjs/toolkit";

const screenSlice = createSlice({
  name:"sliceScreen",
  initialState:{
    isTablet:false,
    width:0,
    height:0
  },
  reducers:{
    defineScreen:(state, action) => {
      state.width = action.payload.width;
      state.height = action.payload.height;
      if(action.payload.width > 500)
        state.isTablet = true;
      else
        state.isTablet = false;
    }
  }
})

export const { 
  defineScreen
} = screenSlice.actions;

export default screenSlice.reducer;