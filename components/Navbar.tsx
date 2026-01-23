"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpider, FaChevronDown, FaBolt } from "react-icons/fa6";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const eventLinks = [
    { name: "Non Technical", href: "/events/on-stage", jp: "ステージ" },
    { name: "Technical", href: "/events/off-stage", jp: "オフステージ" },
    { name: "Culturals", href: "/events/culturals", jp: "文化" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] px-2 md:px-10 pt-4 transition-all duration-300">

      {/* --- GLOBAL STYLES (Keep consistent with Footer) --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Roboto+Mono:wght@700&family=Noto+Sans+JP:wght@900&display=swap');
        .font-comic { font-family: 'Bangers', cursive; letter-spacing: 0.1em; }
        .font-tech { font-family: 'Roboto Mono', monospace; }
        .font-jp { font-family: 'Noto Sans JP', sans-serif; }
        
        .bg-dots {
          background-image: radial-gradient(circle, #333 1px, transparent 1px);
          background-size: 10px 10px;
        }

        .glitch-nav-text { position: relative; }
        .glitch-nav-text::before, .glitch-nav-text::after {
          content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000;
        }
        .glitch-nav-text::before {
          left: 2px; text-shadow: -2px 0 #ff003c; clip-path: inset(0 0 0 0); animation: glitch-nav 2s infinite linear alternate-reverse;
        }
        .glitch-nav-text::after {
          left: -2px; text-shadow: -2px 0 #00f0ff; clip-path: inset(0 0 0 0); animation: glitch-nav-2 3s infinite linear alternate-reverse;
        }
        @keyframes glitch-nav {
          0% { clip-path: inset(10% 0 90% 0); } 100% { clip-path: inset(90% 0 10% 0); }
        }
        @keyframes glitch-nav-2 {
          0% { clip-path: inset(90% 0 10% 0); } 100% { clip-path: inset(10% 0 90% 0); }
        }
      `}</style>

      {/* --- THE FLOATING COMIC PANEL --- */}
      <div
        className={`max-w-7xl mx-auto flex justify-between items-center px-6 py-3 transition-all duration-300 relative border-2
          ${isScrolled
            ? "bg-black/90 backdrop-blur-xl border-[#00f0ff] shadow-[5px_5px_0px_#00f0ff] -skew-x-1"
            : "bg-black/60 border-transparent md:border-[#333] shadow-none"
          }`}
      >
        {/* Top Hazard Bar (Only visible when scrolled) */}
        {isScrolled && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff003c] via-[#fff000] to-[#00f0ff]" />
        )}

        {/* --- LOGO SECTION --- */}
        <Link href="/" className="flex items-center gap-4 group relative z-50">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            className="relative p-2 border-2 border-white bg-black shadow-[4px_4px_0px_#ff003c]"
          >
            <div className="absolute inset-0 bg-dots opacity-50" />
            <FaSpider className="text-white text-2xl relative z-10" />
          </motion.div>

          <div className="flex flex-col relative">
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none text-white font-comic glitch-nav-text" data-text="SYMPOSIUM">
              ARA<span className="text-[#ff003c]">ZON</span>
            </span>
            <span className="text-[8px] font-tech text-[#00f0ff] tracking-[0.3em] uppercase absolute -bottom-2 left-0 bg-black px-1">
              Symposium
            </span>
          </div>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-8">

          {/* Events Dropdown (Holo-Panel Style) */}
          <div
            className="relative"
            onMouseEnter={() => setIsEventsOpen(true)}
            onMouseLeave={() => setIsEventsOpen(false)}
          >
            <button className="text-sm font-black uppercase italic tracking-widest text-zinc-300 hover:text-[#fff000] transition-colors flex items-center gap-2 group py-2 font-comic">
              <FaBolt className="text-[#ff003c] text-xs group-hover:animate-pulse" />
              Events
              <FaChevronDown size={10} className={`transition-transform duration-200 ${isEventsOpen ? 'rotate-180 text-[#00f0ff]' : ''}`} />
            </button>

            <AnimatePresence>
              {isEventsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, skewX: 0 }}
                  animate={{ opacity: 1, y: 0, skewX: -3 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute top-full left-0 w-56 bg-black border-2 border-[#ff003c] shadow-[8px_8px_0px_rgba(0,0,0,0.8)] p-1 z-50"
                >
                  <div className="bg-[#111] p-2 relative overflow-hidden">
                    {/* Scanlines on dropdown */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]" />

                    {eventLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-3 mb-1 text-sm font-black uppercase tracking-widest text-white hover:bg-[#00f0ff] hover:text-black hover:skew-x-6 transition-all relative group z-10 font-comic border border-transparent hover:border-black"
                      >
                        <div className="flex justify-between items-center">
                          <span>{link.name}</span>
                          <span className="text-[8px] font-jp opacity-0 group-hover:opacity-100 text-black font-black">{link.jp}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/contact" className="text-sm font-black uppercase italic tracking-widest text-zinc-300 hover:text-[#fff000] transition-colors flex items-center gap-2 group font-comic">
            <span className="w-2 h-2 bg-[#00f0ff] rotate-45 group-hover:rotate-90 transition-transform" />
            Contact
          </Link>

          <Link href="/register" className="text-sm font-black uppercase italic tracking-widest text-zinc-300 hover:text-[#fff000] transition-colors flex items-center gap-2 group font-comic">
            <span className="w-2 h-2 bg-[#00f0ff] rotate-45 group-hover:rotate-90 transition-transform" />
            Register
          </Link>

          {/* Login Button (Glitch Button) */}
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-2 bg-[#ff003c] border-2 border-transparent hover:border-white hover:bg-black group skew-x-[-10deg] shadow-[4px_4px_0px_#000]"
            >
              <span className="relative z-10 text-sm font-black uppercase italic tracking-widest text-black group-hover:text-white transition-colors font-comic block skew-x-[10deg]">
                Login <span className="font-jp text-xs ml-1">ログイン</span>
              </span>
            </motion.button>
          </Link>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button
          className="md:hidden text-white bg-[#ff003c] p-2 border-2 border-black shadow-[3px_3px_0px_#00f0ff] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <IoClose size={24} /> : <HiOutlineMenuAlt3 size={24} />}
        </button>
      </div>

      {/* --- MOBILE SIDEBAR MENU (COMIC PAGE STYLE) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%)" }}
            exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#fff000] z-[110] p-1 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Inner Black Container for Contrast */}
            <div className="bg-black h-full w-full relative overflow-hidden flex flex-col p-8">

              {/* Background Texture */}
              <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none text-[#ff003c]">
                <FaSpider size={300} />
              </div>

              <div className="flex justify-between items-center mb-12 border-b-2 border-[#ff003c] pb-4">
                <span className="text-3xl font-black font-comic text-white italic">MENU <span className="text-[#00f0ff] text-sm not-italic font-jp">メニュー</span></span>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-[#ff003c] transition-colors"><IoClose size={40} /></button>
              </div>

              <div className="flex flex-col gap-6 relative z-10">
                {/* Mobile Events */}
                <div className="flex flex-col gap-2">
                  <p className="text-[#00f0ff] font-tech text-xs tracking-widest uppercase mb-2">// 01. EVENTS</p>
                  {eventLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-4xl font-black uppercase italic text-transparent stroke-white stroke-1 hover:text-[#ff003c] hover:stroke-0 transition-all font-comic"
                      style={{ WebkitTextStroke: "1px white" }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Other Links */}
                <div className="h-[1px] w-full bg-zinc-800 my-2" />

                <Link href="/contact" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase italic text-white hover:text-[#fff000] transition-colors font-comic flex items-center justify-between">
                  Contact <span className="text-xs font-jp text-zinc-500">連絡</span>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase italic text-white hover:text-[#fff000] transition-colors font-comic flex items-center justify-between">
                  Register <span className="text-xs font-jp text-zinc-500">登録</span>
                </Link>
              </div>

              <div className="mt-auto border-t-2 border-[#00f0ff] pt-6 flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-[#ff003c] text-black py-4 font-black uppercase italic tracking-widest hover:bg-white transition-colors border-2 border-transparent hover:border-black font-comic text-xl">
                    Login
                  </button>
                </Link>
                <div className="flex justify-between text-zinc-500 font-tech text-[10px]">
                  <span>SECURE_CONNECTION</span>
                  <span>v.2.0.4</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}