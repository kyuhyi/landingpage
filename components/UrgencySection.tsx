"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Flame, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function UrgencySection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [remainingSeats, setRemainingSeats] = useState(37);
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 12,
    minutes: 34,
    seconds: 56,
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#5170ff]">
            <div className="bg-[#5170ff] text-white py-6 px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                지금 바로 신청하세요!
              </h2>
              <p className="text-xl opacity-90">선착순 100명 한정</p>
            </div>

            <div className="p-8 md:p-12">
              {/* Remaining Seats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    남은 자리
                  </h3>
                </div>

                <div className="text-center mb-4">
                  <div className="text-6xl md:text-7xl font-bold text-[#5170ff]">
                    {remainingSeats}석
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${(100 - remainingSeats)}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-[#5170ff] rounded-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>0석</span>
                  <span>100석 마감</span>
                </div>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    특강 시작까지
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {[
                    { label: "일", value: timeLeft.days },
                    { label: "시간", value: timeLeft.hours },
                    { label: "분", value: timeLeft.minutes },
                    { label: "초", value: timeLeft.seconds },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border-2 border-gray-200"
                    >
                      <div className="text-3xl md:text-5xl font-bold text-[#5170ff] mb-2">
                        {String(item.value).padStart(2, "0")}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Warning Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#5170ff]/10 border-2 border-[#5170ff]/30 rounded-2xl p-6 text-center"
              >
                <p className="text-lg md:text-xl text-gray-800 font-medium">
                  ⚠️ 이번 기회를 놓치면 다음 특강은{" "}
                  <span className="text-[#5170ff] font-bold">3개월 뒤</span>입니다
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
