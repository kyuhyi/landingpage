"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.7, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      style={{ opacity: headerOpacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <div className="relative h-8 w-32">
              <Image
                src="/bsd-white.png"
                alt="BSD Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <button
              onClick={() => scrollToSection("curriculum-section")}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              커리큘럼
            </button>
            <button
              onClick={() => scrollToSection("instructor-section")}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              강사소개
            </button>
            <button
              onClick={() => scrollToSection("faq-section")}
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
            </button>
          </motion.nav>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("cta-section")}
            className="relative inline-flex items-center gap-2 bg-[#5170ff] text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:bg-[#4060ef] transition-all duration-300"
          >
            <span className="relative z-10">무료 신청</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
