import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { setPage } from "../redux/navigationSlice";
import { setNotice } from "../redux/appSlice";

export const useHttp = () => {
  const dispatch = useDispatch();
  const [loading, setLoadind] = useState(false);

  const request = async (url, method = "GET", body = null, headers = {}) => {
    setLoadind(true);
    url = '/api'+url
    try {
      if (
        !localStorage.getItem("adminAccess") &&
        localStorage.getItem("access_expires_in") &&
        parseInt(localStorage.getItem("access_expires_in")) < Date.now()
      ) {
        const refresh = await fetch("/api/auth/refresh", { method: "GET" });
        const refreshData = await refresh.json();
        if (!refresh.ok) {
          throw new Error(refreshData.message || "Что-то пошло не так");
        }
        localStorage.setItem(
          "refresh_expires_in",
          refreshData.refresh_expires_in
        ); /*Обновленное время окончания жизни refresh token */
        localStorage.setItem(
          "access_expires_in",
          refreshData.access_expires_in
        ); /* Обновленное время окончания жизни access token */
      }

      if (
        /admin/.test(url) &&
        localStorage.getItem("adminAccess") &&
        parseInt(localStorage.getItem("adminAccess")) < Date.now()
      ) {
        const adminRefresh = await fetch("/api/admin/refresh");
        const adminRefreshData = await adminRefresh.json();
        if (!adminRefresh.ok) {
          throw new Error(adminRefreshData.message || "Что-то пошло не так");
        }
        localStorage.setItem("adminAccess", adminRefreshData.access);
      }

      if (body && !(body instanceof FormData)) {
        body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(url, { method, body, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Что-то пошло не так");
      } 

        setLoadind(false);
      return data;
      
    } catch (e) {
      /* Ошибка берется из throw new Error, e: Error: data.message||Что-то пошло не так, выводится e.message */
      setLoadind(false);
      dispatch(setNotice(e.message));
      if (/Время сессии истекло|не авторизован/.test(e.message)) {
        dispatch(logout());
        dispatch(setPage("auth"));
      }
      throw e  /* Без этого не будет выводиться сообщение об ошибке */
    }
  };
  return { loading, request };
};
