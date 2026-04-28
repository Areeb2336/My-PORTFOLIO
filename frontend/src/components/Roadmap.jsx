import React from "react";
import { useContent } from "../contexts/ContentContext";
import { roadmap as fallbackRoadmap } from "../mock";
import { Clock, Sparkles } from "lucide-react";

const Roadmap = () => {
  const { content } = useContent();
  const items = (content.roadmap && content.roadmap.length ? content.roadmap : fallbackRoadmap);

  return (
    <section id="roadmap" className="py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#ff5e3a] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#ff5e3a]" />
              Currently Learning
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] text-[#f3ede1]">
              What I'm learning <span className="font-serif-italic text-[#ff5e3a]">next</span>
            </h2>
          </div>
          <p className="max-w-md text-[#8a8278] text-base md:text-lg">
            A quick look at the tools I'm working through right now and the ones lined up after.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const isNow = item.status === "in-progress";
            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border transition-colors duration-300 ${
                  isNow
                    ? "bg-[#1a0f0a] border-[#ff5e3a]"
                    : "bg-[#121110] border-[#1c1916] hover:border-[#3a322b]"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full ${
                      isNow
                        ? "bg-[#ff5e3a] text-[#0a0a0a]"
                        : "border border-[#2a2520] text-[#8a8278]"
                    }`}
                  >
                    {item.badge}
                  </span>
                  {isNow ? (
                    <Clock className="text-[#ff5e3a]" size={16} />
                  ) : (
                    <Sparkles className="text-[#5b554d]" size={16} />
                  )}
                </div>
                <div className="font-display text-2xl md:text-[1.65rem] text-[#f3ede1] leading-tight mb-3">
                  {item.tool}
                </div>
                <p className="text-sm text-[#d8cfc1] leading-relaxed mb-4">{item.description}</p>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{item.timeline}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
