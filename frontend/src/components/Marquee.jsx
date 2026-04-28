import React from "react";
import { marqueeWords } from "../mock";
import { Asterisk } from "lucide-react";

const Marquee = () => {
  const items = [...marqueeWords, ...marqueeWords];
  return (
    <section className="py-10 border-y border-[#1c1916] bg-[#0c0b0a] overflow-hidden tilt-ticker">
      <div className="flex whitespace-nowrap marquee-track">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-6 mx-6 font-display text-4xl md:text-6xl text-[#f3ede1]">
            {w}
            <Asterisk className="text-[#ff5e3a]" size={28} />
          </span>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
