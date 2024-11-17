import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./ReduxToolkit/store.js";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register";
import PrivateRoute from "./Components/PrivateRoute";
import Profile from "./pages/User/Profile";
import AdminRoute from "./pages/Admin/AdminRoute";
import UserList from "./pages/Admin/UserList";
import CategoryList from "./pages/Admin/CategoryList.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* {User Routes} */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* {Admin Routes} */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
