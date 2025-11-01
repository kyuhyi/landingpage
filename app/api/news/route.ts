import { NextResponse } from "next/server";

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
}

// AI 관련 Unsplash 이미지 풀
const AI_IMAGES = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop", // AI concept
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop", // AI technology
  "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=300&fit=crop", // Web/AI
  "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop", // Programming
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop", // AI education
  "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop", // Business AI
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop", // Tech
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop", // Teamwork
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop", // Innovation
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop", // Digital
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=300&fit=crop", // Code
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop", // Technology
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop", // Tech background
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop", // Data
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop", // Laptop
];

// Google News RSS에서 AI 뉴스 가져오기
async function fetchGoogleNewsRSS(): Promise<NewsItem[]> {
  const newsItems: NewsItem[] = [];

  try {
    console.log("=== Google News RSS에서 AI 뉴스 가져오기 시작 ===");

    const response = await fetch(
      "https://news.google.com/rss/search?q=AI+OR+%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+OR+ChatGPT+when:7d&hl=ko&gl=KR&ceid=KR:ko",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();

    // XML 파싱
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items = [...xmlText.matchAll(itemRegex)];

    for (const match of items) {
      const itemXml = match[1];

      // 제목 추출
      const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1').trim() : "";

      // 링크 추출
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const link = linkMatch ? linkMatch[1] : "";

      // 발행일 추출
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

      // 설명 추출
      const descMatch = itemXml.match(/<description>(.*?)<\/description>/);
      let description = title;
      if (descMatch) {
        description = descMatch[1].replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
      }

      if (title && link) {
        // 랜덤 AI 이미지 선택
        const randomImage = AI_IMAGES[Math.floor(Math.random() * AI_IMAGES.length)];

        newsItems.push({
          title: title.substring(0, 100),
          link: link,
          description: description.substring(0, 150),
          pubDate: pubDate,
          imageUrl: randomImage,
        });
      }

      if (newsItems.length >= 15) break;
    }

    console.log(`✅ Google News RSS: ${newsItems.length}개 AI 뉴스 수집`);
  } catch (error) {
    console.error("Google News RSS 가져오기 실패:", error);
  }

  return newsItems;
}

export async function GET() {
  try {
    console.log("=== 한국 AI 뉴스 가져오기 시작 ===");

    // Google News RSS로 뉴스 가져오기 (로컬/Vercel 모두 동일)
    const newsItems = await fetchGoogleNewsRSS();

    console.log(`✅ ${newsItems.length}개 뉴스 수집 완료 (이미지 포함)`);

    // 실제 뉴스가 있으면 우선 사용, 부족하면 더미로 채우기
    let finalNews: NewsItem[] = [];

    if (newsItems.length > 0) {
      // 실제 수집된 뉴스 사용
      finalNews = newsItems.slice(0, 9);

      // 9개 미만이면 더미 데이터로 채우기
      if (finalNews.length < 9) {
        const needed = 9 - finalNews.length;
        const dummyNews = getDummyNews();
        finalNews = [...finalNews, ...dummyNews.slice(0, needed)];
      }
    } else {
      // 크롤링 완전 실패 시에만 전체 더미 사용
      finalNews = getDummyNews().slice(0, 9);
    }

    return NextResponse.json(
      {
        success: true,
        news: finalNews,
        source: newsItems.length > 0 ? "naver-crawl" : "dummy",
        totalCrawled: newsItems.length,
        lastUpdate: new Date().toISOString(),
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  } catch (error) {
    console.error("News API Error:", error);

    return NextResponse.json(
      {
        success: true,
        news: getDummyNews(),
        source: "dummy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  }
}

// 더미 뉴스 데이터 (크롤링 실패 시 사용)
function getDummyNews(): NewsItem[] {
  return [
    {
      title: "AI 바이브코딩으로 누구나 개발자 되는 시대",
      link: "#",
      description:
        "코딩 경험 없이도 AI를 활용해 웹사이트와 앱을 만드는 바이브코딩이 주목받고 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    },
    {
      title: "챗GPT 활용한 자동화 도구 개발 붐",
      link: "#",
      description:
        "1인 사업자들이 AI를 활용해 업무 자동화 도구를 직접 만드는 사례가 증가하고 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop",
    },
    {
      title: "비전공자도 AI로 랜딩페이지 제작 가능",
      link: "#",
      description:
        "AI 도구를 활용하면 디자인과 코딩 지식 없이도 전문적인 웹사이트를 만들 수 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&h=300&fit=crop",
    },
    {
      title: "AI 코딩 도구, 개발 생산성 300% 향상",
      link: "#",
      description:
        "Claude, ChatGPT 등 AI 코딩 어시스턴트가 개발자 생산성을 크게 높이고 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop",
    },
    {
      title: "교육 시장, AI 활용 프로그래밍 교육 확대",
      link: "#",
      description:
        "AI를 활용한 코딩 교육이 전통적인 프로그래밍 교육을 빠르게 대체하고 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    },
    {
      title: "1인 창업가를 위한 AI 웹 개발 솔루션",
      link: "#",
      description:
        "소규모 사업자들이 AI 도구로 직접 웹사이트를 만들어 비용을 절감하고 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop",
    },
    {
      title: "AI 시대, 코딩 교육의 패러다임 전환",
      link: "#",
      description:
        "문법 암기보다 AI 활용 능력이 중요한 시대로 코딩 교육 방식이 변화하고 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    },
    {
      title: "직장인들, AI로 업무 자동화 프로그램 제작",
      link: "#",
      description:
        "반복적인 업무를 AI로 자동화하는 직장인들이 늘어나며 생산성이 향상되고 있다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    },
    {
      title: "AI 개발 도구, 코딩 진입 장벽 낮춰",
      link: "#",
      description:
        "AI 기술 발전으로 비개발자도 쉽게 프로그래밍을 시작할 수 있게 되었다.",
      pubDate: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    },
  ];
}
