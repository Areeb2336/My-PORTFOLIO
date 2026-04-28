import React from "react";
import { roadmap } from "../mock";
import { Check, Clock } from "lucide-react";

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#ff5e3a] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#ff5e3a]" />
              Learning Roadmap
            </div>
            <h2 className="font-display text-5xl md:text-8xl leading-[0.9] text-[#f3ede1]">
              The <span className="font-serif-italic text-[#ff5e3a]">2-month</span> plan
            </h2>
          </div>
          <p className="max-w-md text-[#8a8278] text-base md:text-lg">
            I believe in building in public. Here's exactly where I am in my Adobe journey — and what's coming next.
          </p>
        </div>

        <div className="relative">
          {/* Timeline rail */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-[#ff5e3a] via-[#3a322b] to-[#1c1916]" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {roadmap.map((item, i) => {
              const isNow = item.status === "in-progress";
              return (
                <div
                  key={item.id}
                  className={`relative p-6 md:p-7 rounded-2xl border transition-colors duration-300 ${
                    isNow
                      ? "bg-[#1a0f0a] border-[#ff5e3a]"
                      : "bg-[#121110] border-[#1c1916] hover:border-[#3a322b]"
                  }`}
                >
                  {/* Dot */}
                  <div className="hidden md:flex absolute -top-[34px] left-7 w-5 h-5 rounded-full items-center justify-center">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isNow ? "bg-[#ff5e3a] animate-pulse" : "bg-[#3a322b]"
                      }`}
                    />
                    <span
                      className={`absolute w-5 h-5 rounded-full ${
                        isNow ? "bg-[#ff5e3a]/30" : "bg-transparent"
                      }`}
                    />
                  </div>

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
                      <Check className="text-[#5b554d]" size={16} />
                    )}
                  </div>

                  <div className="font-display text-2xl md:text-3xl text-[#f3ede1] leading-tight mb-3">
                    {item.tool}
                  </div>
                  <p className="text-sm text-[#d8cfc1] leading-relaxed mb-6">{item.description}</p>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#8a8278] mb-2">
                      <span>{item.timeline}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-1 bg-[#1c1916] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isNow ? "bg-[#ff5e3a]" : "bg-[#3a322b]"}`}
                        style={{ width: `${Math.max(item.progress, 4)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 p-6 md:p-8 rounded-2xl border border-dashed border-[#2a2520] bg-[#0c0b0a] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="font-script text-[#ff5e3a] text-2xl md:text-3xl">Why hire me now?</div>
            <p className="text-[#8a8278] text-sm md:text-base mt-1 max-w-2xl">
              You get a hungry, learning-fast freelancer at student-friendly rates — and a designer who'll only get more powerful with every passing week.
            </p>
          </div>
          <a
            href="#contact"
            className="btn-accent inline-flex items-center justify-center px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase font-medium whitespace-nowrap"
          >
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
