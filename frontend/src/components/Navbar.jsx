import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";

function Navbar() {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
    };

    return (
        <nav className="fixed mb-4 top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className=" mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-gray-800 hover:text-indigo-600 transition-colors"
                >
                    <span className="text-3xl">🛍️</span>
                    <span>AprilCart</span>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-4">

                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="px-5 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow hover:shadow-lg transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 shadow hover:shadow-lg transition-all duration-200"
                        >
                            Logout
                        </button>
                    )}

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                    >
                        <span className="text-xl">🛒</span>
                        <span className="font-medium text-gray-700">
                            Cart
                        </span>

                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-red-500 text-white text-xs font-bold shadow">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;