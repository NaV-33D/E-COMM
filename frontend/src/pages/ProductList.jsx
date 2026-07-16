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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

  useEffect(() => {
    fetch(`${BASEURL}api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `${BASEURL}api/products/`;
    const params = new URLSearchParams();

    if (searchQuery) params.append("search", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    if (categoryId) newParams.set("category", categoryId);
    else newParams.delete("category");
    setSearchParams(newParams);
  };

  const handleClearFilters = () => setSearchParams({});

  if (error) {
    return <div className="text-center pt-20 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#EAEDED] font-sans">
      {/* Hero Carousel */}
      <div className="relative w-full h-[320px] md:h-[460px] bg-[#232F3E] overflow-hidden">
        <div className="relative w-full h-full">
          {CAROUSEL_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center brightness-[0.45]"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 text-white max-w-3xl">
                <span className="inline-block self-start px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase bg-[#FF9900] text-[#131921] rounded-sm">
                  {slide.badge}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight drop-shadow-md">
                  {slide.title}
                </h2>
                <p className="text-base md:text-lg text-gray-200 max-w-xl mb-5">
                  {slide.subtitle}
                </p>
                <button className="self-start px-6 py-2.5 font-semibold text-sm bg-[#FF9900] text-[#131921] rounded hover:bg-[#e88a00] transition-colors shadow-md">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/60 transition-colors"
        >
          ❯
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {CAROUSEL_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-[#FF9900]" : "w-1.5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Category strip - Amazon style horizontal chips */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleCategoryChange("")}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
              !selectedCategory
                ? "bg-[#131921] text-white border-[#131921]"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                selectedCategory === cat.id.toString()
                  ? "bg-[#131921] text-white border-[#131921]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              }`}
            >
              {cat.name}
            </button>
          ))}
          {(searchQuery || selectedCategory) && (
            <button
              onClick={handleClearFilters}
              className="whitespace-nowrap ml-auto text-sm font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              Clear filters ✕
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-6">
        {/* Results header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold text-[#0F1111]">
            {searchQuery ? `Results for "${searchQuery}"` : "Today's Deals & More"}
          </h2>
          {selectedCategory && (
            <p className="text-sm text-gray-600 mt-0.5">
              Category: {categories.find((c) => c.id.toString() === selectedCategory)?.name}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-dashed border-gray-300">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2.5 bg-[#FF9900] text-[#131921] font-semibold rounded hover:bg-[#e88a00] transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;