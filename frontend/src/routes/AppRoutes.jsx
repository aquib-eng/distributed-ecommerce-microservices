import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Orders from "../pages/Orders/Orders";
import Notifications from "../pages/Notifications/Notifications";

function AppRoutes() {
  return (
    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:productId"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>
  );
}

export default AppRoutes;