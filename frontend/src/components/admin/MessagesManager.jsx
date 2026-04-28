import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { Mail, Trash2, Check, Inbox, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/messages");
      setMessages(r.data || []);
    } catch {
      toast.error("Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, read: true } : x)));
    } catch {
      toast.error("Could not update");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages((m) => m.filter((x) => x.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl flex items-center gap-3">
            <Inbox size={22} className="text-[#ff5e3a]" />
            Inbox
          </h2>
          <p className="text-[#8a8278] text-sm mt-1">
            {messages.length} total · <span className="text-[#ff5e3a]">{unread} unread</span>
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "read", label: "Read" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border ${
                filter === f.id
                  ? "bg-[#ff5e3a] border-[#ff5e3a] text-[#0a0a0a]"
                  : "border-[#2a2520] text-[#d8cfc1]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-[#8a8278]">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-[#2a2520] text-[#8a8278]">
          No messages here yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <article
              key={m.id}
              className={`p-5 md:p-6 rounded-2xl border transition-colors ${
                m.read ? "bg-[#121110] border-[#1c1916]" : "bg-[#1a0f0a] border-[#ff5e3a]/40"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-display text-xl text-[#f3ede1]">{m.name}</span>
                    {!m.read && <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-[#ff5e3a] text-[#0a0a0a]">New</span>}
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-[#ff5e3a] hover:underline break-all">{m.email}</a>
                  {m.project && <div className="mt-1 text-xs text-[#8a8278]">Project: {m.project}</div>}
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#5b554d]">{new Date(m.created_at).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`Re: ${m.project || "Your enquiry"}`);
                      const body = encodeURIComponent(`Hi ${m.name},\n\nThanks for reaching out about "${m.project || "your project"}".\n\n`);
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.email)}&su=${subject}&body=${body}`;
                      window.open(gmailUrl, "_blank", "noopener,noreferrer");
                      navigator.clipboard?.writeText(m.email).catch(() => {});
                      toast.success("Opening Gmail — email copied to clipboard too");
                      if (!m.read) markRead(m.id);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a]"
                  >
                    <Mail size={13} /> Reply
                  </button>
                  {!m.read && (
                    <button onClick={() => markRead(m.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a]">
                      <Check size={13} /> Mark read
                    </button>
                  )}
                  <button onClick={() => handleDelete(m.id)} className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-red-500 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-[#d8cfc1] whitespace-pre-wrap leading-relaxed">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesManager;
