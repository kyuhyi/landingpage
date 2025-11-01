import { NextResponse } from "next/server";
import { chromium } from "playwright";

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
}

// Playwright로 네이버 뉴스 크롤링
async function crawlNaverNews(): Promise<NewsItem[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const newsItems: NewsItem[] = [];

  try {
    console.log("페이지 이동: https://search.naver.com/search.naver?where=news&query=AI+인공지능+ChatGPT&sort=1");

    await page.goto("https://search.naver.com/search.naver?where=news&query=AI+인공지능+ChatGPT&sort=1", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    // 페이지 로딩 대기
    await page.waitForTimeout(2000);

    // 뉴스 기사 요소 선택 - 중복 제거 개선
    const articles = await page.evaluate(() => {
      const items: any[] = [];
      const seenUrls = new Set<string>();
      const seenTitles = new Set<string>();

      // 뉴스 기사 링크를 직접 찾기
      const newsLinks = document.querySelectorAll('a[href]');

      newsLinks.forEach((link) => {
        const anchor = link as HTMLAnchorElement;
        const href = anchor.href;
        const title = anchor.textContent?.trim() || "";

        // 유효한 뉴스 제목 확인 (20자 이상)
        if (title.length < 20 || title.length > 200) return;

        // AI 관련 키워드 필터
        if (!title.includes('AI') && !title.includes('인공지능') && !title.includes('ChatGPT') && !title.includes('챗')) return;

        // 네이버 내부 링크나 광고 제외
        if (!href ||
            href.includes('help.naver') ||
            href.includes('policy.naver') ||
            href.includes('media.naver.com/press') ||
            href.includes('mail.naver') ||
            href.includes('nid.naver') ||
            href.includes('keep.naver') ||
            href.includes('mkt.naver') ||
            href.includes('channelPromotion') ||
            href.includes('membership') ||
            href.includes('shopping.naver') ||
            href.includes('clip')) {
          return;
        }

        // 중복 체크 강화 - URL과 제목 모두 확인
        if (seenUrls.has(href) || seenTitles.has(title)) return;

        // 설명 찾기 - 링크 근처의 텍스트 찾기
        let description = title;
        let parent = anchor.parentElement;
        if (parent) {
          const allText = parent.textContent?.trim() || "";
          if (allText.length > title.length) {
            description = allText.substring(0, 150);
          }
        }

        // 이미지 찾기 - 부모 요소에서 탐색
        let imageUrl = "";
        let searchParent = anchor.parentElement;
        let maxDepth = 10;
        let depth = 0;

        while (searchParent && searchParent.tagName !== 'BODY' && depth < maxDepth) {
          depth++;
          const imgs = searchParent.querySelectorAll('img');

          for (const img of imgs) {
            const src = img.src;
            if (src &&
                !src.includes('profile') &&
                !src.includes('logo') &&
                !src.includes('office_logo') &&
                !src.includes('data:image') &&
                (src.startsWith('http') || src.startsWith('//'))) {
              imageUrl = src.startsWith('//') ? 'https:' + src : src;
              break;
            }
          }

          if (imageUrl) break;
          searchParent = searchParent.parentElement;
        }

        // 이미지가 없어도 기사 추가 (실제 뉴스 우선)
        seenUrls.add(href);
        seenTitles.add(title);

        items.push({
          title: title.substring(0, 100),
          link: href,
          description: description.substring(0, 150),
          pubDate: new Date().toISOString(),
          imageUrl: imageUrl || undefined,
        });
      });

      return items.slice(0, 15); // 중복 제거를 고려해 15개 수집
    });

    console.log(`✅ Found ${articles.length} news items`);
    newsItems.push(...articles.filter((item: any) => item.title && item.link));
  } catch (error) {
    console.error("네이버 뉴스 크롤링 실패:", error);
  } finally {
    await browser.close();
  }

  console.log(`=== 크롤링 완료: ${newsItems.length}개 기사 수집 ===`);
  return newsItems;
}

export async function GET() {
  try {
    console.log("=== 한국 AI 뉴스 크롤링 시작 ===");

    // Playwright로 네이버 뉴스 직접 크롤링
    const newsItems = await crawlNaverNews();

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
