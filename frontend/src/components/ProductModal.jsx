import { useState, useEffect } from "react";

function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  product,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock_quantity: 0,
    image: null,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category.id,
        stock_quantity: product.stock_quantity,
        image: null,
      });
    } else {
      setForm({ name: "", description: "", price: "", category: "", stock_quantity: 0, image: null });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-bold mb-6">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            name="stock_quantity"
            min="0"
            placeholder="Stock Quantity"
            value={form.stock_quantity}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductModal;
