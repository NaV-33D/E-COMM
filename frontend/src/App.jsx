import React from 'react'
import { useEffect, useState } from "react";
import ProductList from './pages/ProductList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivateRouter from './components/PrivateRouter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Categories from "./admin/pages/Categories";
import Users from "./admin/pages/Users";
import Orders from "./admin/pages/Orders";
import AdminPrivateRouter from "./components/AdminPrivateRouter";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route element={<PrivateRouter />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          {/* Admin Routes */}
     <Route element={<AdminPrivateRouter />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="categories" element={<Categories />} />
    <Route path="users" element={<Users />} />
    <Route path="orders" element={<Orders />} />
  </Route>
</Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App



























// import { useEffect, useState } from "react";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/products/')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         // The API returns an array directly
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Error fetching products:', err);
//         setError(err.message || 'Failed to fetch data');
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-900 px-4 py-12 text-slate-100 antialiased sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-6xl">
//         {/* Header */}
//         <div className="mb-10 border-b border-slate-800 pb-5">
//           <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
//             Product Catalog
//           </h1>
//           <p className="mt-2 text-sm text-slate-400">
//             Real-time inventory directly from your local API endpoint.
//           </p>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/30">
//             <div className="flex items-center gap-3 text-sm text-slate-400">
//               <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
//               Loading your catalog...
//             </div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-center text-sm text-rose-400">
//             <p className="font-semibold">⚠️ Connection Error</p>
//             <p className="mt-1 text-xs font-mono text-rose-500">{error}</p>
//           </div>
//         )}

//         {/* Product Grid */}
//         {!loading && !error && (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {products.map((product) => (
//               <div 
//                 key={product.id} 
//                 className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl"
//               >
//                 {/* Fallback Image / Badge Area */}
//                 <div className="relative flex h-48 w-full items-center justify-center bg-slate-900 text-slate-600 transition-colors group-hover:bg-slate-900/60">
//                   <span className="text-sm font-mono text-slate-500">
//                     {product.image ? `📷 ${product.name} Image` : 'No Image Available'}
//                   </span>
                  
//                   {/* Category Badge */}
//                   <span className="absolute top-4 left-4 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
//                     {product.category.name}
//                   </span>
//                 </div>

//                 {/* Content Box */}
//                 <div className="flex flex-1 flex-col p-5">
//                   <div className="flex items-baseline justify-between gap-2">
//                     <h2 className="text-lg font-semibold text-slate-100 group-hover:text-white">
//                       {product.name}
//                     </h2>
//                     <span className="text-xl font-bold text-emerald-400">
//                       ${parseFloat(product.price).toFixed(2)}
//                     </span>
//                   </div>

//                   <p className="mt-2 text-sm text-slate-400 line-clamp-2 flex-1">
//                     {product.description}
//                   </p>

//                   {/* Buy Button / Footer Action */}
//                   <div className="mt-5 pt-4 border-t border-slate-900">
//                     <button className="w-full rounded-xl bg-slate-800 py-2.5 text-center text-sm font-medium text-slate-200 transition-colors hover:bg-indigo-600 hover:text-white">
//                       Add to Cart
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;