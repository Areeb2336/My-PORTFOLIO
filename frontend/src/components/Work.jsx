import React, { useState, useMemo } from "react";
import { portfolioItems, portfolioCategories } from "../mock";
import { ArrowUpRight, Construction } from "lucide-react";

const Work = () => {
  const [filter, setFilter] = useState("All");
  const items = useMemo(
    () => (filter === "All" ? portfolioItems : portfolioItems.filter((i) => i.category === filter)),
    [filter]
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
              These are placeholders for now — my real edits will live here as I take on more freelance briefs. Check back soon.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {portfolioCategories.map((c) => (
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <article
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl bg-[#121110] border border-[#1c1916] hover-lift img-hover ${
                i % 5 === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden checker-bg">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {item.isPlaceholder && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0a0a]/80 backdrop-blur-md border border-[#2a2520]">
                    <Construction size={12} className="text-[#ff5e3a]" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#d8cfc1]">Sample · Coming Soon</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278] mb-1">
                    {item.category} · {item.year}
                  </div>
                  <div className="font-display text-2xl text-[#f3ede1] group-hover:text-[#ff5e3a] transition-colors">
                    {item.title}
                  </div>
                </div>
                <span className="w-10 h-10 rounded-full border border-[#2a2520] flex items-center justify-center text-[#8a8278] group-hover:bg-[#ff5e3a] group-hover:border-[#ff5e3a] group-hover:text-[#0a0a0a] transition-all duration-300">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 p-8 md:p-12 rounded-3xl border border-dashed border-[#2a2520] bg-[#0c0b0a] text-center">
          <div className="font-script text-[#ff5e3a] text-3xl mb-2">More work landing soon</div>
          <p className="text-[#8a8278] max-w-xl mx-auto">
            I'm actively taking on small projects to grow my Photoshop portfolio. If you have an edit in mind, I'd love to take it on.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Work;
