import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const BASEURL = import.meta.env.VITE_BASE_URL;

  const {
    wishlistItems,
    removeFromWishlist,
    addToCart,
  } = useCart();

  return (
    <div className="pt-20 min-h-screen bg-gray-100 p-8 mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-600">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">

          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">

                <img
                  src={`${BASEURL}${item.product_image}`}
                  alt={item.product_name}
                  className="w-20 h-20 rounded object-cover"
                />

                <div>
                  <h2 className="text-lg font-semibold">
                    {item.product_name}
                  </h2>

                  <p className="text-gray-600">
                    ${item.product_price}
                  </p>
                </div>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => addToCart(item.product)}
          className="px-4 py-2 text-sm font-semibold bg-gray-100 text-green-600 border border-green-100 rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item.id)}
          className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all"
                >
                  Remove
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Wishlist;