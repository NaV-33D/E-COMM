import React, { useEffect, useState } from 'react'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch('http://127.0.0.1:8000/api/products/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert('Failed to delete product')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your product inventory from here.</p>
        </div>
        <button className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Add Product
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
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Category</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Price</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{product.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{product.category.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-sm text-slate-500">
                    No products found.
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

export default Products
