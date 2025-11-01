"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Clock } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();

      if (data.success && data.news) {
        setNews(data.news);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 초기 로드
    fetchNews();

    // 1시간마다 자동 업데이트 (3600000ms = 1시간)
    const interval = setInterval(() => {
      fetchNews();
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              📰 실시간 AI 뉴스
            </h2>
            <p className="text-gray-600">
              최신 AI 기술 동향을 실시간으로 확인하세요
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-md animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Newspaper className="w-10 h-10 text-[rgb(81,112,255)]" />
              <h2 className="text-4xl font-bold text-gray-900">
                실시간 AI 뉴스
              </h2>
            </div>
            <p className="text-gray-600 mb-2">
              1시간마다 자동 업데이트되는 최신 AI 기술 동향
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>마지막 업데이트: {lastUpdate.toLocaleTimeString("ko-KR")}</span>
            </div>
          </motion.div>
        </div>

        {/* 뉴스 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* 썸네일 이미지 */}
              {item.imageUrl && (
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-[rgb(81,112,255)] text-xs font-semibold rounded-full shadow-md">
                      AI 뉴스
                    </span>
                  </div>
                  <ExternalLink className="absolute top-3 right-3 w-5 h-5 text-white/80 group-hover:text-white transition-colors drop-shadow-lg" />
                </div>
              )}

              <div className="p-6">
                {/* 이미지 없을 때만 헤더 표시 */}
                {!item.imageUrl && (
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-[rgb(81,112,255)] text-xs font-semibold rounded-full">
                      AI 뉴스
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[rgb(81,112,255)] transition-colors" />
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[rgb(81,112,255)] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeAgo(item.pubDate)}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* 더보기 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500">
            💡 AI 바이브코딩으로 이런 기술들을 직접 활용해보세요!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
