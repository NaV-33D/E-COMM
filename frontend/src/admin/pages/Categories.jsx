import React, { useEffect, useState } from 'react'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch('http://127.0.0.1:8000/api/categories/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        } else {
          setError('Failed to fetch categories')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://127.0.0.1:8000/api/categories/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== id))
      } else {
        alert('Failed to delete category')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Categories</h1>
          <p className="mt-2 text-sm text-slate-500">Create and manage categories here.</p>
        </div>
        <button className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-500">Loading...</div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">Error: {error}</div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">ID</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Name</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Slug</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{category.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{category.slug}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-sm text-slate-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Categories
