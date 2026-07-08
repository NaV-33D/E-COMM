import React, { useEffect, useState } from 'react'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch('http://127.0.0.1:8000/api/orders/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else {
          setError('Failed to fetch orders')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-2 text-sm text-slate-500">View and manage customer orders.</p>
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
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Order ID</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Customer</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Total</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{order.user}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">${parseFloat(order.total_amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(order.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-sm text-slate-500">
                    No orders found.
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

export default Orders
