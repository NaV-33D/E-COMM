import React from 'react'
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivateRouter from './components/PrivateRouter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Categories from "./admin/pages/Categories";
import Users from "./admin/pages/Users";
import Orders from "./admin/pages/Orders";
import AdminPrivateRouter from "./components/AdminPrivateRouter";
import Wishlist from './pages/Wishlist';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import { Toaster } from "react-hot-toast";

const StoreLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
};

const App = () => {
  return (
    
    <Router>
        <Toaster position="top-center" />

      <Routes>
        {/* Public & Protected Storefront Routes (They get the Store Navbar) */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          
          <Route element={<PrivateRouter />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        {/* Auth Routes (No Navbar at all) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AdminPrivateRouter />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;