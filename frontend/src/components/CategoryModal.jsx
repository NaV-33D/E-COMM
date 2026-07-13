import { useEffect, useState } from "react";

function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  category,
}) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    if (category) {
      setForm(category);
    }
  }, [category]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">

        <h2 className="text-2xl font-bold mb-6">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
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

export default CategoryModal;