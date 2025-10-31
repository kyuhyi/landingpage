"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Users, TrendingUp, Award } from "lucide-react";

const testimonials = [
  {
    name: "김OO",
    role: "패션 창업자",
    comment: "비개발자인데 진짜 2주 만에 쇼핑몰 만들었어요!",
  },
  {
    name: "이OO",
    role: "온라인 강사",
    comment: "외주 맡기려다가 직접 만들었습니다. 돈도 시간도 절약!",
  },
  {
    name: "박OO",
    role: "프리랜서 디자이너",
    comment: "포트폴리오 사이트 30분 만에 완성. 진짜 신세계예요.",
  },
];

const stats = [
  {
    number: "2,000+",
    label: "수강생",
  },
  {
    number: "4.9/5.0",
    label: "평균 만족도",
  },
  {
    number: "94%",
    label: "프로젝트 완성률",
  },
];

export default function SocialProofSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            숫자로 보는 성과
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 bg-gray-50 rounded-2xl shadow-lg border border-gray-200"
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            수강생 후기
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
              >
                <div className="mb-4">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
