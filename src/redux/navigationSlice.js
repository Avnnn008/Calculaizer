import { createSlice } from "@reduxjs/toolkit";
import { APP_PAGES } from "../constants";

/* Состояния навигации.
page - выбранная страница приложения.
updating - увеличивается на 1 при повторном открытии текущей страницы для ее обновления.
component - выбранный компонент на странице (в калькуляторах - вид калькулятора).*/

export const navigationSlice = createSlice({
  name: "navigation",
  initialState: {
   page: APP_PAGES.MAIN,
   updating: 0,
   component: null,
},
  reducers: {
    setPage: (state, action) => {
      if (state.page === action.payload) {
        state.updating +=1
      } else {
        state.page = action.payload
        state.updating = 0
      }
           
    },
    setComponent: (state, action) => {
        state.component = action.payload
    },
  },
});

export const {setPage, setComponent} = navigationSlice.actions;