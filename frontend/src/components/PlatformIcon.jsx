import React from "react";
import {
  SiUpwork,
  SiFiverr,
  SiBehance,
  SiDribbble,
  SiGithub,
  SiYoutube,
  SiX,
  SiInstagram,
  SiFacebook,
  SiPinterest,
  SiThreads,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Briefcase } from "lucide-react";

const ICONS = {
  upwork: SiUpwork,
  fiverr: SiFiverr,
  behance: SiBehance,
  dribbble: SiDribbble,
  linkedin: FaLinkedin,
  github: SiGithub,
  youtube: SiYoutube,
  twitter: SiX,
  x: SiX,
  instagram: SiInstagram,
  facebook: SiFacebook,
  pinterest: SiPinterest,
  threads: SiThreads,
};

export const PLATFORM_OPTIONS = [
  { value: "upwork", label: "Upwork" },
  { value: "fiverr", label: "Fiverr" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "pinterest", label: "Pinterest" },
  { value: "threads", label: "Threads" },
  { value: "other", label: "Other" },
];

const PlatformIcon = ({ platform, size = 18, className = "" }) => {
  const key = (platform || "").toLowerCase();
  const Icon = ICONS[key] || Briefcase;
  return <Icon size={size} className={className} />;
};

export default PlatformIcon;
