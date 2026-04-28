import React from "react";
import { useContent } from "../contexts/ContentContext";
import { profile as fallbackProfile } from "../mock";
import { Instagram, Mail, ArrowUp } from "lucide-react";
import PlatformIcon from "./PlatformIcon";

const Footer = () => {
  const { content } = useContent();
  const profile = content.profile || fallbackProfile;
  const socialProfiles = content.socialProfiles || [];
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-[#1c1916] bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <div className="font-display text-6xl md:text-8xl text-[#f3ede1] leading-none uppercase">
              {profile.shortName || (profile.name || "").split(" ")[0]}<span className="text-[#ff5e3a]">.</span>
            </div>
            <div className="mt-4 text-[#8a8278] max-w-md">
              {profile.role}. {profile.location}.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="w-12 h-12 rounded-full border border-[#2a2520] flex items-center justify-center text-[#d8cfc1] hover:bg-[#ff5e3a] hover:border-[#ff5e3a] hover:text-[#0a0a0a] transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href={profile.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border border-[#2a2520] flex items-center justify-center text-[#d8cfc1] hover:bg-[#ff5e3a] hover:border-[#ff5e3a] hover:text-[#0a0a0a] transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            {socialProfiles.map((sp) => (
              <a
                key={sp.id || sp.url}
                href={sp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-[#2a2520] flex items-center justify-center text-[#d8cfc1] hover:bg-[#ff5e3a] hover:border-[#ff5e3a] hover:text-[#0a0a0a] transition-all duration-300"
                aria-label={sp.label || sp.platform}
                title={sp.label || sp.platform}
              >
                <PlatformIcon platform={sp.platform} size={18} />
              </a>
            ))}
            <button
              onClick={toTop}
              className="w-12 h-12 rounded-full border border-[#2a2520] flex items-center justify-center text-[#d8cfc1] hover:bg-[#ff5e3a] hover:border-[#ff5e3a] hover:text-[#0a0a0a] transition-all duration-300"
              aria-label="Back to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1c1916] flex flex-col md:flex-row justify-between gap-4 text-xs text-[#5b554d]">
          <div>© {year} {profile.name}. Crafted with care.</div>
          <div className="flex items-center gap-4">
            <span>Built for freelance briefs</span>
            <span className="w-1 h-1 rounded-full bg-[#3a322b]" />
            <span>Always learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
