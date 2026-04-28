import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useContent } from "../../contexts/ContentContext";
import { Save, Plus, Trash2, FileText, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const ContentManager = () => {
  const { content, refresh } = useContent();
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState("");

  useEffect(() => {
    if (content) setDraft(JSON.parse(JSON.stringify(content)));
  }, [content]);

  if (!draft) return <div className="text-[#8a8278]">Loading…</div>;

  const profile = draft.profile || {};
  const services = draft.services || [];
  const roadmap = draft.roadmap || [];
  const stats = draft.stats || [];
  const tools = draft.tools || [];

  const saveKey = async (key, value) => {
    setSaving(key);
    try {
      await api.put(`/content/${key}`, { value });
      toast.success(`${key} saved`);
      await refresh();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Save failed");
    } finally {
      setSaving("");
    }
  };

  const setProfileField = (k, v) => setDraft({ ...draft, profile: { ...profile, [k]: v } });
  const setServiceField = (idx, k, v) => {
    const copy = [...services];
    copy[idx] = { ...copy[idx], [k]: v };
    setDraft({ ...draft, services: copy });
  };
  const setRoadmapField = (idx, k, v) => {
    const copy = [...roadmap];
    copy[idx] = { ...copy[idx], [k]: v };
    setDraft({ ...draft, roadmap: copy });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <FileText size={20} className="text-[#ff5e3a]" />
        <h2 className="font-display text-3xl">Edit site text</h2>
      </div>
      <p className="text-[#8a8278] text-sm -mt-7">Each section saves independently. Click “Save” after editing.</p>

      {/* Profile */}
      <Card title="Profile" onSave={() => saveKey("profile", profile)} saving={saving === "profile"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Display Name" value={profile.name} onChange={(v) => setProfileField("name", v)} />
          <Field label="Short Name (Logo)" value={profile.shortName} onChange={(v) => setProfileField("shortName", v)} />
          <Field label="Role / Title" value={profile.role} onChange={(v) => setProfileField("role", v)} className="md:col-span-2" />
          <Field label="Tagline" value={profile.tagline} onChange={(v) => setProfileField("tagline", v)} className="md:col-span-2" />
          <Field label="Status (Hero pill)" value={profile.status} onChange={(v) => setProfileField("status", v)} />
          <Field label="Location" value={profile.location} onChange={(v) => setProfileField("location", v)} />
          <Field label="University" value={profile.university} onChange={(v) => setProfileField("university", v)} />
          <Field label="Course Years" value={profile.courseYears} onChange={(v) => setProfileField("courseYears", v)} />
          <Field label="Email" value={profile.email} onChange={(v) => setProfileField("email", v)} />
          <Field label="Instagram handle (without @)" value={profile.instagram} onChange={(v) => {
            setDraft({ ...draft, profile: { ...profile, instagram: v, instagramUrl: `https://instagram.com/${v}` } });
          }} />
          <Field label="Photo URL" value={profile.photoUrl} onChange={(v) => setProfileField("photoUrl", v)} className="md:col-span-2" />
          <Textarea label="Short bio (Hero subtitle)" value={profile.shortBio} onChange={(v) => setProfileField("shortBio", v)} className="md:col-span-2" />
          <Textarea label="Long bio (About section)" rows={6} value={profile.longBio} onChange={(v) => setProfileField("longBio", v)} className="md:col-span-2" />
        </div>
      </Card>

      {/* Stats */}
      <Card title="Hero Stats (4 cards)" onSave={() => saveKey("stats", stats)} saving={saving === "stats"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#0c0b0a] border border-[#1c1916]">
              <Field label="Value" value={s.value} onChange={(v) => {
                const copy = [...stats]; copy[idx] = { ...copy[idx], value: v }; setDraft({ ...draft, stats: copy });
              }} />
              <Field label="Label" value={s.label} onChange={(v) => {
                const copy = [...stats]; copy[idx] = { ...copy[idx], label: v }; setDraft({ ...draft, stats: copy });
              }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Tools */}
      <Card title="Photoshop Toolkit (chips)" onSave={() => saveKey("tools", tools)} saving={saving === "tools"}>
        <ListEditor items={tools} setItems={(v) => setDraft({ ...draft, tools: v })} placeholder="e.g. Pen Tool" />
      </Card>

      {/* Services */}
      <Card title="Services (4 items)" onSave={() => saveKey("services", services)} saving={saving === "services"}>
        <div className="space-y-5">
          {services.map((s, idx) => (
            <div key={s.id || idx} className="p-4 rounded-xl bg-[#0c0b0a] border border-[#1c1916]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Field label="Number" value={s.number} onChange={(v) => setServiceField(idx, "number", v)} />
                <Field label="Title" value={s.title} onChange={(v) => setServiceField(idx, "title", v)} className="md:col-span-2" />
              </div>
              <Textarea label="Description" value={s.description} onChange={(v) => setServiceField(idx, "description", v)} />
              <div className="mt-3">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Deliverables</label>
                <ListEditor items={s.deliverables || []} setItems={(v) => setServiceField(idx, "deliverables", v)} placeholder="e.g. Transparent PNG" />
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-sm text-[#d8cfc1]">
                <input type="checkbox" checked={!!s.featured} onChange={(e) => setServiceField(idx, "featured", e.target.checked)} />
                Specialty (highlight badge)
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Roadmap */}
      <Card title="Learning Roadmap" onSave={() => saveKey("roadmap", roadmap)} saving={saving === "roadmap"}>
        <div className="space-y-5">
          {roadmap.map((r, idx) => (
            <div key={r.id || idx} className="p-4 rounded-xl bg-[#0c0b0a] border border-[#1c1916]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Field label="Badge" value={r.badge} onChange={(v) => setRoadmapField(idx, "badge", v)} />
                <Field label="Tool" value={r.tool} onChange={(v) => setRoadmapField(idx, "tool", v)} />
                <Field label="Timeline" value={r.timeline} onChange={(v) => setRoadmapField(idx, "timeline", v)} />
              </div>
              <Textarea label="Description" value={r.description} onChange={(v) => setRoadmapField(idx, "description", v)} />
              <div className="mt-3">
                <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Status</label>
                <select
                  value={r.status || "upcoming"}
                  onChange={(e) => setRoadmapField(idx, "status", e.target.value)}
                  className="mt-2 bg-[#0a0a0a] border border-[#2a2520] focus:border-[#ff5e3a] outline-none px-3 py-2 rounded-lg text-sm text-[#f3ede1]"
                >
                  <option value="in-progress">In Progress (highlighted)</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="p-4 rounded-2xl border border-dashed border-[#2a2520] flex items-center gap-3 text-sm text-[#8a8278]">
        <RotateCcw size={14} />
        Tip: After saving, refresh your public site to see the changes. Already-open tabs may need a reload.
      </div>
    </div>
  );
};

const Card = ({ title, onSave, saving, children }) => (
  <section className="p-6 md:p-7 rounded-2xl bg-[#121110] border border-[#1c1916]">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-display text-xl">{title}</h3>
      <button
        onClick={onSave}
        disabled={saving}
        className="btn-accent inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs uppercase tracking-[0.2em] disabled:opacity-50"
      >
        <Save size={13} />
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
    {children}
  </section>
);

const Field = ({ label, value, onChange, className = "", placeholder }) => (
  <div className={className}>
    <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{label}</label>
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full bg-[#0c0b0a] border border-[#2a2520] focus:border-[#ff5e3a] outline-none px-3 py-2.5 rounded-lg text-sm text-[#f3ede1] placeholder:text-[#5b554d]"
    />
  </div>
);

const Textarea = ({ label, value, onChange, className = "", rows = 3 }) => (
  <div className={className}>
    <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{label}</label>
    <textarea
      rows={rows}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full bg-[#0c0b0a] border border-[#2a2520] focus:border-[#ff5e3a] outline-none px-3 py-2.5 rounded-lg text-sm text-[#f3ede1] resize-y"
    />
  </div>
);

const ListEditor = ({ items, setItems, placeholder }) => (
  <div className="mt-2 space-y-2">
    {items.map((it, i) => (
      <div key={i} className="flex gap-2">
        <input
          value={it}
          onChange={(e) => {
            const copy = [...items]; copy[i] = e.target.value; setItems(copy);
          }}
          className="flex-1 bg-[#0a0a0a] border border-[#2a2520] focus:border-[#ff5e3a] outline-none px-3 py-2 rounded-lg text-sm text-[#f3ede1]"
        />
        <button
          onClick={() => setItems(items.filter((_, idx) => idx !== i))}
          className="px-3 rounded-lg border border-[#2a2520] text-[#d8cfc1] hover:border-red-500 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ))}
    <button
      onClick={() => setItems([...items, ""])}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a]"
    >
      <Plus size={13} /> Add item
    </button>
    {placeholder && items.length === 0 && (
      <div className="text-xs text-[#5b554d]">e.g. {placeholder}</div>
    )}
  </div>
);

export default ContentManager;
