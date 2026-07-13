import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const CAROUSEL_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070",
    title: "Mega Summer Sale",
    subtitle: "Up to 50% OFF on all premium categories",
    badge: "Limited Time Offer"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015",
    title: "Upgrade Your Tech Workspace",
    subtitle: "Premium mechanical keyboards & ergonomic office setups",
    badge: "New Arrivals"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070",
    title: "Step Up Your Fashion Game",
    subtitle: "Discover modern vintage denims & stylish activewear",
    badge: "Trending Now"
  }
];

  
function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const BASEURL = import.meta.env.VITE_BASE_URL;
  const searchQuery = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  // Fetch categories
  useEffect(() => {
    fetch(`${BASEURL}api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch products with search and category filters
  useEffect(() => {
    setLoading(true);
    let url = `${BASEURL}api/products/`;
    const params = new URLSearchParams();

    if (searchQuery) params.append("search", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    fetch(url)
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
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set("category", categoryId);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };
    
  if (error) {
    return <div className="text-center pt-20 text-red-600">Error: {error}</div>;
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-100 pt-16">

        <div className="relative w-full h-[400px] md:h-[600px] 2xl:h-[700px] bg-slate-900 overflow-hidden shadow-md mb-12">
        
        {/* Slides Container */}
        <div className="relative w-full h-full">
          {CAROUSEL_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Slide Background Image */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover object-center brightness-[0.4]"
              />
              
              {/* Floating Slide Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center px-12 md:px-24 text-white max-w-4xl">
                <span className="inline-block self-start px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-indigo-600 rounded-full">
                  {slide.badge}
                </span>
                <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-base md:text-xl text-slate-200 font-medium max-w-xl mb-6 drop-shadow">
                  {slide.subtitle}
                </p>
                <button className="self-start px-6 py-3 font-semibold text-sm bg-white text-slate-900 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Shop Catalog
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow Controller */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors"
        >
          ❮
        </button>

        {/* Right Arrow Controller */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors"
        >
          ❯
        </button>

        {/* Bottom Navigation Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {CAROUSEL_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-indigo-500" : "w-2.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

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

      {/* Filters Section (Amazon-style sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Sidebar - Filters */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">
                Categories
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg transition ${
                    !selectedCategory
                      ? "bg-indigo-100 text-indigo-900 font-semibold"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`block w-full text-left px-4 py-2.5 rounded-lg transition ${
                      selectedCategory === cat.id.toString()
                        ? "bg-indigo-100 text-indigo-900 font-semibold"
                        : "text-gray-700 hover:bg-slate-100"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-4">
          {/* Search Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
              </h2>
              {selectedCategory && (
                <p className="text-sm text-gray-600 mt-1">
                  Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                </p>
              )}
            </div>
            {/* <div className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </div> */}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600 font-medium">Loading products...</p>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-semibold text-gray-700">
                No Products Found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filters
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

    </div>

</div>
      );
    }
    
export default ProductList;

