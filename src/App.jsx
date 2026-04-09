import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/user/Home';
import Products from './pages/user/Products';
import ProductDetail from './pages/user/ProductDetail';
import CartPage from './pages/user/CartPage';
import Checkout from './pages/user/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/user/Orders';
import OrderTracking from './pages/user/OrderTracking';
import Profile from './pages/user/Profile';
import Rent from './pages/user/Rent';
import BecomeSeller from './pages/user/BecomeSeller';
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerLayout from './components/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import ManageProducts from './pages/seller/ManageProducts';
import AddProduct from './pages/seller/AddProduct';
import SellerSettings from './pages/seller/SellerSettings';
import AIStylist from './components/AIStylist';
import Footer from './components/Footer';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="app-main" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/shop" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id/track" element={<OrderTracking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/become-seller" element={<BecomeSeller />} />

              {/* Seller Dashboard Routes */}
              <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboard />} />
                <Route path="products" element={<ManageProducts />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="settings" element={<SellerSettings />} />
              </Route>

              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <AIStylist />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
