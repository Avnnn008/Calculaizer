import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
   usersCount: 0,
   errorsCount: 0
}, 
  reducers: {
    setCounts: (state, action) => {
       state.usersCount = action.payload.usersCount
       state.errorsCount = action.payload.errorsCount
    }
  }
});

export const {setCounts} = adminSlice.actions;