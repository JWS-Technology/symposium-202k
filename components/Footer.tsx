"use client";

import { motion } from "framer-motion";
import { FaSpider, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaCode, FaMicrochip, FaGlobe } from "react-icons/fa6";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Organized into categories for "Easy Navigation"
  const sections = [
    {
      title: "Navigation",
      links: [
        { name: "Mission Control", href: "#hero", icon: <FaMicrochip /> },
        { name: "Live Events", href: "/events", icon: <FaCode /> },
        { name: "Multiverse Map", href: "/map", icon: <FaGlobe /> },
      ],
    },
    {
      title: "Legals",
      links: [
        { name: "Protocol Rules", href: "#rules", icon: undefined },
        { name: "Data Privacy", href: "/privacy", icon: undefined },
        { name: "Security Info", href: "/security", icon: undefined },
      ],
    },
  ];

  return (
    <footer className="relative bg-black border-t border-zinc-900 pt-20 pb-10 overflow-hidden">

      {/* --- ANIMATION: FLOATING BACKGROUND WEBS --- */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-0 right-0"
        >
          <FaSpider size={300} className="text-red-600 rotate-180" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

          {/* --- BRAND BLOCK (Stays prominent) --- */}
          <div className="md:col-span-4 flex flex-col space-y-6">
            <Link href="/" className="group inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-600 blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-3 bg-red-600 skew-x-[-15deg] shadow-[4px_4px_0px_white]">
                    <FaSpider className="text-black text-2xl -skew-x-[-15deg]" />
                  </div>
                </div>
                <span className="text-3xl font-black italic tracking-tighter text-white">
                  IT<span className="text-red-600">SYMPOSIUM</span>
                </span>
              </motion.div>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
              Weaving the future of technology through innovation,
              collaboration, and the power of code. Access the multiverse.
            </p>
            <div className="flex gap-3">
              {[FaXTwitter, FaGithub, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5, backgroundColor: "#dc2626", color: "#000" }}
                  className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-zinc-500 rounded-full transition-all"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* --- STRUCTURED NAVIGATION --- */}
          <div className="md:col-span-5 grid grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-red-600 font-black uppercase text-xs tracking-[0.3em] mb-8">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link, lIdx) => (
                    <motion.li
                      key={lIdx}
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: lIdx * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                      >
                        <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                          {link.icon || <FaSpider size={12} />}
                        </span>
                        <span className="text-sm font-bold uppercase tracking-tight">
                          {link.name}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* --- TERMINAL FEED / NEWSLETTER --- */}
          <div className="md:col-span-3">
            <h4 className="text-red-600 font-black uppercase text-xs tracking-[0.3em] mb-8">
              System Updates
            </h4>
            <div className="bg-zinc-900/50 p-1 border border-zinc-800 rounded-lg">
              <div className="bg-black p-4 border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Incoming_Signal...</span>
                </div>
                <input
                  type="email"
                  placeholder="USER@MULTIVERSE.NET"
                  className="w-full bg-transparent border-b border-zinc-800 py-2 text-xs font-mono text-white focus:border-red-600 outline-none placeholder:text-zinc-700"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-2 bg-red-600 text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-colors"
                >
                  Sync Interface
                </motion.button>
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM STATUS BAR --- */}
        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
            <span>© {currentYear} IT DEPARTMENT • SJC</span>
            <span className="hidden md:block">|</span>
            <span className="hover:text-red-600 cursor-pointer transition-colors"><a href="https://jwstechnologies.com" target="_blank">JWS Technologies</a></span>
          </div>

          {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-4 bg-zinc-900/30 px-4 py-2 rounded-full border border-zinc-800"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center">
                  <FaSpider className="text-[10px] text-red-600" />
                </div>
              ))}
            </div>
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-tighter">
              JWS Team
            </span>
          </motion.div> */}
        </div>
      </div>

      {/* Decorative Red Line with Shadow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_-5px_15px_rgba(220,38,38,0.5)]" />
    </footer>
  );
}