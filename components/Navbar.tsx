"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpider, FaTerminal } from "react-icons/fa6";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "The Mission", href: "#hero" },
    { name: "Rewards", href: "#prizes" },
    { name: "Rules", href: "#rules" },
    { name: "Portal", href: "/login" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] px-4 md:px-10 pt-6 transition-all duration-500">
      {/* Floating Island Container */}
      <div 
        className={`max-w-6xl mx-auto flex justify-between items-center px-6 py-3 transition-all duration-500 relative
          ${isScrolled 
            ? "bg-black/60 backdrop-blur-xl border border-red-600/50 shadow-[0_0_30px_rgba(220,38,38,0.2)] rounded-full" 
            : "bg-transparent border-transparent rounded-none"
          }`}
      >
        {/* --- SPIDER WEB ACCENT LINES --- */}
        <div className="absolute top-0 left-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        <div className="absolute bottom-0 right-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <motion.div 
            whileHover={{ rotate: 360, scale: 1.2 }}
            className="p-2 bg-red-600 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.6)]"
          >
            <FaSpider className="text-black text-xl" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-black italic tracking-tighter uppercase leading-none">
              SYMPO<span className="text-red-600">SIUM</span>
            </span>
            <span className="text-[8px] font-bold text-zinc-500 tracking-[0.3em] uppercase">SJC Trichy</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300 hover:text-red-600 transition-all flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform" />
              {link.name}
            </Link>
          ))}
          
          <Link href="/register">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-2 overflow-hidden bg-zinc-900 border border-red-600 group rounded-md"
            >
              {/* Button Web Animation */}
              <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 text-xs font-black uppercase tracking-widest text-red-600 group-hover:text-black transition-colors">
                Initialize Login
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-red-600 p-2 hover:bg-red-600/10 rounded-full transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoClose size={28} /> : <HiOutlineMenuAlt3 size={28} />}
        </button>
      </div>

      {/* --- MOBILE SIDEBAR MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-[80%] bg-zinc-950 border-l border-red-600/30 z-[110] p-10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
          >
            <div className="flex justify-between items-center mb-16">
              <FaSpider size={40} className="text-red-600" />
              <button onClick={() => setIsOpen(false)} className="text-zinc-500"><IoClose size={32} /></button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-black uppercase italic text-white hover:text-red-600 transition-colors"
                >
                  <span className="text-red-600 mr-4 font-mono text-lg">0{idx + 1}.</span>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t border-zinc-800 pt-6">
              <p className="text-[10px] font-mono text-zinc-500 mb-4 tracking-tighter">SECURE_CHANNEL: ACTIVE</p>
              <button className="w-full bg-red-600 text-black py-4 font-black uppercase italic tracking-tighter">
                Access Portal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}