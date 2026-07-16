import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_BASE_URL;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] px-8 py-3 rounded-full font-semibold border border-[#FCD200] shadow-sm transition-colors"
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
      </div>
    </div>
  );
}

export default ProductDetails;