import { createSlice } from "@reduxjs/toolkit";
import { getProfilePageData } from "./userInfoSlice";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    notice: "",
    confirmation: {
        text: '',
        function: ()=>{}
    } /* текст и функция подтверждения */,
  },
  reducers: {
    setNotice: (state, action) => {
      state.notice = action.payload;
    },
    setConfirmation: (state, action) => {
        state.confirmation = {...action.payload}
    },
    resetModal: (state) => {
      state.notice = "";
      state.confirmation = {
        text: '',
        function: ()=>{}
    };
    },
  },
  extraReducers (builder) {
    builder.addCase(getProfilePageData.rejected, (state, action) => {
      state.notice = action.error.message
    })
  }
});

export const { setNotice, resetModal, setConfirmation } = appSlice.actions;