import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { authFetch, getAccessToken } from "../utils/auth";
import StarRating from "../components/StarRating";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_BASE_URL;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch product details");
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    fetch(`${BASEURL}/api/products/${id}/reviews/`)
      .then((response) => response.json())
      .then(setReviews)
      .catch(() => setReviews([]));

    if (getAccessToken()) {
      authFetch(`${BASEURL}/api/me/`)
        .then((response) => response.ok ? response.json() : null)
        .then((user) => setCurrentUserId(user?.id ?? null));
    }
  }, [id, BASEURL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center text-red-600">Error: {error}</div>;
  }
  if (!product) {
    return <div className="min-h-screen bg-[#EAEDED] flex items-center justify-center text-gray-600">No product found</div>;
  }

  const handleAddToCart = () => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }
    addToCart(product.id);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!getAccessToken()) {
      window.location.href = "/login";
      return;
    }
    if (!rating) {
      toast.error("Choose a star rating first");
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await authFetch(`${BASEURL}/api/products/${id}/reviews/`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit your review");
      setReviews((current) => [data, ...current]);
      setProduct((current) => ({ ...current, average_rating: null }));
      setRating(0);
      setComment("");
      toast.success("Review submitted");
    } catch (submitError) {
      toast.error(submitError.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : product.average_rating;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="min-h-screen bg-[#EAEDED] py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            <div className="flex items-center justify-center p-8 bg-white">
              <img
                src={`${BASEURL}${product.image}`}
                alt={product.name}
                className="w-full max-w-md h-[420px] object-contain"
              />
            </div>

            <div className="p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-200">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#0F1111] mb-3">
                {product.name}
              </h1>

              <p className="text-gray-600 leading-7 mb-6">
                {product.description}
              </p>

              <div className="mb-2 text-sm text-gray-600">Price:</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-lg text-[#B12704]">$</span>
                <span className="text-3xl font-semibold text-[#B12704]">
                  {product.price}
                </span>
              </div>

              <div className={`mb-6 inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${isOutOfStock ? "bg-red-100 text-red-700" : product.stock_quantity <= 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>
                {isOutOfStock ? "Out of Stock" : product.stock_quantity <= 5 ? `Only ${product.stock_quantity} left` : "In Stock"}
              </div>
              <StarRating value={averageRating} />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 text-[#0F1111] px-8 py-3 rounded-full font-semibold border border-[#FCD200] shadow-sm transition-colors"
                >
                  Add to Cart
                </button>

                <a
                  href="/"
                  className="border border-gray-300 px-8 py-3 rounded-full font-medium text-gray-700 hover:bg-gray-100 transition text-center"
                >
                  ← Back to Home
                </a>
              </div>
            </div>

          </div>
        </div>

        <section className="mt-8 rounded-lg border border-gray-200 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[#0F1111]">Customer reviews</h2>
            <StarRating value={averageRating} />
          </div>

          {getAccessToken() && !reviews.some((review) => review.user === currentUserId) && (
            <form onSubmit={handleReviewSubmit} className="mt-6 rounded-lg bg-slate-50 p-4">
              <label className="mb-2 block text-sm font-medium text-slate-700">Your rating</label>
              <StarRating value={rating} onChange={setRating} />
              <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share your experience (optional)" className="mt-3 w-full rounded-md border border-slate-300 p-3 text-sm focus:border-[#FF9900] focus:outline-none" rows="3" />
              <button disabled={submittingReview} className="mt-3 rounded-full bg-[#FFD814] px-5 py-2 text-sm font-semibold text-[#0F1111] disabled:opacity-60">
                {submittingReview ? "Submitting..." : "Submit review"}
              </button>
            </form>
          )}

          <div className="mt-6 space-y-4">
            {reviews.length ? reviews.map((review) => (
              <article key={review.id} className="border-t border-slate-200 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-800">{review.username}</span>
                  <StarRating value={review.rating} size="sm" />
                </div>
                {review.comment && <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>}
              </article>
            )) : <p className="mt-6 text-sm text-slate-500">No reviews yet. Be the first to share your experience.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;
