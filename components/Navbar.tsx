"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSpider, FaBars, FaXmark } from "react-icons/fa6";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Mission", href: "#hero" },
    { name: "Rewards", href: "#prizes" },
    { name: "Rules", href: "#rules" },
    { name: "Portal", href: "/login" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? "py-2 bg-black/80 backdrop-blur-md border-b-2 border-red-600" : "py-6 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-red-600 skew-x-[-12deg] group-hover:rotate-[360deg] transition-transform duration-500">
            <FaSpider className="text-black text-2xl" />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase">
            CODE<span className="text-red-600">VERSE</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-black uppercase tracking-widest hover:text-red-600 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
          ))}
          <Link href="/register">
            <button className="bg-red-600 text-black px-6 py-2 font-black uppercase italic skew-x-[-12deg] hover:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none">
              Join Mission
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-red-600 text-3xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        className="fixed inset-0 bg-black z-[-1] flex flex-col items-center justify-center gap-8 md:hidden border-l-4 border-red-600"
      >
        {navLinks.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            onClick={() => setIsOpen(false)}
            className="text-4xl font-black uppercase italic hover:text-red-600"
          >
            {link.name}
          </Link>
        ))}
      </motion.div>
    </nav>
  );
}