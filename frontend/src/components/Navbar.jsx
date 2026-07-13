import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";
import { useState } from "react";

function Navbar() {
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm shadow-slate-100/40">
  <div className="max-w- mx-auto px-8 h-16 flex items-center justify-between gap-4">

    {/* Left: Logo */}
    <Link
      to="/"
      className="flex items-center gap-2.5 text-xl font-black tracking-tight text-slate-900 group shrink-0"
    >
     <span className="text-3xl">🛍️</span>


      <span className="hidden sm:inline-block">
        April<span className="text-blue-600">Cart</span>
      </span>
    </Link>

    {/* Center: Search Bar */}
    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
      <div className="relative flex items-center w-full">
        <span className="absolute left-3.5 text-slate-400 pointer-events-none">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          type="text"
          placeholder="Search products, brands, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 placeholder-slate-400 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all"
        />
      </div>
    </form>

    {/* Right: Navigation Actions */}
    <div className="flex items-center gap-3 shrink-0">

{/* Wishlist Button */}
<Link
  to="/wishlist"
  className="relative flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all group/cart"
>
  <svg className="h-5 w-5 transition-transform group-hover/wishlist:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
  
  {/* Tiny Hover Text */}
  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-0 scale-95 group-hover/wishlist:opacity-100 group-hover/wishlist:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap shadow-sm z-10">
    Wishlist
  </span>
</Link>

{/* Cart Button */}
<Link
  to="/cart"
  className="relative flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all group/cart"
>
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>

  {cartCount > 0 && (
    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md shadow-blue-600/20">
      {cartCount}
    </span>
  )}

  {/* Tiny Hover Text */}
  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-medium px-2 py-0.5 rounded opacity-0 scale-95 group-hover/cart:opacity-100 group-hover/cart:scale-100 transition-all duration-150 pointer-events-none whitespace-nowrap shadow-sm z-10">
    Cart
  </span>
</Link>

      <span className="h-5 w-px bg-slate-200 hidden sm:block" />

      {/* Auth Action Buttons */}
      {!isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.98] transition-all shadow-md shadow-slate-900/5"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all"
        >
          Logout
        </button>
      )}

    </div>

  </div>
</nav>
    );
}

export default Navbar;