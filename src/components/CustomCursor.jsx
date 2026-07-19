'use client';

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 450, mass: 0.35 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);

    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"], .clickable, .hover-lift, .carousel-arrow, .shop-art-box'
      );
      
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => setHovered(true));
        el.addEventListener("mouseleave", () => setHovered(false));
      });
    };

    const interval = setInterval(addHoverListeners, 1000);
    addHoverListeners();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(interval);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className={`custom-cursor ${hovered ? "hovered" : ""}`}
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      />
      <motion.div
        className="custom-cursor-dot"
        style={{
          left: cursorX,
          top: cursorY,
        }}
      />
    </>
  );
};
export default CustomCursor;
