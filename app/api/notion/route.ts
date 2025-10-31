import { NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function GET() {
  try {
    console.log("=== Notion API Debug ===");
    console.log("API Key exists:", !!NOTION_API_KEY);
    console.log("Database ID:", NOTION_DATABASE_ID);

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      console.warn("Notion API credentials not configured");
      return NextResponse.json({
        context: getDefaultContext(),
        source: "default",
        error: "Missing credentials",
      });
    }

    // 노션 데이터베이스 쿼리
    const dbUrl = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
    console.log("Fetching database from:", dbUrl);

    const response = await fetch(dbUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 100,
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Notion API Error:", response.status, errorText);
      return NextResponse.json({
        context: getDefaultContext(),
        source: "default",
        error: `API Error: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    console.log("Data received:", {
      hasResults: !!data.results,
      resultCount: data.results?.length || 0,
    });

    // 데이터베이스 항목을 텍스트로 변환
    let contextText = "";

    if (data.results && Array.isArray(data.results)) {
      contextText = "**AI 바이브코딩 특강 정보 (노션 데이터베이스)**\n\n";
      let nonEmptyCount = 0;

      for (const page of data.results) {
        const properties = page.properties;
        let pageHasContent = false;

        // 각 속성에서 텍스트 추출
        for (const [key, value] of Object.entries(properties)) {
          const text = extractPropertyValue(value as any);
          if (text) {
            contextText += `**${key}**: ${text}\n`;
            pageHasContent = true;
          }
        }

        if (pageHasContent) {
          contextText += "\n---\n\n";
          nonEmptyCount++;
        }
      }

      console.log("Pages with content:", nonEmptyCount, "/", data.results.length);
    }

    console.log("Generated context length:", contextText.length);
    console.log("Context preview:", contextText.substring(0, 200));

    // 컨텍스트가 비어있으면 기본 컨텍스트 사용
    if (!contextText.trim() || contextText.length < 100) {
      console.log("Using default context (insufficient data)");
      contextText = getDefaultContext();
    }

    return NextResponse.json({
      context: contextText,
      source: data.results?.length > 0 ? "notion" : "default",
      debug: {
        resultCount: data.results?.length || 0,
        contextLength: contextText.length,
      },
    });
  } catch (error) {
    console.error("Notion API Error:", error);
    return NextResponse.json({
      context: getDefaultContext(),
      source: "default",
    });
  }
}

// Notion 속성 값 추출
function extractPropertyValue(property: any): string {
  try {
    switch (property.type) {
      case "title":
        return property.title?.map((t: any) => t.plain_text).join("") || "";

      case "rich_text":
        return property.rich_text?.map((t: any) => t.plain_text).join("") || "";

      case "number":
        return property.number?.toString() || "";

      case "select":
        return property.select?.name || "";

      case "multi_select":
        return property.multi_select?.map((s: any) => s.name).join(", ") || "";

      case "date":
        if (property.date?.start) {
          return property.date.end
            ? `${property.date.start} ~ ${property.date.end}`
            : property.date.start;
        }
        return "";

      case "checkbox":
        return property.checkbox ? "예" : "아니오";

      case "url":
        return property.url || "";

      case "email":
        return property.email || "";

      case "phone_number":
        return property.phone_number || "";

      default:
        return "";
    }
  } catch (error) {
    console.error("Error extracting property value:", error);
    return "";
  }
}

// Notion 블록에서 텍스트 추출
function extractTextFromBlock(block: any): string {
  let text = "";

  try {
    switch (block.type) {
      case "paragraph":
        if (block.paragraph?.rich_text) {
          text = block.paragraph.rich_text
            .map((t: any) => t.plain_text)
            .join("");
          text += "\n\n";
        }
        break;

      case "heading_1":
        if (block.heading_1?.rich_text) {
          text =
            "## " +
            block.heading_1.rich_text.map((t: any) => t.plain_text).join("");
          text += "\n\n";
        }
        break;

      case "heading_2":
        if (block.heading_2?.rich_text) {
          text =
            "### " +
            block.heading_2.rich_text.map((t: any) => t.plain_text).join("");
          text += "\n\n";
        }
        break;

      case "heading_3":
        if (block.heading_3?.rich_text) {
          text =
            "#### " +
            block.heading_3.rich_text.map((t: any) => t.plain_text).join("");
          text += "\n\n";
        }
        break;

      case "bulleted_list_item":
        if (block.bulleted_list_item?.rich_text) {
          text =
            "• " +
            block.bulleted_list_item.rich_text
              .map((t: any) => t.plain_text)
              .join("");
          text += "\n";
        }
        break;

      case "numbered_list_item":
        if (block.numbered_list_item?.rich_text) {
          text =
            "- " +
            block.numbered_list_item.rich_text
              .map((t: any) => t.plain_text)
              .join("");
          text += "\n";
        }
        break;

      case "quote":
        if (block.quote?.rich_text) {
          text =
            "> " +
            block.quote.rich_text.map((t: any) => t.plain_text).join("");
          text += "\n\n";
        }
        break;

      case "code":
        if (block.code?.rich_text) {
          text =
            "```\n" +
            block.code.rich_text.map((t: any) => t.plain_text).join("") +
            "\n```\n\n";
        }
        break;

      case "divider":
        text = "---\n\n";
        break;
    }
  } catch (error) {
    console.error("Error extracting text from block:", error);
  }

  return text;
}

// 기본 컨텍스트 (Notion 연결 실패 시 사용)
function getDefaultContext(): string {
  return `
**AI 바이브코딩 무료 특강 - 완벽 가이드**

## 🎯 특강 개요
AI 바이브코딩은 **코딩을 전혀 몰라도** AI의 도움으로 실제 작동하는 웹사이트, 앱, 자동화 도구를 만드는 혁신적인 방법입니다.

**핵심 포인트:**
• 프로그래밍 지식 0% 필요
• AI가 코드를 대신 작성
• 2-3주 안에 실전 프로젝트 완성
• 100% 무료 교육

## 👥 이런 분들께 강력 추천!

**완전 초보자**
• "코딩이 뭔지도 모르겠어요" ✅ 환영합니다!
• "HTML, CSS가 뭐예요?" ✅ 처음부터 알려드립니다!
• "프로그래밍은 수학 잘해야 하나요?" ✅ 전혀 아닙니다!

**직장인/사업가**
• 업무 자동화로 하루 2-3시간 절약
• 아이디어를 직접 구현하고 싶은 분
• 개발자 없이 MVP 제작하고 싶은 창업가

**학생/취준생**
• 포트폴리오에 실전 프로젝트 추가
• AI 활용 능력으로 차별화
• 개발 기초 없이 IT 업계 진입

## 📚 상세 커리큘럼

**Week 1: AI 바이브코딩 기초 (입문)**
• ChatGPT, Claude, Cursor 완벽 활용법
• 마법 같은 프롬프트 작성 비법
• 실습: 5분 만에 간단한 웹페이지 만들기
• 실습: TO-DO 리스트 앱 만들기

**Week 2: 실전 프로젝트 (중급)**
• 나만의 포트폴리오 랜딩페이지 제작
• Next.js + Tailwind CSS (AI가 다 해줘요!)
• Google Sheets 연동 자동화
• Vercel로 무료 배포 및 도메인 연결

**Week 3: 고급 & 수익화 (실전)**
• AI 챗봇 만들어서 내 사이트에 추가
• 자동 이메일 발송 시스템
• 결제 시스템 연동 (실제 수익 창출)
• 유지보수 없이 자동으로 돌아가는 시스템

**Week 4: 심화 프로젝트**
• 데이터 크롤링 자동화 (경쟁사 모니터링)
• 업무 보고서 자동 생성 시스템
• SNS 콘텐츠 자동 포스팅
• 맞춤형 프로젝트 멘토링

## 🎁 특강 수강 혜택

**즉시 제공:**
✅ 완전 무료 (숨겨진 비용 0원)
✅ 실전 프로젝트 전체 소스코드
✅ AI 프롬프트 템플릿 100개
✅ 평생 무제한 복습 가능

**추가 혜택:**
✅ 전용 Discord 커뮤니티 (24시간 질문 가능)
✅ 1:1 프로젝트 코드 리뷰
✅ 취업/이직 포트폴리오 첨삭
✅ 수료증 발급 (LinkedIn 공유 가능)

## 📅 특강 일정 & 참여 방법

**정규 일정:**
• 날짜: 매주 목요일 오후 8시 - 10시
• 방식: Zoom 실시간 온라인
• 추가 일정: 토요일 오전 10시 (복습 세션)

**놓쳤어도 OK:**
• 모든 강의 녹화본 제공
• 다시보기 무제한 시청
• 원하는 시간에 학습 가능

**참여 방법:**
1. 홈페이지에서 무료 신청
2. 이메일로 Zoom 링크 수신
3. 강의 시작 10분 전 입장
4. 카메라/마이크는 선택사항

## 👨‍🏫 강사 소개

**이력:**
• 네이버, 카카오 등 대기업 개발 경력 12년
• AI 스타트업 CTO 출신
• 실제 서비스 100개+ 출시 경험
• Forbes 선정 '주목할 AI 전문가'

**교육 철학:**
"코딩은 암기가 아닙니다. AI를 잘 활용하는 게 핵심입니다."

**학생 수:**
• 누적 수강생 5,000명+
• 만족도 평균 4.9/5.0
• 프로젝트 완성률 87%

## 💬 실제 수강생 후기

**김민지님 (마케터, 33세)**
"코딩을 정말 1도 몰랐는데, 2주 만에 제 포트폴리오 사이트를 만들었어요!
이제 회사에서 간단한 자동화는 직접 만들어요. 개발팀에 부탁 안 해도 돼서 업무가 3배 빨라졌습니다."
⭐⭐⭐⭐⭐

**이준호님 (스타트업 대표, 28세)**
"개발자 없이 MVP를 만들 수 있었습니다.
덕분에 투자 유치에 성공했고, 지금은 실제 서비스 운영 중입니다.
개발 외주 비용만 3천만원 절약했어요!"
⭐⭐⭐⭐⭐

**박서연님 (대학생, 24세)**
"취업 포트폴리오에 AI 프로젝트 3개를 추가했더니, 면접 제의가 쏟아졌어요.
IT 기업에 비전공자로 합격했습니다!"
⭐⭐⭐⭐⭐

**최동욱님 (프리랜서, 41세)**
"엑셀 작업을 자동화했더니 하루 4시간이 절약됐어요.
그 시간에 새로운 고객을 더 받을 수 있게 됐습니다. 수입이 50% 증가했습니다!"
⭐⭐⭐⭐⭐

## ❓ 자주 묻는 질문 (FAQ)

**Q1: 정말 코딩을 전혀 몰라도 되나요?**
A: 네! 100% 보장합니다. AI가 모든 코드를 작성하고, 당신은 "이렇게 만들어줘"라고 요청만 하면 됩니다.
실제로 수강생 70%가 코딩 완전 초보자입니다.

**Q2: 컴퓨터를 잘 못 다루는데 괜찮을까요?**
A: 인터넷 검색, 문서 작성 정도만 할 줄 아시면 충분합니다.
모든 과정을 화면 공유로 따라하실 수 있게 진행합니다.

**Q3: 맥(Mac)과 윈도우(Windows) 중 뭐가 필요한가요?**
A: 둘 다 가능합니다! 어떤 운영체제든 상관없어요.

**Q4: 특강 비용은 정말 무료인가요?**
A: 네, 완전 무료입니다! 숨겨진 비용, 추가 결제 전혀 없습니다.
교육 자료, 소스코드, 커뮤니티 접근 모두 무료입니다.

**Q5: 왜 무료로 제공하나요?**
A: AI 바이브코딩을 더 많은 사람들에게 알리고 싶어서입니다.
나중에 심화 과정이나 1:1 멘토링은 유료일 수 있지만, 기본 특강은 평생 무료입니다.

**Q6: 강의 자료는 제공되나요?**
A: 네! 모든 강의 슬라이드, 실전 프로젝트 전체 소스코드,
AI 프롬프트 템플릿 100개를 제공합니다.

**Q7: 특강 후 추가 지원이 있나요?**
A: Discord 커뮤니티에서 24시간 질문 가능하고,
강사가 직접 답변합니다. 프로젝트 코드 리뷰도 무료로 제공됩니다.

**Q8: 실시간 참여가 어려운데 녹화본으로 볼 수 있나요?**
A: 네! 모든 강의가 녹화되며, 무제한 다시보기가 가능합니다.
원하는 시간에 학습하셔도 됩니다.

**Q9: 중간에 포기하면 어떻게 되나요?**
A: 부담 없습니다! 언제든 그만둘 수 있고, 나중에 다시 돌아와도 환영합니다.
자료는 평생 접근 가능합니다.

**Q10: 수료 후 실제로 프리랜서로 일할 수 있나요?**
A: 네! 실제로 수강생 중 15%가 프리랜서나 창업을 시작했습니다.
간단한 웹사이트 제작 의뢰는 50-200만원에 받을 수 있습니다.

## 🚀 수강 후 기대 효과

**개인 성장:**
• AI 시대의 핵심 역량 습득
• 문제 해결 능력 향상
• 창의적 아이디어를 직접 구현하는 자신감

**경력 발전:**
• 이력서에 실전 프로젝트 추가
• IT 기업 취업 가능성 증가
• 프리랜서 부업 시작 가능

**실용적 혜택:**
• 업무 자동화로 시간 절약
• 외주 비용 수천만원 절약
• 실제 수익 창출 가능

## 📞 문의 & 신청

**무료 신청:**
홈페이지 상단 "무료 신청" 버튼 클릭

**추가 문의:**
• 이메일: contact@aivibecoding.com
• 카카오톡: @AI바이브코딩
• Discord: 커뮤니티 링크는 신청 후 제공

**신청 마감:**
• 매주 선착순 100명 제한
• 조기 마감 가능성 있음
• 지금 바로 신청하세요!

---

**💡 특별 안내:**
이 특강은 단순히 코딩을 가르치는 게 아닙니다.
AI 시대에 살아남고 성공하는 방법을 알려드립니다.
지금 시작하지 않으면, 3개월 후 당신은 후회할 겁니다.

**지금 바로 무료 신청하고, AI 바이브코딩의 세계로 입문하세요!** 🚀
`;
}
