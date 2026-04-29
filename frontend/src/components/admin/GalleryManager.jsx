import React, { useEffect, useState, useRef } from "react";
import api, { resolveImageUrl } from "../../lib/api";
import { Upload, Trash2, Edit3, Check, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  "Background Removal",
  "Sky Replacement",
  "Compositing",
  "Retouching",
  "Other",
];

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const fileRef = useRef(null);
  const beforeRef = useRef(null);

  const [newItem, setNewItem] = useState({
    title: "",
    category: "Background Removal",
    year: new Date().getFullYear().toString(),
    description: "",
    file: null,
    preview: "",
    beforeFile: null,
    beforePreview: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/portfolio");
      setItems(r.data || []);
    } catch {
      toast.error("Could not load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large (max 10MB)");
      return;
    }
    const preview = URL.createObjectURL(file);
    setNewItem({ ...newItem, file, preview });
  };

  const handleBeforeFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Before image too large (max 10MB)");
      return;
    }
    const beforePreview = URL.createObjectURL(file);
    setNewItem({ ...newItem, beforeFile: file, beforePreview });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newItem.file) {
      toast.error("Please select an image");
      return;
    }
    if (!newItem.title.trim()) {
      toast.error("Please add a title");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", newItem.file);
      if (newItem.beforeFile) fd.append("before_image", newItem.beforeFile);
      fd.append("title", newItem.title);
      fd.append("category", newItem.category);
      fd.append("year", newItem.year);
      fd.append("description", newItem.description);
      fd.append("order", String(items.length + 1));
      await api.post("/portfolio", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Image added to gallery");
      setNewItem({ title: "", category: "Background Removal", year: new Date().getFullYear().toString(), description: "", file: null, preview: "", beforeFile: null, beforePreview: "" });
      if (fileRef.current) fileRef.current.value = "";
      if (beforeRef.current) beforeRef.current.value = "";
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setDraft({
      title: item.title,
      category: item.category,
      year: item.year,
      description: item.description,
    });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/portfolio/${id}`, draft);
      toast.success("Updated");
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image from the gallery? This cannot be undone.")) return;
    try {
      await api.delete(`/portfolio/${id}`);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="space-y-10">
      {/* Upload card */}
      <section className="p-6 md:p-8 rounded-2xl bg-[#121110] border border-[#1c1916]">
        <div className="flex items-center gap-3 mb-6">
          <Upload size={18} className="text-[#ff5e3a]" />
          <h2 className="font-display text-2xl">Upload New Work</h2>
        </div>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image picker */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">After image (final result)</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="mt-2 cursor-pointer aspect-[4/3] rounded-xl border-2 border-dashed border-[#2a2520] hover:border-[#ff5e3a] transition-colors flex items-center justify-center overflow-hidden bg-[#0c0b0a]"
              >
                {newItem.preview ? (
                  <img src={newItem.preview} alt="preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-[#5b554d]">
                    <ImageIcon size={28} className="mx-auto mb-2" />
                    <div className="text-sm">Click to choose AFTER image</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] mt-1">JPG, PNG, WEBP · max 10MB</div>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">Before image (optional — enables slider)</label>
              <div
                onClick={() => beforeRef.current?.click()}
                className="mt-2 cursor-pointer aspect-[4/3] rounded-xl border-2 border-dashed border-[#2a2520] hover:border-[#ff5e3a] transition-colors flex items-center justify-center overflow-hidden bg-[#0c0b0a]"
              >
                {newItem.beforePreview ? (
                  <img src={newItem.beforePreview} alt="before preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-[#5b554d]">
                    <ImageIcon size={24} className="mx-auto mb-2" />
                    <div className="text-sm">Click to choose BEFORE image</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] mt-1">Optional · adds drag-slider</div>
                  </div>
                )}
              </div>
              <input
                ref={beforeRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleBeforeFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <FieldText label="Title" value={newItem.title} onChange={(v) => setNewItem({ ...newItem, title: v })} placeholder="e.g. Red Truck Cutout" />
            <FieldSelect label="Category" value={newItem.category} options={CATEGORY_OPTIONS} onChange={(v) => setNewItem({ ...newItem, category: v })} />
            <FieldText label="Year" value={newItem.year} onChange={(v) => setNewItem({ ...newItem, year: v })} placeholder="2025" />
            <FieldText label="Short description" value={newItem.description} onChange={(v) => setNewItem({ ...newItem, description: v })} placeholder="Optional" />
            <div className="text-[11px] text-[#8a8278] leading-relaxed p-3 rounded-lg bg-[#0c0b0a] border border-[#1c1916]">
              💡 <strong className="text-[#d8cfc1]">Pro tip:</strong> Upload BOTH before & after — your gallery will show a draggable slider so visitors can <em>see</em> your editing magic in real time.
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="btn-accent w-full inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs tracking-[0.25em] uppercase font-medium disabled:opacity-50"
            >
              <Upload size={14} />
              {uploading ? "Uploading…" : "Add to Gallery"}
            </button>
          </div>
        </form>
      </section>

      {/* Existing items */}
      <section>
        <h3 className="text-xs uppercase tracking-[0.3em] text-[#8a8278] mb-5">Your Gallery ({items.length})</h3>
        {loading ? (
          <div className="text-[#8a8278]">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#2a2520] text-[#8a8278]">
            No images yet. Upload your first one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => (
              <article key={it.id} className="rounded-2xl bg-[#121110] border border-[#1c1916] overflow-hidden">
                <div className="aspect-[4/3] bg-white">
                  <img src={resolveImageUrl(it.image_url)} alt={it.title} className="w-full h-full object-contain" />
                </div>
                <div className="p-5">
                  {editingId === it.id ? (
                    <div className="space-y-3">
                      <FieldText label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
                      <FieldSelect label="Category" value={draft.category} options={CATEGORY_OPTIONS} onChange={(v) => setDraft({ ...draft, category: v })} />
                      <FieldText label="Year" value={draft.year} onChange={(v) => setDraft({ ...draft, year: v })} />
                      <FieldText label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} />
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => saveEdit(it.id)} className="btn-accent flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em]">
                          <Check size={14} /> Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border border-[#2a2520] text-[#d8cfc1]">
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278] mb-1">{it.category} · {it.year}</div>
                      <div className="font-display text-xl text-[#f3ede1]">{it.title}</div>
                      {it.description && <div className="mt-1 text-sm text-[#8a8278] line-clamp-2">{it.description}</div>}
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => startEdit(it)} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a]">
                          <Edit3 size={13} /> Edit
                        </button>
                        <button onClick={() => handleDelete(it.id)} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-[#2a2520] text-xs text-[#d8cfc1] hover:border-red-500 hover:text-red-500">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const FieldText = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{label}</label>
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-2 w-full bg-[#0c0b0a] border border-[#2a2520] focus:border-[#ff5e3a] outline-none px-3 py-2.5 rounded-lg text-sm text-[#f3ede1] placeholder:text-[#5b554d]"
    />
  </div>
);

const FieldSelect = ({ label, value, options, onChange }) => (
  <div>
    <label className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{label}</label>
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full bg-[#0c0b0a] border border-[#2a2520] focus:border-[#ff5e3a] outline-none px-3 py-2.5 rounded-lg text-sm text-[#f3ede1]"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default GalleryManager;
