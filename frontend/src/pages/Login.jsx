import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { saveTokens } from "../utils/auth";

function Login() {
  const BASE = import.meta.env.VITE_BASE_URL;
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE}/api/token/`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        saveTokens(data);
        const userRes = await fetch(`${BASE}/api/me/`, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        const user = await userRes.json();
        localStorage.setItem("is_staff", user.is_staff);
        
        setMsg(user.is_staff ? "Welcome Admin" : "Welcome Shoppers");
        setTimeout(() => nav(user.is_staff ? "/admin" : "/"), 1200);
      } else {
        setMsg(data.detail || "Invalid credentials");
        setIsLoading(false);
      }
    } catch(err) {
      console.error(err);
      setMsg("Login failed");
      setIsLoading(false);
    }
  };

  if (msg && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
          {msg}
        </h1>
      </div>
    );
  }

  return (
   <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
  <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 transition-all duration-300">
    
    {/* Header Section */}
    <div className="mb-8 text-center sm:text-left">
      <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
      <p className="text-sm text-slate-500 mt-1">Please enter your details to sign in.</p>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Username</label>
        <input 
          name="username" 
          onChange={handleChange} 
          value={form.username} 
          placeholder="e.g., alex_dev" 
          required 
          disabled={isLoading}
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
        {/* Relative container wraps both the input and the floating icon button */}
        <div className="relative flex items-center">
          <input 
            name="password" 
            type={showPassword ? "text" : "password"} 
            onChange={handleChange} 
            value={form.password} 
            placeholder="••••••••" 
            required 
            disabled={isLoading}
            className="w-full pl-3.5 pr-11 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all disabled:opacity-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye Slash Icon (Hide)
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              // Eye Icon (Show)
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <div className="mt-2 text-right"><Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</Link></div>
      </div>

      {/* Error Message Anchor */}
      {msg && !isLoading && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
          <span className="font-semibold">Error:</span> {msg}
        </div>
      )}

      {/* Submit Button */}
      <button 
        disabled={isLoading} 
        className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none disabled:transform-none mt-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Logging in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>

    {/* Footer Link */}
    <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
      Don't have an account?{" "}
      <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
        Sign up free
      </a>
    </div>

  </div>
</div>
  );
}

export default Login;
