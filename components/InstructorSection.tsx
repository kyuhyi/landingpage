"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, BookOpen, Users, Trophy } from "lucide-react";
import Image from "next/image";

const credentials = [
  "AI 바이브코딩 전문가",
  "저서 6권 출간 (『바이브코딩 설계자』 등)",
  "2,000명+ 교육 경험",
  "BSD 바이브코딩 전문교육센터 운영",
];

export default function InstructorSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            강사 소개
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12">
              {/* Profile Image */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="/1.png"
                      alt="퍼널띵"
                      width={256}
                      height={256}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-[#5170ff] text-white px-6 py-3 rounded-full font-bold shadow-lg">
                    퍼널띵
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  퍼널띵
                </h3>

                <div className="space-y-3 mb-8">
                  {credentials.map((credential, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-gray-400 mt-1">•</span>
                      <p className="text-gray-700 text-lg">
                        {credential}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-[#5170ff]/5 p-6 rounded-2xl border-l-4 border-[#5170ff]"
                >
                  <div className="text-4xl text-[#5170ff] mb-2">"</div>
                  <p className="text-gray-700 text-lg leading-relaxed italic mb-2">
                    저도 처음엔 코딩 몰랐습니다. 하지만 AI 덕분에 누구나 할 수 있게 됐죠.
                    이번 특강에서 그 비법을 모두 공개합니다.
                  </p>
                  <div className="text-right text-[#5170ff] font-bold">
                    - 퍼널띵
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education Facility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            <div className="p-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
                BSD 바이브코딩 전문교육센터
              </h3>
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="/class.gif"
                  alt="BSD 교육장"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
