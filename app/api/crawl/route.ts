import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    console.log("크롤링 시작:", url);

    // Playwright MCP 서버가 실행 중이라고 가정
    // 실제로는 MCP 도구를 직접 호출할 수 없으므로,
    // 서버사이드에서 Playwright를 직접 사용합니다.

    const { chromium } = require("playwright");

    const browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // 네이버 뉴스 페이지로 이동
    await page.goto(url, { waitUntil: "networkidle" });

    // 페이지가 로드될 때까지 대기
    await page.waitForSelector(".news_area", { timeout: 10000 });

    // 뉴스 기사 크롤링
    const articles = await page.evaluate(() => {
      const newsItems: any[] = [];
      const newsElements = document.querySelectorAll(".news_area");

      newsElements.forEach((element, index) => {
        if (index >= 20) return; // 최대 20개

        const titleElement = element.querySelector(".news_tit");
        const descElement = element.querySelector(".news_dsc");
        const imgElement = element.querySelector("img");

        const title = titleElement?.textContent?.trim() || "";
        const link = titleElement?.getAttribute("href") || "";
        const description = descElement?.textContent?.trim() || "";
        const imageUrl = imgElement?.getAttribute("src") || "";

        if (title && link) {
          newsItems.push({
            title,
            link,
            description,
            imageUrl: imageUrl || undefined,
          });
        }
      });

      return newsItems;
    });

    await browser.close();

    console.log(`크롤링 완료: ${articles.length}개 기사 수집`);

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Crawl Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        articles: [],
      },
      { status: 500 }
    );
  }
}
