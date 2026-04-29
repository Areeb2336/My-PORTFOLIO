import React, { useEffect, useState, useMemo } from "react";
import api, { resolveImageUrl } from "../lib/api";
import { ArrowUpRight, Construction } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";

const Work = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/portfolio")
.then((r) => setItems(Array.isArray(r.data) ? r.data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
const safeItems = Array.isArray(items) ? items : [];
  
  const categories = useMemo(() => {
  const set = new Set(safeItems.map((i) => i.category).filter(Boolean));
  return ["All", ...Array.from(set)];
}, [safeItems]);

const filtered = useMemo(
  () => (filter === "All" ? safeItems : safeItems.filter((i) => i.category === filter)),
  [filter, safeItems]
);

  return (
    <section id="work" className="py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#ff5e3a] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#ff5e3a]" />
              Selected Work
            </div>
            <h2 className="font-display text-6xl md:text-8xl leading-[0.9] text-[#f3ede1]">
              The <span className="font-serif-italic text-[#ff5e3a]">Gallery</span>
            </h2>
            <p className="mt-6 max-w-xl text-[#8a8278] text-base md:text-lg">
              A growing collection of real edits. New work added as I take on more freelance briefs.
            </p>
          </div>
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] border transition-all duration-200 ${
                    filter === c
                      ? "bg-[#ff5e3a] border-[#ff5e3a] text-[#0a0a0a]"
                      : "border-[#2a2520] text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-[#8a8278]">Loading work…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-[#2a2520] bg-[#0c0b0a]">
            <Construction size={20} className="text-[#ff5e3a] mx-auto mb-3" />
            <div className="font-script text-[#ff5e3a] text-2xl">Coming soon</div>
            <p className="text-[#8a8278] max-w-xl mx-auto mt-2 text-sm">
              New work in progress. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <article
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl bg-[#121110] border border-[#1c1916] hover-lift img-hover ${
                  i === 0 && filtered.length >= 3 ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  {item.before_image_url ? (
                    <BeforeAfterSlider
                      beforeSrc={resolveImageUrl(item.before_image_url)}
                      afterSrc={resolveImageUrl(item.image_url)}
                    />
                  ) : (
                    <>
                      <img
                        src={resolveImageUrl(item.image_url || item.image)}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff5e3a] text-[#0a0a0a]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Real Work</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278] mb-1">
                      {item.category}{item.year ? ` · ${item.year}` : ""}
                    </div>
                    <div className="font-display text-2xl text-[#f3ede1] group-hover:text-[#ff5e3a] transition-colors truncate">
                      {item.title}
                    </div>
                  </div>
                  <span className="w-10 h-10 rounded-full border border-[#2a2520] flex items-center justify-center text-[#8a8278] group-hover:bg-[#ff5e3a] group-hover:border-[#ff5e3a] group-hover:text-[#0a0a0a] transition-all duration-300 shrink-0">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Work;
