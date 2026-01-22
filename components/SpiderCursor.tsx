'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import { FaSpider } from 'react-icons/fa6';

export default function SpiderCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // --- CONFIG ---
  // Reduced size: 20px (w-5)
  const CURSOR_SIZE = 20; 
  const OFFSET = CURSOR_SIZE / 2;

  // 1. Track Mouse Position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 2. Physics (Tighter spring for smaller, snappier feel)
  const springConfig = { damping: 25, stiffness: 500, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // 3. Variants for the RGB Split Glitch Effect
  const glitchVariants: Variants = {
    default: { 
      x: 0, 
      y: 0, 
      opacity: 0 
    },
    hover: { 
      opacity: 0.8,
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    },
  };

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - OFFSET); 
      cursorY.set(e.clientY - OFFSET);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target or its parent is clickable
      const isClickable = target.matches('a, button, input, select, [role="button"]') || target.closest('a, button, [role="button"]');
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, OFFSET]);

  return (
    <>
      <style jsx global>{`
        body, a, button, input, select, [role="button"] {
          cursor: none !important;
        }
      `}</style>

      {/* MAIN CURSOR CONTAINER */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
        }}
        animate={{
          // Scale up slightly more on hover to make interaction clear
          scale: isClicking ? 0.8 : isHovering ? 1.4 : 1,
          rotate: isHovering ? [0, -10, 5, 0] : 0, 
        }}
        transition={{ 
          scale: { type: "spring", stiffness: 400, damping: 20 },
          rotate: { duration: 0.4 }
        }}
      >
        <div className="relative w-full h-full">
            
            {/* --- SPIDER-VERSE RGB SPLIT LAYERS --- */}

            {/* Layer 1: Cyan/Blue shift */}
            <motion.div 
              className="absolute inset-0 text-[#00f0ff] mix-blend-screen z-0"
              variants={glitchVariants}
              animate={isHovering ? "hover" : "default"}
              initial="default"
              style={{ x: -2, y: 1 }} // Tighter offset for small size
              whileHover={{ x: -4, y: 3 }} 
            >
               <FaSpider className="w-full h-full" />
            </motion.div>

            {/* Layer 2: Red/Magenta shift */}
            <motion.div 
              className="absolute inset-0 text-[#ff003c] mix-blend-screen z-0"
              variants={glitchVariants}
              animate={isHovering ? "hover" : "default"}
              initial="default"
              style={{ x: 2, y: -1 }} // Tighter offset
              whileHover={{ x: 4, y: -3 }} 
            >
               <FaSpider className="w-full h-full" />
            </motion.div>
            
            {/* Layer 3: Main central spider */}
            <div className="relative z-10 text-white drop-shadow-[0_0_2px_#ff003c]">
                {/* w-5 h-5 = 20px */}
                <FaSpider className="w-5 h-5" />
            </div>
        </div>
      </motion.div>
    </>
  );
}