import { configureStore} from "@reduxjs/toolkit";
import { getProfilePageData, userInfoSlice } from "./userInfoSlice";
import { authSlice } from "./authSlice";
import { navigationSlice } from "./navigationSlice";
import { calcSlice } from "./calcSlice";
import { appSlice } from "./appSlice";
import { adminSlice } from "./adminSlice";


export const store = configureStore({
    reducer: {
        userInfoReducer : userInfoSlice.reducer,
        authReducer: authSlice.reducer,
        navReducer: navigationSlice.reducer,
        calcReducer: calcSlice.reducer,
        appReducer: appSlice.reducer,
        adminReducer: adminSlice.reducer
        },
        middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
          }),

})