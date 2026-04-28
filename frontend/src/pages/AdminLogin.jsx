import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const { user, login, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) nav("/admin/dashboard", { replace: true });
  }, [user, nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      toast.success("Welcome back, Areeb");
      nav("/admin/dashboard", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Login failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#8a8278]">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3ede1] flex flex-col">
      <header className="px-6 md:px-10 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#d8cfc1] hover:text-[#ff5e3a] text-sm">
          <ArrowLeft size={16} />
          Back to site
        </Link>
        <div className="text-xs uppercase tracking-[0.3em] text-[#8a8278]">Admin Access</div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex w-14 h-14 rounded-full bg-[#ff5e3a] items-center justify-center mb-6">
              <Lock size={22} className="text-[#0a0a0a]" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl leading-none">
              Welcome <span className="font-serif-italic text-[#ff5e3a]">back</span>
            </h1>
            <p className="mt-3 text-[#8a8278] text-sm">Sign in to manage your portfolio.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 rounded-2xl bg-[#121110] border border-[#1c1916] space-y-5">
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Username</label>
              <div className="mt-2 flex items-center gap-3 border-b border-[#2a2520] focus-within:border-[#ff5e3a] transition-colors">
                <User size={16} className="text-[#5b554d]" />
                <input
                  autoFocus
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="flex-1 bg-transparent outline-none py-3 text-[#f3ede1] placeholder:text-[#5b554d]"
                  placeholder="your username"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Password</label>
              <div className="mt-2 flex items-center gap-3 border-b border-[#2a2520] focus-within:border-[#ff5e3a] transition-colors">
                <Lock size={16} className="text-[#5b554d]" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 bg-transparent outline-none py-3 text-[#f3ede1] placeholder:text-[#5b554d]"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || !form.username || !form.password}
              className="btn-accent w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
            >
              {submitting ? "Signing in…" : "Sign In"}
              <ArrowRight size={14} />
            </button>
            <p className="text-center text-[10px] text-[#5b554d]">Authorised access only.</p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
