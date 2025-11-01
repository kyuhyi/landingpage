"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! BSD 바이브코딩 전문 상담 챗봇입니다. 😊\n\n코딩 경험이 없어도 AI로 웹사이트와 자동화 시스템을 만드는 방법이 궁금하신가요?\n\n궁금한 점을 편하게 물어보세요!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 자주 묻는 질문 목록
  const quickReplies = [
    "바이브코딩이 뭔가요?",
    "어떤 과정이 있나요?",
    "비용은 얼마인가요?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (content: string) => {
    // 줄바꿈을 <br>로 변환하고 문단 구분
    const paragraphs = content.split("\n\n");
    return paragraphs.map((paragraph, pIndex) => {
      const lines = paragraph.split("\n");
      return (
        <div key={pIndex} className="mb-3 last:mb-0">
          {lines.map((line, lIndex) => (
            <span key={lIndex}>
              {line}
              {lIndex < lines.length - 1 && <br />}
            </span>
          ))}
        </div>
      );
    });
  };

  const handleQuickReply = async (question: string) => {
    setShowQuickReplies(false);
    await sendMessageWithText(question);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    await sendMessageWithText(inputValue);
  };

  const sendMessageWithText = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Notion 데이터 가져오기 (context 정보)
      const notionResponse = await fetch("/api/notion");
      let notionContext = "";

      if (notionResponse.ok) {
        const notionData = await notionResponse.json();
        notionContext = notionData.context || "";
      }

      // Gemini API 호출
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          notionContext,
        }),
      });

      if (!response.ok) {
        throw new Error("API 요청 실패");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 노션에 대화 내역 저장
      try {
        await fetch("/api/notion/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMessage: messageText,
            aiResponse: data.response,
            userId: "웹사이트 방문자",
          }),
        });
        console.log("✅ 대화 내역이 노션에 저장되었습니다");
      } catch (saveError) {
        console.warn("노션 저장 실패 (대화는 정상 진행):", saveError);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "죄송합니다. 일시적인 오류가 발생했습니다.\n\n잠시 후 다시 시도해주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 text-white p-4 rounded-full shadow-2xl transition-all duration-300"
        style={{ backgroundColor: 'rgb(81, 112, 255)' }}
        whileHover={{ scale: 1.1, boxShadow: '0 20px 60px rgba(81, 112, 255, 0.5)' }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6" />
              {/* 알림 뱃지 */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 챗봇 창 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[600px] bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-800"
          >
            {/* 헤더 */}
            <div className="text-white p-5 flex items-center gap-3 shadow-lg border-b border-gray-800" style={{ background: 'linear-gradient(135deg, rgb(81, 112, 255) 0%, rgb(101, 132, 255) 100%)' }}>
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/95 p-1.5 shadow-md">
                <Image
                  src="/bsd-symbol-color.png"
                  alt="BSD 챗봇"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">BSD 상담 챗봇</h3>
                <p className="text-xs text-white/90 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  바이브코딩 전문 상담
                </p>
              </div>
            </div>

            {/* 메시지 영역 */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "text-white rounded-br-none"
                        : "bg-gradient-to-br from-gray-800 to-gray-850 text-gray-100 shadow-md rounded-bl-none border border-gray-700/50"
                    }`}
                    style={message.role === "user" ? { background: 'linear-gradient(135deg, rgb(81, 112, 255) 0%, rgb(101, 132, 255) 100%)' } : {}}
                  >
                    <div
                      className={`text-sm leading-relaxed ${
                        message.role === "assistant" ? "text-gray-100" : "text-white"
                      }`}
                    >
                      {formatMessage(message.content)}
                    </div>
                    <div
                      className={`text-[10px] mt-1.5 ${
                        message.role === "user"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl rounded-bl-none px-4 py-3 shadow-md border border-gray-700/50">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full animate-bounce" style={{ backgroundColor: 'rgb(81, 112, 255)' }} />
                      <span
                        className="w-2.5 h-2.5 rounded-full animate-bounce"
                        style={{ backgroundColor: 'rgb(81, 112, 255)', animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full animate-bounce"
                        style={{ backgroundColor: 'rgb(81, 112, 255)', animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 빠른 답변 버튼 */}
              {showQuickReplies && messages.length === 1 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-col gap-2 px-2"
                >
                  <p className="text-xs text-gray-400 font-medium px-2">자주 묻는 질문</p>
                  {quickReplies.map((question, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickReply(question)}
                      className="text-left px-4 py-3 rounded-xl border-2 border-gray-700 hover:border-[rgb(81,112,255)] bg-gray-800 text-sm text-gray-200 transition-all hover:shadow-md hover:bg-gray-750"
                    >
                      💬 {question}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="bg-gray-900 border-t border-gray-800">
              <div className="p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-700 disabled:cursor-not-allowed text-sm text-gray-100 placeholder:text-gray-500 transition-all"
                    style={{ '--tw-ring-color': 'rgb(81, 112, 255)' } as React.CSSProperties}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:scale-105"
                    style={{ backgroundColor: 'rgb(81, 112, 255)' }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 1:1 문의 버튼 */}
              <div className="px-4 pb-4">
                <a
                  href="https://open.kakao.com/o/sW7ZC0sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: 'rgb(81, 112, 255)' }}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>1:1 문의하기 (카카오톡)</span>
                </a>
              </div>

              <p className="text-[10px] text-gray-500 pb-3 text-center">
                Powered by Gemini 2.5 Flash ✨
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
