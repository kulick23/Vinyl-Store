import type React from "react"
import { Routes, Route } from "react-router-dom"
import HomePage from "../Pages/HomePage/HomePage"
import AboutPage from "../Pages/AboutPage/AboutPage"
import ContactPage from "../Pages/ContactPage/ContactPage"
import PolicyPage from "../Pages/PolicyPage/PolicyPage"
import ShopPage from "../Pages/ShopPage/ShopPage"
import ProductPage from "../Pages/ProductPage/ProductPage"
import LoginPage from "../Pages/LoginPage/LoginPage"
import SignupPage from "../Pages/SignupPage/SignupPage"
import ProfilePage from "../Pages/ProfilePage/ProfilePage"
import CartPage from "../Pages/CartPage/CartPage"
import WishlistPage from "../Pages/WishlistPage/WishlistPage"
import AdminPage from "../Pages/AdminPage/AdminPage"
import SellerPage from "../Pages/SellerPage/SellerPage"
import ApprovalPage from "../Pages/ApprovalPage/ApprovalPage"
import ForgotPasswordPage from "../Pages/ForgotPasswordPage/ForgotPasswordPage"
import ResetPasswordPage from "../Pages/ResetPasswordPage/ResetPasswordPage"
import CheckoutPage from "../Pages/CheckoutPage/CheckoutPage"

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset" element={<ResetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/seller/*" element={<SellerPage />} />
      <Route path="/approval" element={<ApprovalPage />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  )
}
