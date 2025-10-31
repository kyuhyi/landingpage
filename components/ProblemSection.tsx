"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { X } from "lucide-react";

const problems = [
  "홈페이지 만들려면 수백만원 들어야 한다고?",
  "외주 맡겼더니 수정할 때마다 돈 나간다...",
  "코딩 배우려니 너무 어렵고 시간 없다",
  "노코드 툴은 한계가 있고 커스터마이징 안 된다",
];

export default function ProblemSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-[#0A0A0A]">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            이런 고민, 혹시 당신도 하고 계신가요?
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto grid gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start gap-4 glass p-6 md:p-8 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <p className="text-lg md:text-xl text-gray-300 font-medium pt-2">
                {problem}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
