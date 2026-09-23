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
import Checkout from "../pages/Checkout/Checkout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Orders from "../pages/Orders/Orders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";
import Notifications from "../pages/Notifications/Notifications";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>

          {/* ==========================================
              PUBLIC ROUTES
          ========================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ==========================================
              PROTECTED ROUTES
          ========================================== */}

          <Route element={<ProtectedRoute />}>

            {/* Products */}
            <Route
              path="/products"
              element={<Products />}
            />

            {/* Product Details */}
            <Route
              path="/products/:productId"
              element={<ProductDetails />}
            />

            {/* Cart */}
            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* Checkout */}
            <Route
              path="/checkout"
              element={<Checkout />}
            />

            {/* Orders */}
            <Route
              path="/orders"
              element={<Orders />}
            />

            {/* Order Details */}
            <Route
              path="/orders/:orderId"
              element={<OrderDetails />}
            />

            {/* Notifications */}
            <Route
              path="/notifications"
              element={<Notifications />}
            />

          </Route>

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default AppRoutes;