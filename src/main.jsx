import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./styles.css";
import Admin from "./Admin";
import CreateReport from "./components/TextCalculator/createReport";

const router = createBrowserRouter([
  { path: "/admin", element: <Admin/>, loader: async()=> {
    let response = await fetch('/admin/checking', {method : 'GET'})
    if (!response.ok) {
      throw new Error
    } else return true
  }, errorElement:  <Navigate to="/" /> },
  {path: '/textcalcreport', element: <CreateReport/>},
  { path: "/", element: <App /> },
  { path: "*", element: <Navigate to="/" /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
