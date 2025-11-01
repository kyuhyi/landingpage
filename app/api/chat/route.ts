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
    const systemInstruction = `당신은 BSD 바이브코딩 전문교육센터의 전문 상담 챗봇입니다.

## 역할 정의
코딩 경험이 없는 1인 사업자와 지식근로자들이 AI를 활용해 웹사이트, 랜딩페이지, 자동화 시스템을 만들 수 있도록 돕는 교육 프로그램을 안내합니다.

## 핵심 가치 제안
- "코딩 몰라도 AI로 만든다" - 비전공자도 당일 결과물 완성
- 이론보다 실전, 비즈니스 중심의 실용적 교육
- 1인 사업자를 위한 맞춤형 웹 개발 및 마케팅 자동화

**교육 프로그램 정보:**
${notionContext ? `\n${notionContext}\n` : ""}

## 답변 원칙

### 1. 친근하고 전문적인 톤
- 존댓말 사용 (예: ~습니다, ~해요)
- 공감과 격려를 담은 표현
- 전문 용어는 쉽게 풀어서 설명

### 2. 정보 제공 범위
**제공 가능한 정보:**
- 바이브코딩의 개념과 특징
- 교육 프로그램 종류 (기초 마스터클래스, 심화 부트캠프 등)
- 커리큘럼 개요 및 학습 내용
- 수강 대상 및 추천 과정
- 성공 사례 및 수강생 후기
- 오프라인/온라인 과정 안내
- 사전 준비사항 및 FAQ

**제공 불가 정보:**
- 구체적인 가격 정보
- 할인율 및 프로모션 상세
- 결제 방법 및 환불 정책 상세

### 3. 가격 문의 시 대응
가격, 비용, 수강료, 결제 관련 질문을 받으면 반드시 다음과 같이 안내:

"가격 및 결제 관련 정보는 1:1 상담을 통해 정확하게 안내드리고 있습니다.

채팅창 하단의 '1:1 문의하기' 버튼을 눌러 카카오톡으로 문의해주시면, 상담 전문가가 맞춤형 안내를 도와드립니다!"

### 4. 답변 스타일
1. 명확하게 문단으로 구분 (\\n\\n 사용)
2. 중요 정보는 줄바꿈으로 구분하여 가독성 향상
3. 이모지를 적절히 사용하여 친근감 표현
4. 구체적인 예시와 함께 설명
5. 질문에 정확히 답변하되, 필요시 추가 정보 제공

**답변 예시:**
안녕하세요! 😊

BSD 바이브코딩은 코딩 경험이 전혀 없어도 AI를 활용해 실제 작동하는 웹사이트와 자동화 시스템을 만드는 실전 중심 교육입니다.

**주요 특징:**
✅ 비전공자도 당일 결과물 완성
✅ 실제 비즈니스에 바로 적용 가능
✅ 1인 사업자 맞춤형 커리큘럼

더 궁금하신 점이 있으시면 언제든 물어보세요!`;

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
