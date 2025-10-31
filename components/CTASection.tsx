"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CreditCard, Lock, Mail, User, Phone, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    privacyConsent: false,
    marketingConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Google Apps Script Web App URL - 여기에 실제 배포된 URL을 입력하세요
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwsnZrL8Z54w-8huW9W82YN79LvkCVSUMlrZbbfhp2YCsAHDG0xRfq7dcXnUB121Vd_xg/exec";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (!formData.privacyConsent) {
      newErrors.privacyConsent = "개인정보 수집에 동의해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Google Apps Script로 데이터 전송
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Google Apps Script는 CORS를 지원하지 않음
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          marketingConsent: formData.marketingConsent,
          timestamp: new Date().toISOString(),
          // UTM 파라미터도 함께 전송 (선택사항)
          utmSource: new URLSearchParams(window.location.search).get("utm_source") || "",
          utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || "",
        }),
      });

      // 성공 모달 표시
      setShowSuccessModal(true);

      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        phone: "",
        privacyConsent: false,
        marketingConsent: false,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <section
      id="cta-section"
      ref={ref}
      className="py-20 md:py-32 bg-gray-50"
    >
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            지금 바로 무료로 시작하세요
          </h2>
          <p className="text-xl text-gray-600">
            30초면 신청 완료! 이메일로 특강 안내를 보내드립니다
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                >
                  <User className="w-5 h-5" />
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="홍길동"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                >
                  <Mail className="w-5 h-5" />
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Input (Optional) */}
              <div>
                <label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-gray-700 font-medium mb-2"
                >
                  <Phone className="w-5 h-5" />
                  전화번호 <span className="text-gray-400 text-sm">(선택)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="010-1234-5678"
                />
              </div>

              {/* Privacy Consent */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-gray-700">
                    개인정보 수집 및 이용에 동의합니다{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.privacyConsent && (
                  <p className="text-red-500 text-sm mt-1 ml-8">
                    {errors.privacyConsent}
                  </p>
                )}
              </div>

              {/* Marketing Consent */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-gray-700">
                    마케팅 정보 수신에 동의합니다{" "}
                    <span className="text-gray-400 text-sm">(선택)</span>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#5170ff] text-white py-5 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl hover:bg-[#4060ef] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "신청 중..." : "무료 특강 신청 완료하기"}
              </button>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 pt-4 flex-wrap">
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm">결제 정보 필요 없음</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Lock className="w-5 h-5" />
                  <span className="text-sm">개인정보 안전 보호</span>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-[#5170ff] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                신청이 완료되었습니다!
              </h3>
              <p className="text-gray-600 mb-8">
                입력하신 이메일로 특강 안내를 보내드렸습니다.
                <br />
                이메일을 확인해주세요!
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-[#5170ff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4060ef] hover:shadow-lg transition-all"
              >
                확인
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
