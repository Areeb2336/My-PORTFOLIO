import React from "react";
import { profile, tools, aboutFacts } from "../mock";
import { GraduationCap, MapPin, User, Sparkles } from "lucide-react";

const icons = [User, GraduationCap, Sparkles, MapPin];

const About = () => {
  return (
    <section id="about" className="py-24 md:py-36 relative">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Photo column */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-3 bg-[#ff5e3a]/10 rounded-3xl blur-xl" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl border border-[#1c1916] img-hover">
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-[520px] md:h-[620px] object-cover grayscale"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <div className="font-display text-3xl text-[#f3ede1] leading-none">{profile.name}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[#d8cfc1]">{profile.role}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-[#ff5e3a] text-[#0a0a0a] font-medium">
                    Hello
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[#8a8278]">
                <span>Greater Noida · India</span>
                <span className="font-script normal-case tracking-normal text-[#ff5e3a] text-2xl">est. 2025</span>
              </div>
            </div>
          </div>

          {/* Content column */}
          <div className="lg:col-span-7 lg:pl-4">
            <div className="text-xs uppercase tracking-[0.3em] text-[#ff5e3a] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[#ff5e3a]" />
              About
            </div>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] text-[#f3ede1]">
              Student by day,
              <br />
              <span className="font-serif-italic text-[#ff5e3a]">freelancer</span>
              <br />
              by night.
            </h2>

            <p className="mt-8 text-lg md:text-xl leading-relaxed text-[#d8cfc1]">
              {profile.longBio}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {aboutFacts.map((item, i) => {
                const Icon = icons[i];
                return (
                  <div key={i} className="p-5 rounded-2xl bg-[#121110] border border-[#1c1916] hover-lift">
                    <Icon className="text-[#ff5e3a] mb-3" size={18} />
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#8a8278]">{item.label}</div>
                    <div className="mt-1 text-sm md:text-base text-[#f3ede1]">{item.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <div className="text-xs uppercase tracking-[0.3em] text-[#8a8278] mb-4">Photoshop Toolkit</div>
              <div className="flex flex-wrap gap-2">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="px-4 py-2 rounded-full border border-[#2a2520] text-xs md:text-sm text-[#d8cfc1] hover:border-[#ff5e3a] hover:text-[#ff5e3a] transition-colors duration-200"
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
