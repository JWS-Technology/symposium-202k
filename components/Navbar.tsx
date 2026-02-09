"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpider, FaChevronDown, FaBolt, FaCircleInfo, FaCalendarDays } from "react-icons/fa6";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false); // New state for Rules/Schedule dropdown
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const [mobileProtocolOpen, setMobileProtocolOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const eventLinks = [
    { name: "Technical", href: "/events/technical", jp: "技術的" },
    { name: "Non Technical", href: "/events/non-technical", jp: "非技術的" },
    { name: "Culturals", href: "/events/culturals", jp: "文化祭" },
  ];

  // Grouped Rules and Schedule
  const protocolLinks = [
    { name: "Rules", href: "/rules", jp: "規約", icon: <FaCircleInfo size={12} /> },
    { name: "Schedule", href: "/schedule", jp: "予定表", icon: <FaCalendarDays size={12} /> },
  ];

  const mainLinks = [
    { name: "Contact", href: "/contact", jp: "連絡先" },
    { name: "Register", href: "/register", jp: "登録" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] px-3 md:px-10 pt-4 transition-all duration-300">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Roboto+Mono:wght@700&family=Noto+Sans+JP:wght@900&display=swap');
        .font-comic { font-family: 'Bangers', cursive; letter-spacing: 0.1em; }
        .font-tech { font-family: 'Roboto Mono', monospace; }
        .font-jp { font-family: 'Noto Sans JP', sans-serif; }
        .bg-dots { background-image: radial-gradient(circle, #333 1px, transparent 1px); background-size: 10px 10px; }
        .stroke-comic { -webkit-text-stroke: 1px white; }
      `}</style>

      {/* --- HEADER PANEL --- */}
      <div className={`max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-3 transition-all duration-300 relative border-2 ${isScrolled ? "bg-black/95 backdrop-blur-xl border-[#00f0ff] shadow-[5px_5px_0px_#00f0ff] -skew-x-1" : "bg-black/60 border-transparent md:border-[#333] shadow-none"}`}>
        {isScrolled && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff003c] via-[#fff000] to-[#00f0ff]" />}

        <Link href="/" className="flex items-center gap-3 relative z-[150]">
          <motion.div whileHover={{ rotate: 180 }} className="p-1.5 border-2 border-white bg-black shadow-[3px_3px_0px_#ff003c]">
            <FaSpider className="text-white text-xl" />
          </motion.div>
          <span className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none text-white font-comic">ARA<span className="text-[#ff003c]">ZON</span></span>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden lg:flex items-center gap-8">

          {/* EVENTS DROPDOWN */}
          <div className="relative" onMouseEnter={() => setIsEventsOpen(true)} onMouseLeave={() => setIsEventsOpen(false)}>
            <button className="text-sm font-black uppercase italic tracking-widest text-zinc-300 hover:text-[#fff000] flex items-center gap-2 font-comic">
              <FaBolt className="text-[#ff003c] text-xs" /> Events <FaChevronDown size={10} className={isEventsOpen ? 'rotate-180' : ''} />
            </button>
            <AnimatePresence>
              {isEventsOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-56 bg-black border-2 border-[#ff003c] shadow-[8px_8px_0px_rgba(0,0,0,0.8)] p-1">
                  <div className="bg-[#111] p-2">
                    {eventLinks.map((link) => (
                      <Link key={link.name} href={link.href} className="flex justify-between items-center px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-[#00f0ff] hover:text-black font-comic transition-all group">
                        <span>{link.name}</span>
                        <span className="text-[9px] font-jp opacity-0 group-hover:opacity-100">{link.jp}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PROTOCOL DROPDOWN (Rules & Schedule) */}
          <div className="relative" onMouseEnter={() => setIsProtocolOpen(true)} onMouseLeave={() => setIsProtocolOpen(false)}>
            <button className="text-sm font-black uppercase italic tracking-widest text-zinc-300 hover:text-[#00f0ff] flex items-center gap-2 font-comic">
              <FaCircleInfo className="text-[#00f0ff] text-xs" /> Protocol <FaChevronDown size={10} className={isProtocolOpen ? 'rotate-180' : ''} />
            </button>
            <AnimatePresence>
              {isProtocolOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-56 bg-black border-2 border-[#00f0ff] shadow-[8px_8px_0px_rgba(0,0,0,0.8)] p-1">
                  <div className="bg-[#111] p-2">
                    {protocolLinks.map((link) => (
                      <Link key={link.name} href={link.href} className="flex justify-between items-center px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-[#ff003c] hover:text-black font-comic transition-all group">
                        <span className="flex items-center gap-2">{link.icon} {link.name}</span>
                        <span className="text-[9px] font-jp opacity-0 group-hover:opacity-100">{link.jp}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {mainLinks.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-black uppercase italic tracking-widest text-zinc-300 hover:text-[#fff000] font-comic">
              {item.name}
            </Link>
          ))}

          <Link href="/login">
            <button className="px-6 py-2 bg-[#ff003c] border-2 border-transparent hover:border-white hover:bg-black font-comic text-black hover:text-white uppercase italic skew-x-[-10deg] shadow-[4px_4px_0px_#000] transition-all">
              Login <span className="text-sm font-jp ml-2">ログイン</span>
            </button>
          </Link>
        </div>

        {/* --- MOBILE TRIGGER --- */}
        <button className="lg:hidden z-[150] text-white bg-[#ff003c] p-2 border-2 border-black shadow-[3px_3px_0px_#00f0ff]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IoClose size={24} /> : <HiOutlineMenuAlt3 size={24} />}
        </button>
      </div>

      {/* --- MOBILE SIDEBAR MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }} animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 15% 100%)" }} exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }} transition={{ duration: 0.5 }} className="fixed inset-0 w-full h-screen bg-[#fff000] z-[140] lg:hidden p-1">
            <div className="bg-black h-full w-full relative flex flex-col p-8 pt-24 overflow-hidden">
              <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
              <div className="flex flex-col gap-6 relative z-10 overflow-y-auto pb-10">

                {/* Mobile Events Accordion */}
                <div className="border-b-2 border-zinc-900 pb-2">
                  <button onClick={() => setMobileEventsOpen(!mobileEventsOpen)} className="w-full flex justify-between items-center text-4xl font-black uppercase italic text-white font-comic">
                    <span>EVENTS <span className="text-[#00f0ff] text-[10px] font-jp not-italic ml-2 tracking-widest">イベント</span></span>
                    <FaChevronDown size={20} className={`text-[#ff003c] transition-transform ${mobileEventsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileEventsOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden flex flex-col pl-4 mt-4 gap-4">
                        {eventLinks.map((link) => (
                          <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase italic text-transparent stroke-comic font-comic hover:text-[#ff003c] transition-all">{link.name}</Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Protocol Accordion (Rules/Schedule) */}
                <div className="border-b-2 border-zinc-900 pb-2">
                  <button onClick={() => setMobileProtocolOpen(!mobileProtocolOpen)} className="w-full flex justify-between items-center text-4xl font-black uppercase italic text-white font-comic">
                    <span>PROTOCOL <span className="text-[#ff003c] text-[10px] font-jp not-italic ml-2 tracking-widest">プロトコル</span></span>
                    <FaChevronDown size={20} className={`text-[#00f0ff] transition-transform ${mobileProtocolOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileProtocolOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden flex flex-col pl-4 mt-4 gap-4">
                        {protocolLinks.map((link) => (
                          <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-3xl font-black uppercase italic text-transparent stroke-comic font-comic hover:text-[#00f0ff] transition-all">{link.name}</Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {mainLinks.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="text-4xl font-black uppercase italic text-white hover:text-[#fff000] font-comic border-b-2 border-zinc-900 pb-2 flex justify-between items-center group">
                    <span>{item.name}</span>
                    <span className="text-xs font-jp text-zinc-600">{item.jp}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto relative z-10 pt-6 border-t-2 border-[#ff003c]/20">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-[#ff003c] text-black py-5 font-black uppercase italic tracking-widest font-comic text-2xl shadow-[6px_6px_0px_#fff]">LOGIN_SYSTEM</button>
                </Link>
                <div className="flex justify-between items-center mt-4 text-zinc-600 font-tech text-[8px] uppercase tracking-widest">
                  <span>Terminal_v2.0.4</span>
                  <FaSpider className="text-zinc-800 animate-spin-slow" size={24} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}