import React from "react";
import { ArrowDownRight, Sparkles } from "lucide-react";
import { profile, stats } from "../mock";

const Hero = () => {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="relative pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="absolute inset-0 accent-glow pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-center gap-3 mb-8 rise">
          <span className="w-2 h-2 rounded-full bg-[#ff5e3a] animate-pulse" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#8a8278]">{profile.status}</span>
        </div>

        <h1 className="font-display text-[18vw] md:text-[12vw] lg:text-[11.5rem] leading-[0.85] tracking-tight rise">
          AREEB
          <br />
          <span className="text-[#ff5e3a]">RAYYAN</span>
          <span className="font-serif-italic text-[#f3ede1] text-[10vw] md:text-[6vw] lg:text-[5rem] align-super ml-2">.</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="md:col-span-7">
            <p className="text-lg md:text-2xl leading-relaxed text-[#d8cfc1] max-w-2xl rise" style={{ animationDelay: "0.15s" }}>
              <span className="font-script text-[#ff5e3a] text-3xl md:text-4xl mr-1">{profile.tagline.split(",")[0]},</span>
              {profile.tagline.split(",").slice(1).join(",")}.
            </p>
            <p className="mt-6 text-sm md:text-base text-[#8a8278] max-w-xl rise" style={{ animationDelay: "0.25s" }}>
              {profile.shortBio}
            </p>

            <div className="mt-10 flex flex-wrap gap-4 rise" style={{ animationDelay: "0.35s" }}>
              <button
                onClick={() => scrollTo("#work")}
                className="btn-accent inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm tracking-[0.2em] uppercase font-medium"
              >
                See My Work
                <ArrowDownRight size={16} />
              </button>
              <button
                onClick={() => scrollTo("#contact")}
                className="btn-outline-accent inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm tracking-[0.2em] uppercase"
              >
                <Sparkles size={14} />
                Start a Project
              </button>
            </div>
          </div>

          <div className="md:col-span-5 md:pl-8 md:border-l md:border-[#1c1916]">
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {stats.map((s, i) => (
                <div key={i} className="rise" style={{ animationDelay: `${0.4 + i * 0.05}s` }}>
                  <div className="font-display text-5xl md:text-6xl text-[#f3ede1]">{s.value}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8a8278]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
