import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import toast from "react-hot-toast";

function Profile() {
  const BASEURL = import.meta.env.VITE_BASE_URL;
  const [profile, setProfile] = useState({ username: "", email: "", phone: "", address: "", avatar: null });
  const [avatar, setAvatar] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch(`${BASEURL}api/profile/`).then((response) => response.json()),
      authFetch(`${BASEURL}api/orders/`).then((response) => response.json()),
    ]).then(([profileData, orderData]) => {
      setProfile(profileData);
      setOrders(Array.isArray(orderData) ? orderData : []);
    }).catch(() => toast.error("Could not load your account details"))
      .finally(() => setLoading(false));
  }, [BASEURL]);

  const saveProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone || "");
    formData.append("address", profile.address || "");
    if (avatar) formData.append("avatar", avatar);

    try {
      const response = await authFetch(`${BASEURL}api/profile/`, { method: "PATCH", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error("Could not save profile");
      setProfile(data);
      setAvatar(null);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#EAEDED] p-12 text-center text-slate-500">Loading account...</div>;

  return (
    <main className="min-h-screen bg-[#EAEDED] px-4 py-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.25fr]">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
          <form onSubmit={saveProfile} className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
              {profile.avatar && <img src={`${BASEURL}${profile.avatar}`} alt="Profile" className="h-14 w-14 rounded-full object-cover" />}
              <input type="file" accept="image/*" onChange={(event) => setAvatar(event.target.files?.[0] || null)} className="text-sm" />
            </div>
            {[['username', 'Name'], ['email', 'Email'], ['phone', 'Phone']].map(([field, label]) => (
              <label key={field} className="block text-sm font-medium text-slate-700">{label}<input type={field === 'email' ? 'email' : 'text'} value={profile[field] || ''} onChange={(event) => setProfile({ ...profile, [field]: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal" /></label>
            ))}
            <label className="block text-sm font-medium text-slate-700">Address<textarea value={profile.address || ''} onChange={(event) => setProfile({ ...profile, address: event.target.value })} rows="4" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal" /></label>
            <button className="rounded-full bg-[#FFD814] px-5 py-2 font-semibold text-[#0F1111]">Save changes</button>
          </form>
        </section>

        <section id="orders" className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">My Orders</h2>
          <div className="mt-5 space-y-4">
            {orders.length ? orders.map((order) => <article key={order.id} className="rounded-lg border border-slate-200 p-4"><div className="flex justify-between gap-4"><span className="font-semibold">Order #{order.id}</span><span className="font-semibold text-[#B12704]">${order.total_amount}</span></div><p className="mt-1 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p><p className="mt-3 text-sm text-slate-700">{order.items.map((item) => `${item.quantity} x ${item.product}`).join(', ')}</p></article>) : <p className="text-sm text-slate-500">You have not placed any orders yet.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
