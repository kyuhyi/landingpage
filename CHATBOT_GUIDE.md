# 🤖 띵챗봇 (AI Chatbot) 가이드

> Gemini 2.5 Flash API와 Notion 연동 챗봇 사용 가이드

**생성일**: 2025-10-31
**챗봇명**: 띵챗봇 (Dding Chatbot)
**AI 모델**: Google Gemini 2.5 Flash

---

## 📋 목차

1. [개요](#-개요)
2. [주요 기능](#-주요-기능)
3. [설치 및 설정](#-설치-및-설정)
4. [사용 방법](#-사용-방법)
5. [Notion 연동](#-notion-연동)
6. [커스터마이징](#-커스터마이징)
7. [문제 해결](#-문제-해결)

---

## 🎯 개요

띵챗봇은 AI 바이브코딩 랜딩페이지 우측 하단에 위치한 대화형 AI 도우미입니다.

### 특징
- ✅ Google Gemini 2.5 Flash 무료 모델 사용
- ✅ Notion 데이터베이스와 연동하여 최신 정보 제공
- ✅ 가독성 높은 답변 (문단/줄바꿈 자동 처리)
- ✅ 반응형 디자인 (모바일/데스크톱 최적화)
- ✅ 실시간 대화 기록 유지
- ✅ 부드러운 애니메이션 효과

### 기술 스택
- **AI Engine**: Google Gemini 2.5 Flash API
- **Data Source**: Notion API
- **Frontend**: React, TypeScript, Framer Motion
- **Styling**: Tailwind CSS
- **API Routes**: Next.js API Routes

---

## 🚀 주요 기능

### 1. 대화형 인터페이스
- 사용자 메시지와 AI 응답을 구분하여 표시
- 타임스탬프 자동 기록
- 스크롤 자동 이동
- 로딩 애니메이션

### 2. 가독성 최적화
- 문단 자동 구분 (`\n\n` 처리)
- 줄바꿈 처리 (`\n` 처리)
- 깔끔한 메시지 레이아웃
- 긴 텍스트도 편하게 읽을 수 있는 디자인

### 3. Notion 데이터 연동
- Notion 블록에서 실시간 정보 가져오기
- 제목, 문단, 리스트, 인용문 등 다양한 형식 지원
- Fallback: Notion 연결 실패 시 기본 정보 제공

### 4. 스마트 응답
- 대화 맥락 유지 (최근 10개 메시지)
- 특강 정보에 특화된 답변
- 친근하고 열정적인 톤
- 이모지 적절히 활용

---

## ⚙️ 설치 및 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Gemini API Key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Notion API Key (선택사항)
NOTION_API_KEY=your_notion_api_key_here

# Notion Database/Block ID
NOTION_DATABASE_ID=your_notion_database_id_here
```

### 2. 파일 구조

```
landingpage-master/
├── components/
│   └── Chatbot.tsx                  # 챗봇 UI 컴포넌트
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts            # Gemini API 엔드포인트
│   │   └── notion/
│   │       └── route.ts            # Notion API 엔드포인트
│   └── page.tsx                     # 챗봇 통합된 메인 페이지
└── .env.local                       # 환경 변수
```

### 3. 의존성

이미 설치된 패키지들:
- `framer-motion` - 애니메이션
- `lucide-react` - 아이콘
- `next` - 프레임워크

추가 설치 필요 없음!

---

## 📖 사용 방법

### 사용자 관점

1. **챗봇 열기**
   - 우측 하단의 보라색 채팅 버튼 클릭
   - 띵챗봇 아이콘과 함께 창 표시

2. **질문하기**
   - 입력창에 질문 입력
   - Enter 키 또는 전송 버튼 클릭
   - AI가 답변 생성 (로딩 애니메이션 표시)

3. **대화 계속하기**
   - 이전 대화 맥락이 유지됨
   - 추가 질문 가능

4. **챗봇 닫기**
   - X 버튼 클릭 또는 채팅 버튼 재클릭

### 개발자 관점

#### 챗봇 컴포넌트 통합

[app/page.tsx](app/page.tsx:12,38):
```typescript
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <>
      {/* ... 다른 섹션들 ... */}
      <Chatbot />
    </>
  );
}
```

#### API 엔드포인트

**Chat API** - [app/api/chat/route.ts](app/api/chat/route.ts)
```typescript
POST /api/chat

// Request
{
  message: string;           // 사용자 메시지
  history: Message[];        // 대화 기록
  notionContext?: string;    // Notion 컨텍스트
}

// Response
{
  response: string;          // AI 응답
}
```

**Notion API** - [app/api/notion/route.ts](app/api/notion/route.ts)
```typescript
GET /api/notion

// Response
{
  context: string;           // Notion 블록 내용
  source: "notion" | "default";
}
```

---

## 🔗 Notion 연동

### Notion 설정 방법

1. **Notion Integration 생성**
   - https://www.notion.so/my-integrations 방문
   - "New integration" 클릭
   - 이름 입력 (예: "띵챗봇 Integration")
   - API Key 복사

2. **페이지에 Integration 연결**
   - Notion 페이지 열기
   - 우측 상단 "..." 메뉴 클릭
   - "Connections" → Integration 선택
   - 권한 부여

3. **Block ID 가져오기**
   - 원하는 블록 우클릭 → "Copy link"
   - URL에서 마지막 ID 복사
   - 예: `https://notion.so/.../{BLOCK_ID}`

4. **환경 변수 설정**
   ```env
   NOTION_API_KEY=secret_xxxxx
   NOTION_DATABASE_ID={BLOCK_ID}
   ```

### Notion 데이터 구조

지원하는 블록 타입:
- ✅ 제목 (Heading 1, 2, 3)
- ✅ 문단 (Paragraph)
- ✅ 리스트 (Bulleted, Numbered)
- ✅ 인용문 (Quote)
- ✅ 코드 블록 (Code)
- ✅ 구분선 (Divider)

### Fallback 시스템

Notion 연결 실패 시:
- 자동으로 기본 컨텍스트 사용
- 특강 기본 정보 제공
- 사용자는 연결 실패를 알 수 없음 (투명한 처리)

---

## 🎨 커스터마이징

### 1. 챗봇 스타일 변경

[components/Chatbot.tsx](components/Chatbot.tsx) 수정:

```typescript
// 색상 변경
className="bg-gradient-to-r from-indigo-600 to-purple-600"
// ↓ 원하는 색상으로 변경
className="bg-gradient-to-r from-blue-600 to-cyan-600"

// 크기 변경
className="w-[380px] h-[600px]"
// ↓ 원하는 크기로 변경
className="w-[400px] h-[650px]"
```

### 2. 챗봇 위치 변경

```typescript
// 우측 하단 (기본)
className="fixed bottom-6 right-6 z-50"

// 좌측 하단으로 변경
className="fixed bottom-6 left-6 z-50"

// 우측 중앙으로 변경
className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50"
```

### 3. AI 응답 스타일 변경

[app/api/chat/route.ts](app/api/chat/route.ts) 수정:

```typescript
// Temperature (창의성)
temperature: 0.9,  // 0.0 (보수적) ~ 1.0 (창의적)

// Max tokens (응답 길이)
maxOutputTokens: 1024,  // 더 길게: 2048, 짧게: 512
```

### 4. 시스템 프롬프트 수정

AI 성격과 답변 스타일 변경:

```typescript
const systemInstruction = `
당신은 '띵챗봇'입니다.

[여기에 원하는 성격과 답변 스타일 정의]
`;
```

### 5. 아이콘 변경

현재 아이콘: `/bsd-symbol-color.png`

다른 이미지 사용:
```typescript
<Image
  src="/your-icon.png"  // 원하는 이미지 경로
  alt="챗봇명"
  width={40}
  height={40}
/>
```

---

## 🐛 문제 해결

### 챗봇이 응답하지 않음

**증상**: 메시지 전송 후 로딩만 계속됨

**해결 방법**:
1. Gemini API Key 확인
   ```bash
   # .env.local 파일 확인
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
   ```

2. 개발 서버 재시작
   ```bash
   # 개발 서버 중지 (Ctrl+C)
   npm run dev
   ```

3. 브라우저 콘솔 확인
   - F12 → Console 탭
   - 에러 메시지 확인

### Notion 데이터가 로드되지 않음

**증상**: 기본 정보만 제공됨

**해결 방법**:
1. Notion API Key 확인
2. Integration 연결 확인
3. Block ID 정확성 확인
4. 개발자 도구 → Network 탭에서 `/api/notion` 요청 확인

**참고**: Notion 실패 시 자동으로 기본 정보 사용 (정상 동작)

### 메시지 형식이 깨짐

**증상**: 줄바꿈이나 문단이 제대로 표시되지 않음

**해결 방법**:
1. AI 응답에서 `\n\n` (문단 구분) 사용
2. `\n` (줄바꿈) 사용
3. [components/Chatbot.tsx](components/Chatbot.tsx)의 `formatMessage` 함수 확인

### 챗봇 창이 너무 작음/큼

**해결 방법**:
[components/Chatbot.tsx](components/Chatbot.tsx)에서 크기 조정:
```typescript
className="w-[380px] h-[600px]"
// 모바일 반응형도 추가:
className="w-[90vw] md:w-[380px] h-[80vh] md:h-[600px]"
```

### API 비용 걱정

**해결 방법**:
- Gemini 2.5 Flash는 무료 할당량 제공
- 무료 한도: 매일 1,500 요청
- 더 필요하면: Gemini API 콘솔에서 업그레이드

---

## 📊 성능 최적화

### 1. 대화 기록 제한

현재: 최근 10개 메시지만 유지

변경하려면 [app/api/chat/route.ts](app/api/chat/route.ts):
```typescript
.slice(-10)  // 10개 → 원하는 개수로 변경
```

### 2. 응답 속도 개선

```typescript
// Temperature 낮추기 (더 빠르지만 덜 창의적)
temperature: 0.7,  // 기본 0.9에서 낮춤

// Max tokens 줄이기 (더 짧은 응답)
maxOutputTokens: 512,  // 기본 1024에서 줄임
```

### 3. 캐싱 추가

Notion 데이터 캐싱 (선택사항):
```typescript
// app/api/notion/route.ts
let cachedContext: string | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

if (cachedContext && Date.now() - cacheTime < CACHE_DURATION) {
  return NextResponse.json({ context: cachedContext });
}
```

---

## 🔐 보안 고려사항

### API Key 보호

✅ **올바른 방법**:
- `.env.local`에 저장
- `.gitignore`에 `.env.local` 추가
- 서버 사이드에서만 사용

❌ **잘못된 방법**:
- 코드에 직접 하드코딩
- 클라이언트 사이드에 노출
- GitHub에 커밋

### CORS 설정

현재: Next.js API Routes 사용 (자동 처리)

외부 도메인에서 접근하려면:
```typescript
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  // CORS 헤더 추가
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

---

## 📈 향후 개선 사항

### 단기 목표
- [ ] 대화 기록 로컬 저장 (새로고침 후에도 유지)
- [ ] 음성 입력 기능
- [ ] 파일 첨부 기능
- [ ] 다국어 지원 (영어/한국어 자동 감지)

### 장기 목표
- [ ] 챗봇 학습 기능 (피드백 수집)
- [ ] 관리자 대시보드 (대화 통계)
- [ ] 다중 AI 모델 지원 (GPT-4, Claude 등)
- [ ] 고급 분석 (감정 분석, 의도 파악)

---

## 🆘 추가 지원

### 문서
- [Gemini API 문서](https://ai.google.dev/docs)
- [Notion API 문서](https://developers.notion.com)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Framer Motion](https://www.framer.com/motion)

### 문의
- 프로젝트 README 참고
- GitHub Issues 등록
- 개발팀 문의

---

**마지막 업데이트**: 2025-10-31
**버전**: 1.0.0
**작성자**: Development Team
