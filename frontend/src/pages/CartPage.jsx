import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const BASEURL = import.meta.env.VITE_BASE_URL;

    return (
        <div className="min-h-screen bg-[#EAEDED] py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-[#0F1111] max-w-5xl mx-auto"> Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-12 text-center">
                    {/* <div className="text-5xl mb-3">🛒</div> */}
                    <p className="text-gray-600">Your cart is empty.</p>
                    <Link
                        to="/products"
                        className="inline-block mt-4 px-6 py-2.5 bg-[#FF9900] text-[#131921] font-semibold rounded hover:bg-[#e88a00] transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 py-4 border-b last:border-b-0"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {item.product_image && (
                                    <img
                                        src={`${BASEURL}${item.product_image}`}
                                        alt={item.product_name}
                                        className="w-20 h-20 object-cover rounded border border-gray-200"
                                    />
                                )}
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-[#0F1111] truncate">
                                        {item.product_name}
                                    </h2>
                                    <p className="text-[#B12704] font-semibold">
                                        ${item.product_price}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center border border-gray-300 rounded">
                                    <button
                                        className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                                    <button
                                        className="px-3 py-1 text-gray-700 hover:bg-gray-100"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4 mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <span className="text-gray-600">Subtotal: </span>
                            <span className="text-xl font-bold text-[#0F1111]">${total.toFixed(2)}</span>
                        </div>
                        <Link
                            to="/checkout"
                            className="bg-[#FF9900] text-[#131921] px-8 py-2.5 rounded font-semibold hover:bg-[#e88a00] transition-colors text-center"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;