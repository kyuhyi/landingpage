"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";

export default function HeroSection() {
  const scrollToCTA = () => {
    const ctaSection = document.getElementById("cta-section");
    ctaSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5170ff]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5170ff]/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-6 md:px-12 py-20 relative z-10">
        <Card className="w-full h-auto bg-black/[0.96] relative overflow-hidden border-white/10">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />

          <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-12">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center relative z-10"
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 glass px-4 py-2 rounded-full mb-6 w-fit"
              >
                <span className="text-sm text-gray-300">2,000명이 수강</span>
                <div className="h-4 w-px bg-gray-700" />
                <span className="text-sm font-bold text-gray-100">만족도 4.9/5.0</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  AI로 30분 만에
                </span>
                <br />
                <span className="gradient-text">
                  홈페이지 만드는 법
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                  무료로 공개합니다
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-neutral-300 mb-8 max-w-lg"
              >
                코딩 몰라도 OK! 1인 지식창업자를 위한
                <br />
                <span className="text-neutral-100 font-semibold">AI 바이브코딩 비밀특강</span>
              </motion.p>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToCTA}
                className="group relative inline-flex items-center gap-3 bg-[#5170ff] text-white px-10 py-5 rounded-xl text-lg font-semibold shadow-lg hover:bg-[#4060ef] transition-all duration-300 w-fit"
              >
                <span className="relative z-10">무료 특강 신청하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.button>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 mt-12"
              >
                <div>
                  <div className="text-3xl font-bold gradient-text">30분</div>
                  <div className="text-sm text-gray-500">완성 시간</div>
                </div>
                <div className="h-12 w-px bg-gray-800" />
                <div>
                  <div className="text-3xl font-bold gradient-text">무료</div>
                  <div className="text-sm text-gray-500">외주 비용</div>
                </div>
                <div className="h-12 w-px bg-gray-800" />
                <div>
                  <div className="text-3xl font-bold gradient-text">2주</div>
                  <div className="text-sm text-gray-500">학습 기간</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right content - Spline Scene */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative h-[500px] lg:h-full flex items-center justify-center"
            >
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </Card>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-sm">스크롤하여 더 보기</span>
            <div className="w-6 h-10 border-2 border-gray-700 rounded-full flex justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-[#5170ff] rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
