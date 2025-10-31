"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "정말 무료인가요?",
    answer: "네, 100% 무료입니다. 카드 정보도 필요 없습니다. 이메일만 입력하시면 무료로 특강에 참석하실 수 있습니다.",
  },
  {
    question: "코딩을 전혀 몰라도 되나요?",
    answer: "물론입니다. 오히려 비개발자를 위해 설계된 교육입니다. ChatGPT와 AI 도구를 활용하기 때문에 코딩 지식이 전혀 없어도 따라하실 수 있습니다.",
  },
  {
    question: "특강은 언제 어디서 진행되나요?",
    answer: "온라인 Zoom으로 진행되며, 신청 후 이메일로 정확한 일정과 링크를 안내드립니다. 집에서 편하게 참석하실 수 있습니다.",
  },
  {
    question: "준비물이 있나요?",
    answer: "노트북과 인터넷 연결만 있으면 됩니다. 특강 중 실습을 위해 ChatGPT 계정(무료)이 필요하며, 신청 후 상세한 준비 안내를 보내드립니다.",
  },
  {
    question: "녹화본을 받을 수 있나요?",
    answer: "실시간 참석자에 한해 24시간 동안 다시보기가 제공됩니다. 복습하거나 놓친 부분을 다시 볼 수 있습니다.",
  },
];

export default function FAQSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-xl text-gray-600">
            궁금한 점이 있으신가요? 여기서 답을 찾아보세요
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg md:text-xl font-semibold text-gray-900 pr-4">
                    Q: {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl">
                          <p className="text-gray-700 leading-relaxed">
                            A: {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
