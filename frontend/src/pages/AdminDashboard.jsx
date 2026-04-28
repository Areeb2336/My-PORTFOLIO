import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, ImagePlus, Mail, FileText, ExternalLink } from "lucide-react";
import GalleryManager from "../components/admin/GalleryManager";
import MessagesManager from "../components/admin/MessagesManager";
import ContentManager from "../components/admin/ContentManager";

const tabs = [
  { id: "gallery", label: "Gallery", icon: ImagePlus },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "content", label: "Edit Text", icon: FileText },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("gallery");

  const handleLogout = () => {
    logout();
    nav("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f3ede1]">
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1c1916]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#ff5e3a] flex items-center justify-center text-[#0a0a0a] font-display">A</span>
            <div className="leading-tight">
              <div className="font-display text-lg">Admin</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#8a8278]">{user?.username}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a]"
            >
              <ExternalLink size={14} />
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a]"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex gap-1 overflow-x-auto -mb-px">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm border-b-2 transition-colors duration-200 whitespace-nowrap ${
                    active
                      ? "border-[#ff5e3a] text-[#ff5e3a]"
                      : "border-transparent text-[#8a8278] hover:text-[#d8cfc1]"
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        {tab === "gallery" && <GalleryManager />}
        {tab === "messages" && <MessagesManager />}
        {tab === "content" && <ContentManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
