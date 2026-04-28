import React from "react";
import { profile, tools } from "../mock";
import { Layers, Wand2, Scissors, Sparkles } from "lucide-react";

const icons = [Scissors, Layers, Wand2, Sparkles];

const About = () => {
  return (
    <section id="about" className="py-24 md:py-36 relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <div className="sticky top-32">
              <div className="text-xs uppercase tracking-[0.3em] text-[#ff5e3a] mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-[#ff5e3a]" />
                About
              </div>
              <h2 className="font-display text-6xl md:text-7xl leading-[0.95] text-[#f3ede1]">
                A learner
                <br />
                <span className="font-serif-italic text-[#ff5e3a]">obsessed</span>
                <br />
                with pixels.
              </h2>
            </div>
          </div>

          <div className="md:col-span-8">
            <p className="text-xl md:text-2xl leading-relaxed text-[#d8cfc1]">
              {profile.longBio}
            </p>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Specialty", value: "Background Removal" },
                { label: "Status", value: "Learning daily" },
                { label: "Based in", value: profile.location },
                { label: "Since", value: profile.experience },
              ].map((item, i) => {
                const Icon = icons[i];
                return (
                  <div key={i} className="p-5 rounded-2xl bg-[#121110] border border-[#1c1916] hover-lift">
                    <Icon className="text-[#ff5e3a] mb-3" size={20} />
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{item.label}</div>
                    <div className="mt-1 text-sm text-[#f3ede1]">{item.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <div className="text-xs uppercase tracking-[0.3em] text-[#8a8278] mb-4">Toolkit</div>
              <div className="flex flex-wrap gap-3">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-full border border-[#2a2520] text-sm text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a] transition-colors duration-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
