import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const BASE = import.meta.env.VITE_BASE_URL;
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [showPassword2, setShowPassword2] = useState(false);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${BASE}/api/register/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(res.ok) {
        setMsg("Account created. Redirecting to login...");
        setTimeout(()=>nav("/login"), 1200);
      } else {
        setMsg(data.username || data.password || JSON.stringify(data));
      }
    } catch(err) {
      console.error(err);
      setMsg("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
  <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 transition-all duration-300">
    
    {/* Header Section */}
    <div className="mb-8 text-center sm:text-left">
      <h2 className="text-3xl font-black tracking-tight text-slate-900">Create an account</h2>
      <p className="text-sm text-slate-500 mt-1">Get started with your free account today.</p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Username</label>
        <input 
          name="username" 
          onChange={handleChange} 
          value={form.username} 
          placeholder="e.g., alex_dev" 
          required 
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
        />
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
        <input 
          name="email" 
          type="email"
          onChange={handleChange} 
          value={form.email} 
          placeholder="you@example.com" 
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
        />
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
        <div className="relative flex items-center">
          <input 
            name="password" 
            type={showPassword ? "text" : "password"} 
            onChange={handleChange} 
            value={form.password} 
            placeholder="••••••••" 
            required 
            className="w-full pl-3.5 pr-11 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Confirm Password</label>
        <div className="relative flex items-center">
          <input 
            name="password2" 
            type={showPassword2 ? "text" : "password"} 
            onChange={handleChange} 
            value={form.password2} 
            placeholder="••••••••" 
            required 
            className="w-full pl-3.5 pr-11 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
          />
          <button
            type="button"
            onClick={() => setShowPassword2(!showPassword2)}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            aria-label={showPassword2 ? "Hide password" : "Show password"}
          >
            {showPassword2 ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Dynamic Notification Message Anchor */}
      {msg && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 flex items-center gap-2">
          <span className="font-semibold">Notice:</span> {msg}
        </div>
      )}

      {/* Submit Button */}
      <button className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.99] transition-all mt-2">
        Create Account
      </button>
    </form>

    {/* Footer Link */}
    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
      Already have an account?{" "}
      <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
        Sign in
      </a>
    </div>

  </div>
</div>
  );
}

export default Signup;