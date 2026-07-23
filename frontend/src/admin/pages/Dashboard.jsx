import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function Dashboard() {
  const BASEURL = import.meta.env.VITE_BASE_URL;
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASEURL}api/admin/dashboard-stats/`, { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load dashboard data");
        return response.json();
      })
      .then(setStats)
      .catch((fetchError) => setError(fetchError.message));
  }, [BASEURL]);

  if (error) return <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</div>;
  if (!stats) return <div className="p-12 text-center text-slate-500">Loading dashboard...</div>;

  const cards = [
    ["Total revenue", `$${Number(stats.total_revenue).toFixed(2)}`],
    ["Total orders", stats.total_orders],
    ["Total users", stats.total_users],
    ["Low-stock products", stats.low_stock_count],
  ];
  const sales = stats.sales_last_30_days.map((item) => ({ ...item, date: new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }) }));

  return <div>
    <div className="mb-6"><h1 className="text-3xl font-semibold text-slate-900">Business overview</h1><p className="mt-2 text-sm text-slate-500">Sales and inventory performance for your store.</p></div>
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([title, value]) => <div key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p className="text-sm text-slate-500">{title}</p><p className="mt-4 text-3xl font-bold text-slate-900">{value}</p></div>)}</div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-lg font-semibold text-slate-900">Revenue, last 30 days</h2><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={sales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" minTickGap={28} /><YAxis /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} /></LineChart></ResponsiveContainer></div></section>
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-lg font-semibold text-slate-900">Top products by units sold</h2><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats.top_products}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="units_sold" fill="#f59e0b" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></section>
    </div>
  </div>;
}

export default Dashboard;
