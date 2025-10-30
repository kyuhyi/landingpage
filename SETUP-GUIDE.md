# AI 바이브코딩 랜딩페이지 - 완벽 설정 가이드

## 📋 목차
1. [빠른 시작](#빠른-시작)
2. [Google Apps Script 설정](#google-apps-script-설정)
3. [커스터마이징](#커스터마이징)
4. [배포하기](#배포하기)
5. [문제 해결](#문제-해결)

---

## 🚀 빠른 시작

### 1. 프로젝트 실행

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 열기
```

서버가 정상적으로 실행되면 랜딩페이지를 확인할 수 있습니다!

---

## 📧 Google Apps Script 설정

이 랜딩페이지는 Google Apps Script를 백엔드로 사용하여 이메일을 수집합니다.

### Step 1: Google Sheets 생성

1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 만들기
3. 첫 번째 행에 다음 헤더 입력:
   ```
   이름 | 이메일 | 전화번호 | 마케팅동의 | 신청일시 | UTM Source | UTM Campaign
   ```

### Step 2: Apps Script 프로젝트 생성

1. Google Sheets에서 `확장 프로그램` > `Apps Script` 클릭
2. 프로젝트 이름 변경: "랜딩페이지 백엔드"
3. 기존 코드를 모두 삭제
4. `google-apps-script-example.js` 파일의 코드를 복사하여 붙여넣기

### Step 3: 웹 앱으로 배포

1. Apps Script 에디터 상단의 `배포` 버튼 클릭
2. `새 배포` 선택
3. 설정:
   - **유형 선택**: "웹 앱"
   - **설명**: "랜딩페이지 이메일 수집"
   - **액세스 권한**: "누구나" 선택
   - **실행 계정**: 나 (본인 계정)
4. `배포` 클릭
5. **권한 승인**:
   - "권한 검토" 클릭
   - Google 계정 선택
   - "고급" > "안전하지 않은 페이지로 이동" 클릭
   - "허용" 클릭
6. **웹 앱 URL 복사**:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

### Step 4: 랜딩페이지에 URL 적용

1. `components/CTASection.tsx` 파일 열기
2. 12번째 줄 찾기:
   ```typescript
   const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
   ```
3. 복사한 URL로 변경:
   ```typescript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby.../exec";
   ```
4. 파일 저장

### Step 5: 테스트

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 http://localhost:3000 접속
3. 페이지 하단 신청 폼에서 테스트 데이터 입력
4. "무료 특강 신청 완료하기" 버튼 클릭
5. Google Sheets 확인 → 데이터가 추가되었는지 확인

---

## 🎨 커스터마이징

### 색상 변경

`tailwind.config.ts` 파일에서 브랜드 색상 수정:

```typescript
colors: {
  primary: "#6366F1",    // 메인 색상 (인디고)
  secondary: "#EC4899",  // 액센트 색상 (핑크)
  accent: "#10B981",     // 강조 색상 (그린)
}
```

### 텍스트 수정

각 섹션별 컴포넌트 파일에서 직접 수정:

- **히어로 섹션**: `components/HeroSection.tsx`
- **문제 공감대**: `components/ProblemSection.tsx`
- **솔루션 제시**: `components/SolutionSection.tsx`
- **사회적 증거**: `components/SocialProofSection.tsx`
- **커리큘럼**: `components/CurriculumSection.tsx`
- **강사 소개**: `components/InstructorSection.tsx`
- **긴급성**: `components/UrgencySection.tsx`
- **CTA 폼**: `components/CTASection.tsx`
- **FAQ**: `components/FAQSection.tsx`
- **푸터**: `components/Footer.tsx`

### 이미지 추가

1. `public/` 폴더에 이미지 파일 추가
   ```
   public/
   ├── hero-image.jpg
   ├── instructor.jpg
   └── logo.png
   ```

2. 컴포넌트에서 이미지 사용:
   ```tsx
   <img src="/hero-image.jpg" alt="설명" />
   ```

### 카운트다운 타이머 날짜 변경

`components/UrgencySection.tsx`에서 타겟 날짜 설정:

```typescript
// 예: 2025년 11월 20일 오후 8시로 설정
const targetDate = new Date('2025-11-20T20:00:00');
```

---

## 🚀 배포하기

### Vercel 배포 (추천)

1. **GitHub에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Vercel 연결**
   - [Vercel](https://vercel.com) 접속
   - "Import Project" 클릭
   - GitHub 레포지토리 선택
   - 자동 배포 시작

3. **환경 변수 설정** (선택사항)
   - Vercel 대시보드에서 프로젝트 선택
   - Settings > Environment Variables
   - 필요한 환경 변수 추가

4. **배포 완료**
   - 자동으로 URL 생성됨
   - 예: `https://your-project.vercel.app`

### 커스텀 도메인 연결

1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Domains
3. 도메인 입력 (예: `aivibecoding.com`)
4. DNS 설정 안내에 따라 도메인 등록 업체에서 설정

---

## 📊 분석 도구 연동

### Google Analytics 4

1. [Google Analytics](https://analytics.google.com) 접속
2. 새 속성 만들기
3. 측정 ID 복사 (예: `G-XXXXXXXXXX`)
4. `app/layout.tsx`에 추가:

```tsx
<head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  ></script>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
      `,
    }}
  />
</head>
```

### Meta Pixel (Facebook)

1. [Meta Events Manager](https://business.facebook.com/events_manager) 접속
2. 픽셀 생성
3. 픽셀 ID 복사
4. `app/layout.tsx`에 추가:

```tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', 'YOUR_PIXEL_ID');
        fbq('track', 'PageView');
      `,
    }}
  />
</head>
```

---

## 🛠️ 문제 해결

### 문제: 개발 서버가 실행되지 않음

**해결책:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 또는 캐시 클리어
npm cache clean --force
npm install
```

### 문제: 타입스크립트 에러

**해결책:**
```bash
# tsconfig.json 삭제 후 재생성
rm tsconfig.json
npm run dev
```

### 문제: 폼 제출이 작동하지 않음

**체크리스트:**
1. Google Apps Script URL이 올바른지 확인
2. Apps Script가 "누구나" 액세스 가능으로 배포되었는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. Google Sheets의 Apps Script 로그 확인

### 문제: 스타일이 적용되지 않음

**해결책:**
```bash
# Tailwind CSS 재설정
npx tailwindcss init -p

# 개발 서버 재시작
npm run dev
```

### 문제: 이미지가 표시되지 않음

**체크리스트:**
1. 이미지가 `public/` 폴더에 있는지 확인
2. 이미지 경로가 `/`로 시작하는지 확인 (예: `/hero.jpg`)
3. 이미지 파일 이름 대소문자 확인

---

## 💡 추가 기능 아이디어

### 1. Exit-Intent 팝업 추가
방문자가 페이지를 떠나려 할 때 팝업 표시

### 2. 라이브 채팅 연동
- Tawk.to
- Crisp
- 카카오톡 채널

### 3. A/B 테스트
- Google Optimize
- VWO

### 4. 자동 이메일 시퀀스
- Mailchimp
- SendGrid
- ConvertKit

---

## 📞 지원

문제가 해결되지 않으면 이슈를 등록해주세요!

**행운을 빕니다! 🚀**
