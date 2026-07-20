import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import StarRating from "./StarRating";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_BASE_URL;
const {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
} = useCart();
const isWishlisted = wishlistItems.some(
    item => item.product === product.id
);

const toggleWishlist = (e) => {
    e.preventDefault();

    if (isWishlisted) {

        const item = wishlistItems.find(
            item => item.product === product.id
        );

        removeFromWishlist(item.id);

    } else {

        addToWishlist(product.id);

    }
};

  return (
    <Link to={`/product/${product.id}`}>
      {/* Added 'relative' and 'group' here */}
      <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 cursor-pointer group">
        
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
          aria-label="Add to wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            className={`w-5 h-5 transition-colors duration-200 ${
              isWishlisted ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        <img
          src={`${BASEURL}${product.image}`}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        {product.stock_quantity === 0 && (
          <span className="absolute left-6 top-6 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">Out of Stock</span>
        )}
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>
        <p className="text-gray-600 font-medium">${product.price}</p>
        <StarRating value={product.average_rating} size="sm" />
      </div>
    </Link>
  );
}

export default ProductCard;
