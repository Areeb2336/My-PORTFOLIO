import React, { useEffect, useState } from "react";
import { useContent } from "../contexts/ContentContext";
import { profile as fallbackProfile } from "../mock";
import { Menu, X } from "lucide-react";
import PlatformIcon from "./PlatformIcon";

const defaultLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Learning", href: "#roadmap" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const { content } = useContent();
  const profile = content.profile || fallbackProfile;
  const socialProfiles = content.socialProfiles || [];
  const navLinks = defaultLinks;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#0a0a0a]/85 backdrop-blur-md border-b border-[#1c1916]" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <button
          onClick={() => handleNav("#top")}
          className="flex items-center gap-2 group"
          aria-label={`${profile.name} home`}
        >
          <span className="w-9 h-9 rounded-full bg-[#ff5e3a] flex items-center justify-center text-[#0a0a0a] font-display text-lg leading-none">
            {(profile.shortName || profile.name || "A").charAt(0)}
          </span>
          <span className="hidden sm:flex flex-col leading-tight text-left">
            <span className="font-display text-xl tracking-wide">{profile.shortName || profile.name}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8a8278]">Photoshop · Freelance</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm tracking-wide text-[#d8cfc1] hover:text-[#ff5e3a] link-underline transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {socialProfiles.slice(0, 3).map((sp) => (
            <a
              key={sp.id || sp.url}
              href={sp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#2a2520] flex items-center justify-center text-[#d8cfc1] hover:bg-[#ff5e3a] hover:border-[#ff5e3a] hover:text-[#0a0a0a] transition-all duration-200"
              aria-label={sp.label || sp.platform}
              title={sp.label || sp.platform}
            >
              <PlatformIcon platform={sp.platform} size={15} />
            </a>
          ))}
          <button
            onClick={() => handleNav("#contact")}
            className="btn-outline-accent text-xs tracking-[0.2em] uppercase px-5 py-3 rounded-full"
          >
            Hire Me
          </button>
        </div>

        <button
          className="md:hidden text-[#f3ede1] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-[#1c1916]">
          <div className="px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left text-base text-[#d8cfc1] hover:text-[#ff5e3a]"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#contact")}
              className="btn-outline-accent text-xs tracking-[0.2em] uppercase px-5 py-3 rounded-full self-start"
            >
              Hire Me
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
