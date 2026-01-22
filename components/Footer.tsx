"use client";

import { motion } from "framer-motion";
import { FaSpider, FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaBolt } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <footer className="relative bg-[#000] pt-32 pb-12 overflow-hidden">
      
      {/* --- INJECTED STYLES & FONTS --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Roboto+Mono:wght@700&family=Noto+Sans+JP:wght@900&display=swap');

        .font-comic { font-family: 'Bangers', cursive; letter-spacing: 0.1em; }
        .font-tech { font-family: 'Roboto Mono', monospace; }
        .font-jp { font-family: 'Noto Sans JP', sans-serif; }

        .bg-dots {
          background-image: radial-gradient(circle, #333 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* --- AGGRESSIVE GLITCH EFFECT --- */
        .glitch-wrapper {
          position: relative;
          display: inline-block;
        }
        
        /* The Glitch Layers */
        .glitch-wrapper::before,
        .glitch-wrapper::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          overflow: hidden;
        }

        .glitch-wrapper::before {
          left: 2px;
          text-shadow: -2px 0 #ff003c;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        
        .glitch-wrapper::after {
          left: -2px;
          text-shadow: -2px 0 #00f0ff;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }

        /* Hover Intensifies Glitch */
        .group:hover .glitch-wrapper::before {
          animation: glitch-anim-1 0.2s infinite linear alternate-reverse;
          clip-path: inset(10% 0 40% 0);
        }
        .group:hover .glitch-wrapper::after {
          animation: glitch-anim-2 0.2s infinite linear alternate-reverse;
           clip-path: inset(40% 0 10% 0);
        }

        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
        }

        @keyframes glitch-anim-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); }
          60% { clip-path: inset(10% 0 80% 0); transform: translate(-1px, -2px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(1px, 2px); }
          100% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, -1px); }
        }

        .jagged-top {
          clip-path: polygon(
            0% 0%, 5% 15%, 10% 0%, 15% 15%, 
            20% 0%, 25% 15%, 30% 0%, 35% 15%, 
            40% 0%, 45% 15%, 50% 0%, 55% 15%, 
            60% 0%, 65% 15%, 70% 0%, 75% 15%, 
            80% 0%, 85% 15%, 90% 0%, 95% 15%, 
            100% 0%, 100% 100%, 0% 100%
          );
          margin-top: -60px;
        }

        .noise-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: url('https://grainy-gradients.vercel.app/noise.svg');
          opacity: 0.05; pointer-events: none;
        }
      `}</style>

      {/* --- JAGGED BORDER TOP --- */}
      <div className="absolute top-0 left-0 w-full h-20 bg-[#ff003c] jagged-top z-20 pointer-events-none" />
      <div className="absolute top-2 left-0 w-full h-20 bg-[#00f0ff] jagged-top z-10 pointer-events-none" />

      {/* --- BACKGROUND TEXTURES --- */}
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="noise-overlay z-50" />
      
      {/* Floating Graffiti Tag (Random Japanese Sticker) */}
      <motion.div 
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-32 right-6 md:right-32 bg-[#fff000] text-black font-black text-xl px-4 py-2 rotate-12 shadow-[5px_5px_0px_#000] border-2 border-black z-0 opacity-80"
      >
        <span className="font-comic">EARTH-616</span>
        <span className="block text-[10px] font-jp font-black text-center mt-[-4px]">アース</span>
      </motion.div>

      {/* Vertical Japanese Text (Left Side Decoration) */}
      <div className="hidden md:block absolute left-4 top-1/3 text-[#333] font-jp font-black text-6xl opacity-30 select-none writing-vertical-rl pointer-events-none z-0">
        システム
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">

          {/* --- BRANDING (MASSIVE & AGGRESSIVE) --- */}
          <div className="md:col-span-5 flex flex-col space-y-6">
            <Link href="/" className="group block w-fit">
              <div className="relative">
                {/* Main Text with Glitch Wrapper */}
                <h2 className="relative text-5xl md:text-7xl font-black italic text-white font-comic leading-none glitch-wrapper" data-text="IT SYMPOSIUM">
                  IT SYMPOSIUM
                </h2>
                
                {/* Tiny Random Japanese Tag */}
                <div className="absolute -bottom-5 right-0 bg-[#00f0ff] px-1 transform skew-x-[-12deg]">
                   <span className="text-black font-jp text-[10px] font-bold">
                     接続...
                   </span>
                </div>
              </div>
            </Link>
            
            <div className="bg-[#1a1a1a] p-4 border-l-8 border-[#00f0ff] skew-x-[-10deg] mt-6 relative overflow-hidden group">
              {/* Background 'WARNING' in Japanese repeating */}
              <div className="absolute -right-4 -top-2 text-[#222] font-jp font-black text-4xl opacity-50 select-none">警告</div>
              
              <p className="relative z-10 text-zinc-300 font-tech text-xs skew-x-[10deg] uppercase tracking-widest">
                <span className="text-[#ff003c] font-bold blink-me">WARNING:</span> Multiverse breach. 
                <br/>
                <span className="text-zinc-500 text-[10px]">Anomalous code injection detected.</span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { Icon: FaXTwitter, color: "#fff" },
                { Icon: FaGithub, color: "#fff" },
                { Icon: FaInstagram, color: "#E1306C" },
                { Icon: FaLinkedinIn, color: "#0077B5" }
              ].map((item, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: Math.random() * 20 - 10 }}
                  className="w-12 h-12 bg-black border-2 border-white flex items-center justify-center text-white shadow-[4px_4px_0px_#ff003c] hover:shadow-[4px_4px_0px_#00f0ff] hover:border-[#00f0ff] transition-all relative overflow-hidden"
                >
                  <item.Icon size={22} style={{ color: item.color }} />
                  {/* Subtle Japanese char on hover background */}
                  <span className="absolute text-[80px] font-jp font-black text-white opacity-0 hover:opacity-10 pointer-events-none transition-opacity">
                    網
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* --- LINKS --- */}
          <div className="md:col-span-4 flex flex-col justify-center">
             <div className="bg-black border-2 border-[#333] p-8 relative">
                {/* Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#333] opacity-50 rotate-[-2deg]" />
                
                <h3 className="font-comic text-3xl text-[#00f0ff] mb-6 uppercase tracking-wider transform -rotate-2 flex items-center gap-3">
                  Mission Data
                  {/* Random Kanji Stamp */}
                  <span className="border border-[#ff003c] text-[#ff003c] rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-jp rotate-12">
                    機
                  </span>
                </h3>

                <ul className="space-y-4">
                  {[
                    { name: "Mission Control", href: "#hero" },
                    { name: "Live Operations", href: "/events" },
                    { name: "Sector Map", href: "/map" },
                    { name: "Protocol Rules", href: "#rules" }
                  ].map((link, idx) => (
                    <li key={idx} 
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className="relative"
                    >
                      <Link href={link.href} className="flex items-center justify-between group">
                         <div className="flex items-center">
                             <motion.span 
                               animate={{ 
                                 opacity: hoveredLink === link.name ? 1 : 0,
                                 x: hoveredLink === link.name ? 0 : -10
                               }}
                               className="text-[#ff003c] mr-2"
                             >
                               <FaSpider />
                             </motion.span>
                             <span className={`font-tech text-sm md:text-base font-bold uppercase transition-all ${hoveredLink === link.name ? 'text-[#00f0ff] translate-x-2' : 'text-zinc-500'}`}>
                               {link.name}
                             </span>
                         </div>
                         {/* Random decorative chars appearing on hover */}
                         {hoveredLink === link.name && (
                           <span className="text-[10px] font-jp text-zinc-700 animate-pulse">
                              {idx % 2 === 0 ? "データ" : "リンク"}
                           </span>
                         )}
                      </Link>
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* --- NEWSLETTER --- */}
          <div className="md:col-span-3">
             <div className="h-full flex flex-col justify-end">
                <div className="relative bg-[#fff000] p-6 shadow-[8px_8px_0px_#000] border-2 border-black transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="absolute -top-4 -left-4 bg-black text-white px-2 py-1 font-tech text-xs font-bold border border-white">
                    INCOMING
                  </div>
                  
                  <h4 className="font-comic text-2xl text-black mb-2 leading-none">
                    DONT MISS THE <br/> <span className="text-[#ff003c]">CANON EVENT</span>
                  </h4>

                  {/* Random vertical Japanese text on the side of the box */}
                  <div className="absolute right-2 top-2 text-black opacity-20 font-jp font-black text-xs writing-vertical-rl">
                     運命
                  </div>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <input 
                      type="text" 
                      placeholder="ENTER ID..." 
                      className="bg-white border-2 border-black p-2 font-tech text-black text-sm outline-none focus:bg-[#00f0ff]"
                    />
                    <button className="bg-black text-white font-comic text-xl py-2 hover:bg-[#ff003c] transition-colors border-2 border-transparent hover:border-black">
                      SYNC UP!
                    </button>
                  </div>
                </div>
             </div>
          </div>

        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center relative">
          {/* Graffiti underline */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff003c] via-[#fff000] to-[#00f0ff]" />

          <div className="flex items-center gap-4 mb-4 md:mb-0">
             <div className="flex items-center gap-2">
                 <FaBolt className="text-[#fff000]" />
                 <span className="font-tech text-xs text-zinc-500">
                   SYSTEM STATUS: <span className="text-green-500">98%</span>
                 </span>
             </div>
             {/* Small Japanese Text as texture */}
             <span className="font-jp text-[10px] text-zinc-800 select-none">
               正常
             </span>
          </div>

          <p className="font-tech text-[10px] text-zinc-600 uppercase tracking-[0.2em] text-center md:text-right">
            © {currentYear} IT DEPT SJC • <span className="text-[#ff003c]">JWS</span>
          </p>
        </div>
      </div>

      {/* GIANT SPIDER WATERMARK */}
      <div className="absolute -bottom-20 -right-20 opacity-[0.05] pointer-events-none mix-blend-difference">
         <FaSpider size={600} className="text-white rotate-[-20deg]" />
      </div>

    </footer>
  );
}