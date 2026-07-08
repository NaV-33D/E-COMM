import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_categories: 0,
    total_users: 0,
    total_orders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch('http://127.0.0.1:8000/api/dashboard/stats/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          setError('Failed to fetch stats')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: 'Total Products', value: stats.total_products },
    { title: 'Total Categories', value: stats.total_categories },
    { title: 'Total Users', value: stats.total_users },
    { title: 'Total Orders', value: stats.total_orders },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
        Error: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome Admin</h1>
        <p className="mt-2 text-sm text-slate-500">Here's your dashboard overview with live data from the API.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">{stat.title}</div>
            <div className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
