import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Checkout from "../pages/Checkout";
import Profile from "../pages/profile"
import OrdersHistory from "../pages/OrdersHistory";
import DashBoard from "../pages/AdminLayout/Dashboard"
import ManageCategories from "../pages/AdminLayout/ManageCategories";
import ManageProducts from "../pages/AdminLayout/ManageProducts";
import ManageOrders from "../pages/AdminLayout/ManageOrders";
import ManageUsers from "../pages/AdminLayout/ManageUsers";
import TestCart from "../pages/TestCart";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/managecategories" element={<ManageCategories />} />
      <Route path="/manageproducts" element={<ManageProducts />} />
       <Route path="/manageorders" element={<ManageOrders/>} />
       <Route path="/manageusers" element={<ManageUsers/>} />
      <Route path="/ordershistory" element={<OrdersHistory />} />
      <Route path="/test-cart" element={<TestCart />} />

    </Routes>

  );
};

export default AppRoutes;
