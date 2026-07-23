import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function ResetPassword() {
  const BASEURL = import.meta.env.VITE_BASE_URL;
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const response = await fetch(`${BASEURL}api/password-reset/confirm/`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid, token, new_password: password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(Array.isArray(data.error) ? data.error[0] : data.error);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><section className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100"><h1 className="text-3xl font-black text-slate-900">Choose a password</h1><form onSubmit={handleSubmit} className="mt-6 space-y-4"><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:border-blue-600 focus:outline-none" /><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus:border-blue-600 focus:outline-none" /><button disabled={loading} className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white disabled:opacity-50">{loading ? "Resetting..." : "Reset password"}</button></form><Link to="/login" className="mt-6 block text-center text-sm font-semibold text-blue-600 hover:underline">Back to sign in</Link></section></main>;
}

export default ResetPassword;
