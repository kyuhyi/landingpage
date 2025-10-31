"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Palette, TrendingUp, CheckCircle } from "lucide-react";

const curriculum = [
  {
    part: "1부",
    duration: "30분",
    title: "AI로 랜딩페이지 자동 생성하기",
    topics: [
      "ChatGPT + Cursor 실전 사용법",
      "즉석에서 페이지 하나 완성",
    ],
  },
  {
    part: "2부",
    duration: "30분",
    title: "나만의 페이지 커스터마이징",
    topics: [
      "색상, 폰트, 이미지 교체하는 법",
      "결제 연동까지 한 방에",
    ],
  },
  {
    part: "3부",
    duration: "20분",
    title: "실제 수익화 사례 공개",
    topics: [
      "바이브코딩으로 월 500만원 버는 법",
      "Q&A",
    ],
  },
];

const bonuses = [
  "특강 참석자 한정 '바이브코딩 스타터 템플릿' 증정",
  "1:1 무료 상담권 제공",
];

export default function CurriculumSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            이번 무료 특강에서 배울 내용
          </h2>
        </motion.div>

        {/* Curriculum Timeline */}
        <div className="max-w-4xl mx-auto mb-16">
          {curriculum.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative pl-12 pb-12 last:pb-0"
            >
              {/* Timeline line */}
              {index !== curriculum.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-300" />
              )}

              {/* Timeline dot */}
              <div className="absolute left-0 top-0 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg text-white font-bold">
                {index + 1}
              </div>

              {/* Content */}
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {item.part}
                  </span>
                  <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>

                <ul className="space-y-2">
                  {item.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bonuses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gray-100 p-8 md:p-12 rounded-2xl border-2 border-gray-300">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              보너스 혜택
            </h3>
            <div className="space-y-4">
              {bonuses.map((bonus, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white p-4 rounded-xl"
                >
                  <span className="text-gray-400 mt-1">✓</span>
                  <span className="text-lg text-gray-700 font-medium">
                    {bonus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
