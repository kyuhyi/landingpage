"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Zap, DollarSign, GraduationCap } from "lucide-react";

const benefits = [
  {
    title: "30분 완성",
    description: "AI가 80% 자동 생성, 당신은 20%만 조정",
  },
  {
    title: "비용 절감",
    description: "외주비 없이 직접 만들고 수정",
  },
  {
    title: "실전 중심",
    description: "당일 바로 결과물 나오는 교육",
  },
];

const comparisonData = [
  {
    traditional: "6개월 학습",
    vibecoding: "2주 완성",
  },
  {
    traditional: "문법 암기 필수",
    vibecoding: "AI가 코드 생성",
  },
  {
    traditional: "이론 위주",
    vibecoding: "실전 프로젝트",
  },
];

export default function SolutionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            AI 바이브코딩이면 가능합니다
          </h2>
        </motion.div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-lg">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
            전통 코딩 vs AI 바이브코딩
          </h3>

          <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <th className="py-6 px-6 text-left text-lg font-bold text-gray-700">
                    전통 코딩
                  </th>
                  <th className="py-6 px-6 text-left text-lg font-bold bg-[#5170ff] text-white">
                    AI 바이브코딩
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-6 px-6 text-gray-600 text-base md:text-lg border-t border-gray-200">
                      {row.traditional}
                    </td>
                    <td className="py-6 px-6 text-gray-900 font-semibold text-base md:text-lg border-t border-gray-200 bg-primary/5">
                      {row.vibecoding}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
