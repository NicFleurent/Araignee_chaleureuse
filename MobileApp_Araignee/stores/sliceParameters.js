import { createSlice } from "@reduxjs/toolkit";

const parametersSlice = createSlice({
  name: "sliceParameters",
  initialState: {
    temperature_humidity_unit:undefined,
    darkmode:false
  },
  reducers: {
    setTemperatureHumidityUnit: (state, action) => {
      state.temperature_humidity_unit = action.payload
    },
    setDarkMode: (state, action) => {
      state.darkmode = action.payload
    },
  },
});

export const { 
  setTemperatureHumidityUnit,
  setDarkMode 
} = parametersSlice.actions;

export default parametersSlice.reducer;