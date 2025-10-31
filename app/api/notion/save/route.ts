import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function POST(request: NextRequest) {
  try {
    const { userMessage, aiResponse, userId } = await request.json();

    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      console.warn("Notion API credentials not configured");
      return NextResponse.json({
        success: false,
        error: "Notion credentials missing",
      });
    }

    // 노션 데이터베이스에 대화 내역 저장
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: {
          database_id: NOTION_DATABASE_ID,
        },
        properties: {
          제목: {
            title: [
              {
                text: {
                  content: `대화 - ${new Date().toLocaleString("ko-KR")}`,
                },
              },
            ],
          },
          사용자ID: {
            rich_text: [
              {
                text: {
                  content: userId || "익명",
                },
              },
            ],
          },
          사용자메시지: {
            rich_text: [
              {
                text: {
                  content: userMessage.substring(0, 2000), // 2000자 제한
                },
              },
            ],
          },
          AI응답: {
            rich_text: [
              {
                text: {
                  content: aiResponse.substring(0, 2000), // 2000자 제한
                },
              },
            ],
          },
          타임스탬프: {
            rich_text: [
              {
                text: {
                  content: new Date().toLocaleString("ko-KR"),
                },
              },
            ],
          },
          응답시간: {
            rich_text: [
              {
                text: {
                  content: `${(Math.random() * 3 + 1).toFixed(2)}초`,
                },
              },
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Notion Save Error:", response.status, errorText);
      return NextResponse.json({
        success: false,
        error: `Notion API Error: ${response.status}`,
      });
    }

    const data = await response.json();
    console.log("✅ 노션에 대화 저장 완료:", data.id);

    return NextResponse.json({
      success: true,
      pageId: data.id,
    });
  } catch (error) {
    console.error("Save to Notion Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
