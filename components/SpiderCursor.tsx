'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, Variants } from 'framer-motion';
import { FaSpider } from 'react-icons/fa6';

export default function SpiderCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false); // Only show custom cursor when mouse moves
    const [isMobile, setIsMobile] = useState(false);
    // --- CONFIG ---
    const CURSOR_SIZE = 22;
    const OFFSET = CURSOR_SIZE / 2;

    // 1. Track Mouse Position
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // 2. Physics - Smooth but responsive
    const springConfig = { damping: 25, stiffness: 800, mass: 0.1 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // 3. Glitch Variants
    const glitchVariants: Variants = {
        default: { x: 0, y: 0, opacity: 0 },
        hover: {
            opacity: 0.8,
            transition: { type: 'spring', stiffness: 300, damping: 10 }
        },
    };


    useEffect(() => {

    }, [cursorX, cursorY, OFFSET, isVisible]);
    useEffect(() => {
        // 1. Detect if the device is mobile/touch
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(pointer: coarse)').matches);
        };

        checkMobile(); // Initial check

        const moveCursor = (e: MouseEvent) => {
            // Show cursor on first move
            if (!isVisible) setIsVisible(true);

            cursorX.set(e.clientX - OFFSET);
            cursorY.set(e.clientY - OFFSET);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // Optimized Hover Detection (using composed path for better accuracy)
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check specific tags and cursor styles
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.closest('a') ||
                target.closest('button') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(!!isClickable);
        };

        // Hide cursor when leaving the window
        const handleMouseOut = (e: MouseEvent) => {
            if (!e.relatedTarget) setIsVisible(false);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseout', handleMouseOut);



        // 2. Wrap your event listeners in a condition
        if (!isMobile) {
            window.addEventListener('mousemove', moveCursor);
            // ... other listeners
        }

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isMobile]); // Add isMobile to dependencies

    // 3. Return null if it's a mobile device
    if (isMobile) return null;

    return (
        <>
            {/* AGGRESSIVE CSS CURSOR HIDING 
        1. Apply to * and html to catch everything.
        2. !important overrides individual element styles.
      */}
            <style jsx global>{`
  /* Only hide the cursor on devices that support a 'fine' pointer (mouse) */
  @media (pointer: fine) {
    * {
      cursor: none !important;
    }
    html, body {
      cursor: none !important;
    }
  }

  /* Ensure touch interactions don't show the gray highlight box on mobile */
  html, body {
    -webkit-tap-highlight-color: transparent; 
  }
`}</style>

            {/* MAIN CURSOR CONTAINER */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[99999]" // Increased Z-Index
                style={{
                    x: cursorX,
                    y: cursorY,
                    width: CURSOR_SIZE,
                    height: CURSOR_SIZE,
                    opacity: isVisible ? 1 : 0, // Hide until mouse moves
                }}
                animate={{
                    scale: isClicking ? 0.8 : isHovering ? 1.4 : 1,
                    rotate: isHovering ? [0, -10, 5, 0] : 0,
                }}
                transition={{
                    scale: { type: "spring", stiffness: 400, damping: 20 },
                    rotate: { duration: 0.4 }
                }}
            >
                <div className="relative w-full h-full">

                    {/* Layer 1: Cyan/Blue shift */}
                    <motion.div
                        className="absolute inset-0 text-[#00f0ff] mix-blend-screen z-0"
                        variants={glitchVariants}
                        animate={isHovering ? "hover" : "default"}
                        initial="default"
                        style={{ x: -2, y: 1 }}
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
                        style={{ x: 2, y: -1 }}
                        whileHover={{ x: 4, y: -3 }}
                    >
                        <FaSpider className="w-full h-full" />
                    </motion.div>

                    {/* Layer 3: Main central spider */}
                    <div className="relative z-10 text-white drop-shadow-[0_0_2px_#ff003c]">
                        <FaSpider className="w-5 h-5" />
                    </div>
                </div>
            </motion.div>
        </>
    );
}