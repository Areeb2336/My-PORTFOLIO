// Mock data for Areeb Rayyan's Photoshop portfolio
// Replace with backend data later

export const profile = {
  name: "Areeb Rayyan",
  shortName: "Areeb",
  role: "Photoshop Freelancer & Aspiring Visual Designer",
  tagline: "Clean cutouts, sharp selections, honest growth",
  status: "Open for freelance",
  location: "Greater Noida, India",
  university: "Galgotias University",
  course: "Bachelor of Physiotherapy",
  courseYears: "2025 \u2014 2029",
  photoUrl: "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/nihm2v2m_my%20photo.jpeg",
  shortBio: "BPT student by day, Photoshop freelancer by night \u2014 building a side hustle one edit at a time.",
  longBio: "I'm Areeb \u2014 a Bachelor of Physiotherapy student at Galgotias University, and a self-driven Photoshop freelancer on the side. I'm halfway through a complete Photoshop course and have already mastered the core editing toolkit \u2014 selections, masks, layers, blend modes, refine edge, sky replacement and more. Over the next 2 months I'm expanding into Illustrator, Premiere Pro and After Effects to become a full visual + motion designer. Right now I'm taking on small freelance briefs to sharpen my craft, build a real portfolio, and earn alongside my studies.",
  email: "areebrayyan2005@gmail.com",
  instagram: "_digitalarru",
  instagramUrl: "https://instagram.com/_digitalarru",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export const services = [
  {
    id: 1,
    number: "01",
    title: "Background Removal",
    description: "Pixel-perfect cutouts using Pen Tool, Quick Selection, Object Selection and Refine Edge. Clean transparent PNGs ready for ecommerce, social or print.",
    deliverables: ["Transparent PNG", "White / custom backdrop", "Hair & edge refinement"],
    featured: true,
  },
  {
    id: 2,
    number: "02",
    title: "Subject Isolation & Sky Replacement",
    description: "Isolate subjects, swap dull skies, and clean up busy backgrounds using channel selection, masks and Photoshop's sky replacement workflow.",
    deliverables: ["Sky swap", "Subject isolation", "Background cleanup"],
    featured: false,
  },
  {
    id: 3,
    number: "03",
    title: "Basic Compositing & Layer Effects",
    description: "Combine images cleanly using layer masks, blending modes, layer styles and gradients \u2014 perfect for thumbnails, social posts and simple posters.",
    deliverables: ["Layered composite", "Blend mode finish", "Drop shadow / glow"],
    featured: false,
  },
  {
    id: 4,
    number: "04",
    title: "Crop, Straighten & Content-Aware Cleanup",
    description: "Tighten compositions, fix tilted horizons, remove unwanted objects with Content-Aware fill, and prepare images for any platform.",
    deliverables: ["Perspective crop", "Object removal", "Platform-ready export"],
    featured: false,
  },
];

export const portfolioItems = [
  {
    id: 1,
    title: "Red Pickup Truck Cutout",
    category: "Background Removal",
    year: "2025",
    description: "Removed dark studio backdrop, kept clean edges and reflective highlights intact.",
    image: "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/c8dh4mg1_portfolio%201%20sample%202.png",
    isPlaceholder: false,
  },
  {
    id: 2,
    title: "Elephant Subject Isolation",
    category: "Background Removal",
    year: "2025",
    description: "Isolated subject from a busy outdoor scene — fine tusk and trunk edges preserved.",
    image: "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/kidhz996_portfolio%201%20sample%203.png",
    isPlaceholder: false,
  },
  {
    id: 3,
    title: "Trees & Meadow Cleanup",
    category: "Background Removal",
    year: "2025",
    description: "Removed sky and refined leaf edges for a natural, drop-in-anywhere asset.",
    image: "https://customer-assets.emergentagent.com/job_areeb-portfolio/artifacts/ymfu8rkn_portfolio%201%20sample%201.png",
    isPlaceholder: false,
  },
];

export const portfolioCategories = ["All", "Background Removal"];

export const stats = [
  { value: "70+", label: "Photoshop lessons cleared" },
  { value: "6", label: "Course projects done" },
  { value: "4", label: "Adobe tools incoming" },
  { value: "24h", label: "Avg. reply time" },
];

export const tools = [
  "Pen Tool",
  "Layer Masks",
  "Select & Mask",
  "Refine Edge",
  "Magic Wand",
  "Quick Selection",
  "Object Selection",
  "Magnetic Lasso",
  "Blend Modes",
  "Layer Styles",
  "Content-Aware Fill",
  "Sky Replacement",
];

export const marqueeWords = [
  "Background Removal",
  "Sky Replacement",
  "Pixel Precision",
  "Layer Magic",
  "Always Learning",
  "Side Hustle Mode",
];

export const roadmap = [
  {
    id: 1,
    status: "in-progress",
    badge: "Now",
    tool: "Adobe Photoshop",
    progress: 70,
    timeline: "In progress",
    description: "Mid-way through a complete Photoshop course. Selections, masks, blending, layer styles, sky replacement \u2014 all locked in.",
  },
  {
    id: 2,
    status: "upcoming",
    badge: "Month 1",
    tool: "Adobe Illustrator",
    progress: 0,
    timeline: "Starting soon",
    description: "Vectors, logos, illustrations and brand assets. Adding scalable design firepower to my freelance offering.",
  },
  {
    id: 3,
    status: "upcoming",
    badge: "Month 2",
    tool: "Adobe Premiere Pro",
    progress: 0,
    timeline: "Queued up",
    description: "Video editing for reels, ads and short-form content \u2014 the next freelance frontier.",
  },
  {
    id: 4,
    status: "upcoming",
    badge: "Month 2",
    tool: "Adobe After Effects",
    progress: 0,
    timeline: "Queued up",
    description: "Motion graphics and animation. Bringing static designs to life for thumbnails, intros and social.",
  },
];

export const aboutFacts = [
  { label: "Currently", value: "BPT Student" },
  { label: "University", value: "Galgotias University" },
  { label: "Years", value: "2025 \u2014 2029" },
  { label: "Mode", value: "Solo \u00b7 Side hustle" },
];
