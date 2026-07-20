import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";
import { useState } from "react";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

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
    <div className="sticky top-0 z-50">
      {/* Top bar - Amazon navy */}
      <nav className="bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto px-4 h-[64px] flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 shrink-0 px-2 py-1 border border-transparent hover:border-white rounded"
          >
            <span className="text-2xl">🛍️</span>
            <span className="hidden sm:inline-block font-bold text-lg tracking-tight">
              April<span className="text-[#FF9900]">Cart</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-3xl hidden md:flex"
          >
            <div className="flex w-full rounded overflow-hidden bg-white">
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm text-slate-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#FF9900] hover:bg-[#e88a00] px-4 flex items-center justify-center transition-colors"
              >
                <svg
                  className="h-5 w-5 text-[#131921]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            {!isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs leading-tight border border-transparent hover:border-white rounded"
                >
                  <span className="block text-slate-300">Hello, sign in</span>
                  <span className="block font-bold">Account & Lists</span>
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 text-sm font-semibold bg-[#FF9900] text-[#131921] rounded hover:bg-[#e88a00] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((open) => !open)}
                  className="px-3 py-1.5 text-xs leading-tight border border-transparent hover:border-white rounded text-left"
                >
                  <span className="block text-slate-300">Welcome back</span>
                  <span className="block font-bold">Account ▾</span>
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-1 w-40 overflow-hidden rounded-md bg-white py-1 text-sm text-slate-800 shadow-lg">
                    <Link
                      onClick={() => setAccountOpen(false)}
                      to="/profile"
                      className="block px-4 py-2 hover:bg-slate-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      onClick={() => setAccountOpen(false)}
                      to="/profile#orders"
                      className="block px-4 py-2 hover:bg-slate-100"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left hover:bg-slate-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative px-3 py-1.5 border border-transparent hover:border-white rounded flex flex-col items-center"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-[10px] font-bold hidden sm:block">
                Wishlist
              </span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative px-3 py-1.5 border border-transparent hover:border-white rounded flex items-end gap-1"
            >
              <span className="relative">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF9900] text-[#131921] text-[11px] font-bold">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="text-sm font-bold hidden sm:block mb-0.5">
                Cart
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom bar - page links */}
      <nav className="bg-[#232F3E] text-white text-sm">
        <div className="max-w-[1500px] mx-auto px-4 h-10 flex items-center gap-5 overflow-x-auto no-scrollbar">
          <Link
            to="/"
            className="whitespace-nowrap font-semibold px-1 py-1 hover:text-[#FF9900] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="whitespace-nowrap px-1 py-1 hover:text-[#FF9900] transition-colors"
          >
            All Products
          </Link>
          <Link
            to="/wishlist"
            className="whitespace-nowrap px-1 py-1 hover:text-[#FF9900] transition-colors"
          >
            Wishlist
          </Link>
          <Link
            to="/about"
            className="whitespace-nowrap px-1 py-1 hover:text-[#FF9900] transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="whitespace-nowrap px-1 py-1 hover:text-[#FF9900] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
