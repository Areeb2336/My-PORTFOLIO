import React, { useState } from "react";
import { profile } from "../mock";
import { Mail, Instagram, Copy, ArrowUpRight, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", project: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email and message.");
      return;
    }
    setSubmitting(true);
    // Mock submit — saves locally for the frontend-only phase
    setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem("areeb_inquiries") || "[]");
      stored.push({ ...form, at: new Date().toISOString() });
      localStorage.setItem("areeb_inquiries", JSON.stringify(stored));
      toast.success("Message saved! I'll reply via email shortly.");
      setForm({ name: "", email: "", project: "", message: "" });
      setSubmitting(false);
    }, 700);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success("Email copied to clipboard");
    } catch {
      toast.error("Couldn't copy. Try manually.");
    }
  };

  return (
    <section id="contact" className="py-24 md:py-36 bg-[#0c0b0a] border-t border-[#1c1916]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-xs uppercase tracking-[0.3em] text-[#ff5e3a] mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[#ff5e3a]" />
          Contact
        </div>
        <h2 className="font-display text-6xl md:text-[10rem] leading-[0.85] text-[#f3ede1]">
          Let's <span className="font-serif-italic text-[#ff5e3a]">make</span>
          <br />
          something <span className="font-script text-[#ff5e3a] text-7xl md:text-9xl">clean.</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-4">
            <button
              onClick={copyEmail}
              className="group w-full p-6 rounded-2xl bg-[#121110] border border-[#1c1916] hover:border-[#ff5e3a] transition-colors duration-300 text-left flex items-start justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={16} className="text-[#ff5e3a]" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Email</span>
                </div>
                <div className="font-display text-2xl md:text-3xl text-[#f3ede1] break-all">{profile.email}</div>
              </div>
              <Copy size={18} className="text-[#5b554d] group-hover:text-[#ff5e3a] mt-1" />
            </button>

            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-2xl bg-[#121110] border border-[#1c1916] hover:border-[#ff5e3a] transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Instagram size={16} className="text-[#ff5e3a]" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Instagram</span>
                  </div>
                  <div className="font-display text-2xl md:text-3xl text-[#f3ede1]">@{profile.instagram}</div>
                </div>
                <ArrowUpRight size={18} className="text-[#5b554d] group-hover:text-[#ff5e3a] group-hover:rotate-45 transition-all duration-300" />
              </div>
            </a>

            <div className="p-6 rounded-2xl border border-dashed border-[#2a2520]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278] mb-2">Currently</div>
              <div className="text-[#d8cfc1]">
                Open to small briefs, learning gigs and product cutouts. Replies within 24 hours.
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="p-6 md:p-10 rounded-2xl bg-[#121110] border border-[#1c1916]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Your name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@email.com" />
              </div>
              <div className="mt-5">
                <Field label="Project type" name="project" value={form.project} onChange={handleChange} placeholder="e.g. Background removal for 20 product photos" />
              </div>
              <div className="mt-5">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell me about the edit you need..."
                  className="mt-2 w-full bg-transparent border-b border-[#2a2520] focus:border-[#ff5e3a] outline-none py-3 text-[#f3ede1] placeholder:text-[#5b554d] transition-colors duration-200 resize-none"
                />
              </div>
              <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
                <div className="text-xs text-[#5b554d]">
                  Saved locally for now — backend coming next.
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm tracking-[0.2em] uppercase font-medium disabled:opacity-60"
                >
                  <Send size={14} />
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="mt-2 w-full bg-transparent border-b border-[#2a2520] focus:border-[#ff5e3a] outline-none py-3 text-[#f3ede1] placeholder:text-[#5b554d] transition-colors duration-200"
    />
  </div>
);

export default Contact;
