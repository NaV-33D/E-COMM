import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function ForgotPassword() {
  const BASEURL = import.meta.env.VITE_BASE_URL;
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASEURL}api/password-reset/request/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error("Could not request a password reset");
      setSent(true);
      toast.success("Password reset instructions sent");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><section className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100"><h1 className="text-3xl font-black text-slate-900">Reset password</h1><p className="mt-2 text-sm text-slate-500">Enter your account email and we will send reset instructions.</p>{sent ? <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">Check your email for a password reset link.</div> : <form onSubmit={handleSubmit} className="mt-6 space-y-4"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:border-blue-600 focus:outline-none" /><button disabled={loading} className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white disabled:opacity-50">{loading ? "Sending..." : "Send reset link"}</button></form>}<Link to="/login" className="mt-6 block text-center text-sm font-semibold text-blue-600 hover:underline">Back to sign in</Link></section></main>;
}

export default ForgotPassword;
