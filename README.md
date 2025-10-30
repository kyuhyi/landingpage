# AI 바이브코딩 무료 특강 랜딩페이지

Next.js 14 + Tailwind CSS + Framer Motion으로 제작된 고전환율 랜딩페이지입니다.

## 🚀 기능

- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ 부드러운 스크롤 애니메이션
- ✅ 실시간 카운트다운 타이머
- ✅ 이메일 수집 폼 (Google Apps Script 연동)
- ✅ FAQ 아코디언
- ✅ SEO 최적화

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 3. 프로덕션 빌드
```bash
npm run build
npm start
```

## 🔧 Google Apps Script 연동 설정

이 랜딩페이지는 Google Apps Script를 백엔드로 사용합니다.

### Google Apps Script 설정 방법:

1. **Google Sheets 생성**
   - 새 Google Sheets 문서 생성
   - 첫 번째 행에 헤더 추가: `이름`, `이메일`, `전화번호`, `마케팅동의`, `신청일시`, `UTM Source`, `UTM Campaign`

2. **Apps Script 프로젝트 생성**
   - Google Sheets에서 `확장 프로그램` > `Apps Script` 클릭
   - 다음 코드를 붙여넣기:

```javascript
function doPost(e) {
  try {
    // 스프레드시트 연결
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // JSON 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 데이터 행 추가
    sheet.appendRow([
      data.name,
      data.email,
      data.phone || '',
      data.marketingConsent ? '동의' : '미동의',
      data.timestamp,
      data.utmSource || '',
      data.utmCampaign || ''
    ]);

    // 성공 응답
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '신청이 완료되었습니다'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 에러 응답
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **웹 앱으로 배포**
   - `배포` > `새 배포` 클릭
   - 유형: `웹 앱` 선택
   - 액세스 권한: `누구나` 선택
   - `배포` 클릭
   - 배포된 웹 앱 URL 복사

4. **랜딩페이지에 URL 적용**
   - `components/CTASection.tsx` 파일 열기
   - 12번째 줄의 `GOOGLE_SCRIPT_URL` 값을 복사한 URL로 변경:
   ```typescript
   const GOOGLE_SCRIPT_URL = "여기에_복사한_URL_붙여넣기";
   ```

5. **자동 이메일 발송 설정 (선택사항)**
   - Apps Script에 Gmail 서비스 추가
   - 이메일 템플릿 작성
   - `doPost` 함수에 `GmailApp.sendEmail()` 추가

## 📁 프로젝트 구조

```
landingtest/
├── app/
│   ├── layout.tsx       # 메인 레이아웃
│   ├── page.tsx         # 홈페이지
│   └── globals.css      # 전역 스타일
├── components/
│   ├── HeroSection.tsx          # 히어로 섹션
│   ├── ProblemSection.tsx       # 문제 공감대
│   ├── SolutionSection.tsx      # 솔루션 제시
│   ├── SocialProofSection.tsx   # 사회적 증거
│   ├── CurriculumSection.tsx    # 커리큘럼
│   ├── InstructorSection.tsx    # 강사 소개
│   ├── UrgencySection.tsx       # 긴급성/희소성
│   ├── CTASection.tsx           # 최종 CTA & 폼
│   ├── FAQSection.tsx           # FAQ
│   └── Footer.tsx               # 푸터
├── public/              # 정적 파일
└── package.json
```

## 🎨 커스터마이징

### 색상 변경
`tailwind.config.ts` 파일에서 색상 수정:
```typescript
colors: {
  primary: "#6366F1",    // 인디고
  secondary: "#EC4899",  // 핑크
  accent: "#10B981",     // 그린
}
```

### 텍스트 수정
각 컴포넌트 파일에서 직접 텍스트 수정 가능

### 이미지 추가
1. `public/` 폴더에 이미지 파일 추가
2. 컴포넌트에서 이미지 경로 수정

## 🚀 배포

### Vercel 배포 (추천)
1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com)에서 GitHub 레포지토리 연결
3. 자동 배포 완료

### Netlify 배포
1. GitHub에 코드 푸시
2. [Netlify](https://netlify.com)에서 GitHub 레포지토리 연결
3. Build command: `npm run build`
4. Publish directory: `.next`

## 📊 분석 도구 연동

### Google Analytics 4
`app/layout.tsx`에 GA4 스크립트 추가:
```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### Meta Pixel
동일하게 `app/layout.tsx`에 Meta Pixel 스크립트 추가

## 🔒 환경 변수

환경 변수가 필요한 경우 `.env.local` 파일 생성:
```
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=your_script_url
NEXT_PUBLIC_GA_ID=your_ga_id
```

## 📝 라이선스

MIT License

## 🤝 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.
