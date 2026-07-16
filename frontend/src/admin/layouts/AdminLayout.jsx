import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AdminNavbar from '../components/AdminNavbar'

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-52">
        <AdminNavbar />
        <main className="p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout