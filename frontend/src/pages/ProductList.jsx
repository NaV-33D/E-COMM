import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";


function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASEURL = import.meta.env.VITE_BASE_URL
//   console.log(BASEURL)
    useEffect(() => {
      fetch(`${BASEURL}api/products/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching products:", err);
            setError(err.message || "Failed to fetch data");
            setLoading(false);
        });
        
    }, [])
    // console.log("Fetched products:", products);
    // console.log(data)
  
    
    if (loading) {
        return <div>Loading...</div>;
      }

      if (error) {
        return <div>Error: {error}</div>;
      }
      
      return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-100 pt-24">


    <div className="max-w-7xl mx-auto px-6 text-center mb-12">

     

        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Discover Your
            <span className="text-indigo-600"> Perfect Products</span>
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-gray-600 text-lg">
            Browse our carefully selected collection of premium products with
            quality you can trust and prices you'll love.
        </p>

    </div>

    <div className="max-w-7xl mx-auto px-6 pb-16">

        <div className="flex items-center justify-between mb-8">
            {/* <h2 className="text-2xl font-bold text-gray-800">
                Featured Products
            </h2> */}

            <div className="h-[2px] flex-1 bg-gray-200 ml-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {products.length > 0 ? (
                products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-24">
                    <div className="text-6xl mb-4">📦</div>

                    <h3 className="text-2xl font-semibold text-gray-700">
                        No Products Available
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Please check back later for new arrivals.
                    </p>
                </div>
            )}

        </div>

    </div>

</div>
      );
    }
    
export default ProductList;

