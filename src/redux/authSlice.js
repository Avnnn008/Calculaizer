import { createSlice } from "@reduxjs/toolkit";

/* Хранит информацию об авторизации пользователя, редьюсеры входа в систему и выхода */
export const authSlice = createSlice({
  name: "auth",
  initialState: {
   isAuth: false}, /* авторизован ли пользователь */
  reducers: {
    login : (state) => {
      state.isAuth = true    
    },
    logout : (state) => {
        state.isAuth = false
        localStorage.removeItem('refresh_expires_in')
        localStorage.removeItem('access_expires_in')
      }
  },
});

export const {login, logout} = authSlice.actions;