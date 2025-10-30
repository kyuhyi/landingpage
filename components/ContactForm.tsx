'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Google Apps Script 웹 앱 URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwsnZrL8Z54w-8huW9W82YN79LvkCVSUMlrZbbfhp2YCsAHDG0xRfq7dcXnUB121Vd_xg/exec';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'no-cors' // Google Apps Script는 CORS를 지원하지 않으므로 필요
      });

      // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 간주
      setStatus('success');
      setMessage('문의가 성공적으로 전송되었습니다!');

      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // 3초 후 메시지 제거
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (error) {
      setStatus('error');
      setMessage('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        문의하기
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="홍길동"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="example@email.com"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            전화번호
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="010-1234-5678"
          />
        </div>

        {/* 메시지 */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            메시지 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="문의 내용을 입력해주세요..."
          />
        </div>

        {/* 상태 메시지 */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              status === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            status === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {status === 'loading' ? '전송 중...' : '문의 보내기'}
        </button>
      </form>

      {/* 안내 메시지 */}
      <p className="mt-6 text-sm text-gray-500 text-center">
        문의 내용은 Google Sheets에 자동으로 저장됩니다.
      </p>
    </div>
  );
}
