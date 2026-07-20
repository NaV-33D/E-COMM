import React, { useEffect, useState } from "react";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const BASEURL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("access_token");

  // Fetch categories
  useEffect(() => {
    fetch(`${BASEURL}api/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASEURL}api/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductClick = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (form) => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category_id", form.category);
      formData.append("stock_quantity", form.stock_quantity);
      if (form.image && form.image instanceof File) {
        formData.append("image", form.image);
      }

      const url = selectedProduct
        ? `${BASEURL}api/products/${selectedProduct.id}/update/`
        : `${BASEURL}api/products/create/`;

      const method = selectedProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(
          selectedProduct
            ? "Product updated successfully"
            : "Product created successfully",
        );
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        toast.error("Failed to save product");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `${BASEURL}api/products/${productToDelete.id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        toast.success("Product deleted successfully");
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        setIsDeleteModalOpen(false);
      } else {
        toast.error("Failed to delete product");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your product inventory from here.
          </p>
        </div>
        <button
          onClick={handleAddProductClick}
          className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-500">
          Loading...
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
          Error: {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">
                  ID
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">
                  Image
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">
                  Category
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">
                  Price
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">
                  Stock
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={`${BASEURL}${product.image}`}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {product.category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock_quantity === 0 ? "bg-red-100 text-red-700" : product.stock_quantity <= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                      >
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEditProductClick(product)}
                        className="rounded px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="rounded px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-16 text-center text-sm text-slate-500"
                  >
                    No products found. Click "Add Product" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        categories={categories}
        product={selectedProduct}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Products;
