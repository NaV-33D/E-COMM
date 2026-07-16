import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const BASEURL = import.meta.env.VITE_BASE_URL;

  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  return (
    <div className="min-h-screen bg-[#EAEDED] p-8">
      <h1 className="text-2xl font-bold text-[#0F1111] mb-6 max-w-5xl mx-auto">
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="max-w-5xl mx-auto bg-white rounded-lg border border-gray-200 p-12 text-center">
          {/* <div className="text-5xl mb-3">💛</div> */}
          <p className="text-gray-600">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="inline-block mt-4 px-6 py-2.5 bg-[#FF9900] text-[#131921] font-semibold rounded hover:bg-[#e88a00] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b last:border-b-0 py-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={`${BASEURL}${item.product_image}`}
                  alt={item.product_name}
                  className="w-20 h-20 rounded object-cover border border-gray-200"
                />
                <div className="min-w-0">
                  <h2 className="font-semibold text-[#0F1111] truncate">
                    {item.product_name}
                  </h2>
                  <p className="text-[#B12704] font-semibold">
                    ${item.product_price}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => addToCart(item.product)}
                  className="px-4 py-2 text-sm font-semibold bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#FCD200] rounded-full transition-colors"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-100 rounded-full hover:bg-red-100 transition-colors"
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