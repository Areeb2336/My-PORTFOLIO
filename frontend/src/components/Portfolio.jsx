import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Services from "./Services";
import Work from "./Work";
import Contact from "./Contact";
import Footer from "./Footer";

const Portfolio = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f3ede1] overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
