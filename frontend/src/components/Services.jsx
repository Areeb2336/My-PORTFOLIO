import React, { useState } from "react";
import { useContent } from "../contexts/ContentContext";
import { services as fallbackServices } from "../mock";
import { ArrowUpRight, Check } from "lucide-react";

const Services = () => {
  const { content } = useContent();
  const services = content.services && content.services.length ? content.services : fallbackServices;
  const [active, setActive] = useState(0);
  const cur = services[active] || services[0];

  return (
    <section id="services" className="py-24 md:py-36 bg-[#0c0b0a] border-y border-[#1c1916]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#ff5e3a] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#ff5e3a]" />
              Services
            </div>
            <h2 className="font-display text-6xl md:text-8xl leading-[0.9] text-[#f3ede1]">
              What I <span className="font-serif-italic text-[#ff5e3a]">do</span>
            </h2>
          </div>
          <p className="max-w-md text-[#8a8278] text-base md:text-lg">
            Everything below is built on tools I've already mastered in my Photoshop course — selections, masks, blending and refine edge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 divide-y divide-[#1c1916] border-y border-[#1c1916]">
            {services.map((s, i) => (
              <button
                key={s.id || i}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group w-full flex items-center justify-between gap-6 py-7 md:py-9 px-2 md:px-4 text-left transition-colors duration-300 hover:bg-[#0a0a0a]"
              >
                <div className="flex items-center gap-6 md:gap-10 min-w-0">
                  <span className="font-display text-2xl text-[#5b554d] group-hover:text-[#ff5e3a] transition-colors">{s.number}</span>
                  <span className="font-display text-2xl md:text-4xl lg:text-5xl text-[#f3ede1] group-hover:text-[#ff5e3a] transition-colors leading-tight">
                    {s.title}
                  </span>
                  {s.featured && (
                    <span className="hidden xl:inline-block text-[10px] uppercase tracking-[0.25em] px-2 py-1 rounded-full border border-[#ff5e3a] text-[#ff5e3a] whitespace-nowrap">
                      Specialty
                    </span>
                  )}
                </div>
                <ArrowUpRight
                  className="text-[#5b554d] group-hover:text-[#ff5e3a] group-hover:rotate-45 transition-all duration-300 shrink-0"
                  size={28}
                />
              </button>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-32 p-8 md:p-10 rounded-2xl bg-[#121110] border border-[#1c1916] min-h-[420px]">
              <div className="text-xs uppercase tracking-[0.25em] text-[#8a8278] mb-4">
                {cur.number} — Currently viewing
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-[#f3ede1] mb-5 leading-tight">
                {cur.title}
              </h3>
              <p className="text-[#d8cfc1] text-base md:text-lg leading-relaxed">
                {cur.description}
              </p>
              {cur.deliverables && cur.deliverables.length > 0 && (
                <div className="mt-8">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278] mb-4">Deliverables</div>
                  <ul className="space-y-3">
                    {cur.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-3 text-[#d8cfc1]">
                        <span className="w-6 h-6 rounded-full bg-[#ff5e3a]/15 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-[#ff5e3a]" />
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
