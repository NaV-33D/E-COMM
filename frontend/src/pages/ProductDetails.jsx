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
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
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
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!product) {
    return <div>No product found</div>;
  }

  const handleAddToCart = () => {
    if(!localStorage.getItem('access_token')){
      window.location.href = '/login';
      return;
    }
    addToCart(product.id);
  }
  return (
 <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-100 pt-28 pb-16 px-6">
    <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

            <div className="grid grid-cols-1 lg:grid-cols-2">

               
                <div className="bg--50 flex items-center justify-center p-8">
                    <img
                        src={`${BASEURL}${product.image}`}
                        alt={product.name}
                        className="w-full max-w-md h-[450px] object-contain hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <div className="p-10 flex flex-col justify-center">


                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 leading-7 text-lg mb-8">
                        {product.description}
                    </p>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-bold text-green-600">
                            ${product.price}
                        </span>

                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">

                        <button
                            onClick={handleAddToCart}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            🛒 Add to Cart
                        </button>

                        <a
                            href="/"
                            className="border border-gray-300 px-8 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition text-center"
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