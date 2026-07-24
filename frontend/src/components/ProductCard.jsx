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
  <div className="relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-3 cursor-pointer group">

    {/* Wishlist Button */}
    <button
      onClick={toggleWishlist}
      className="absolute top-2 right-2 z-10 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Add to wishlist"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isWishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        className={`w-5 h-5 transition-colors ${
          isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
        }`}  
      >
        
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>

    {/* Image */}
    <div className="relative h-48 mb-3 flex items-center justify-center">
      <img
        src={`${BASEURL}${product.image}`}
        alt={product.name}
        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
      />
      {product.stock_quantity === 0 && (
        <span className="absolute left-0 top-0 rounded bg-gray-800 px-2 py-0.5 text-[11px] font-semibold text-white">
          Out of Stock
        </span>
      )}
    </div>

    {/* Title */}
    <h2 className="text-sm text-gray-800 line-clamp-2 mb-1 leading-snug hover:text-orange-600">
      {product.name}
    </h2>

    {/* Rating */}
    <div className="flex items-center gap-1 mb-1">
      <StarRating value={product.average_rating} size="sm" />
      {product.rating_count > 0 && (
        <span className="text-xs text-blue-600">({product.rating_count})</span>
      )}
    </div>

    {/* Price - Amazon style with superscript currency and decimals */}
    <div className="flex items-baseline gap-1">
      <span className="text-xs align-top mt-0.5 text-gray-900">$</span>
      <span className="text-xl font-medium text-gray-900">
        {Math.floor(product.price)}
      </span>
      <span className="text-xs text-gray-900 self-start mt-0.5">
        {(product.price % 1).toFixed(2).slice(2)}
      </span>
    </div>

  </div>
</Link>
  );
}

export default ProductCard;
