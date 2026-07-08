import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-56 bg-slate-900 text-slate-100 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </div>
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`
          }
        >
          Categories
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-200 hover:bg-slate-800 hover:text-white'}`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/"
          className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition"
        >
          Logout
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
