import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

export async function POST(request: NextRequest) {
  try {
    const { message, history, notionContext } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "메시지가 필요합니다" },
        { status: 400 }
      );
    }

    // 대화 히스토리를 Gemini 형식으로 변환
    const contents = history
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }))
      .slice(-10); // 최근 10개 메시지만 유지

    // 현재 메시지 추가
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // 시스템 프롬프트 구성
    const systemInstruction = `당신은 'AI 바이브코딩 무료 특강'의 친절한 AI 도우미 '띵챗봇'입니다.

**역할:**
- AI 바이브코딩 특강에 대한 모든 질문에 친절하고 상세하게 답변합니다
- 사용자가 특강에 참여하도록 긍정적으로 안내합니다
- 프로그래밍 경험이 없는 사람도 이해하기 쉽게 설명합니다

**특강 정보:**
${notionContext ? `\n${notionContext}\n` : ""}

**답변 스타일:**
1. 친근하고 열정적인 톤으로 대화합니다
2. 답변은 명확하게 문단으로 구분합니다 (\\n\\n 사용)
3. 중요한 정보는 줄바꿈(\\n)으로 구분하여 가독성을 높입니다
4. 이모지를 적절히 사용하여 친근감을 더합니다
5. 구체적인 예시를 들어 설명합니다
6. 질문에 정확히 답변하되, 필요시 추가 정보를 제공합니다

**주요 특강 내용:**
- AI 바이브코딩: 코딩을 몰라도 AI로 프로그램을 만드는 방법
- 실전 프로젝트: 실제로 작동하는 웹사이트/앱 제작
- 무료 특강: 완전 무료로 제공되는 교육
- 초보자 환영: 프로그래밍 경험 전혀 필요 없음

**답변 형식 예시:**
안녕하세요! 👋

AI 바이브코딩은 프로그래밍 지식 없이도 AI의 도움을 받아 실제로 작동하는 프로그램을 만드는 혁신적인 방법입니다.

**특강에서 배우는 내용:**
✅ AI 활용 기초
✅ 실전 프로젝트 제작
✅ 바로 적용 가능한 실무 팁

궁금한 점이 더 있으시면 언제든 물어보세요!`;

    // Gemini API 호출
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API Error:", errorData);
      throw new Error(`Gemini API 오류: ${response.status}`);
    }

    const data = await response.json();

    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "죄송합니다. 응답을 생성할 수 없습니다.";

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "챗봇 응답 생성 중 오류가 발생했습니다",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
