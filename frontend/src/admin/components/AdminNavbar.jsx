import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminNavbar = () => {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
      <div>
        <div className="text-lg font-semibold text-slate-900">E-Comm Admin</div>
        <div className="text-sm text-slate-500">Administrator</div>
      </div>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
      >
        Logout
      </button>
    </header>
  )
}

export default AdminNavbar
