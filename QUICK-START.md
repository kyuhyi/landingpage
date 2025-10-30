# ⚡ 빠른 시작 가이드

## 🚀 5분 안에 실행하기

### 1단계: 개발 서버 실행 (30초)

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 📝 Google Apps Script 설정 (5분)

### 1. Google Sheets 생성
- [Google Sheets](https://sheets.google.com) 접속
- 새 스프레드시트 만들기
- 첫 행: `이름 | 이메일 | 전화번호 | 마케팅동의 | 신청일시 | UTM Source | UTM Campaign`

### 2. Apps Script 배포
1. 확장 프로그램 > Apps Script
2. `google-apps-script-example.js` 코드 복사/붙여넣기
3. 배포 > 새 배포 > 웹 앱
4. 액세스: "누구나"
5. URL 복사

### 3. URL 연동
`components/CTASection.tsx` 12번째 줄:
```typescript
const GOOGLE_SCRIPT_URL = "복사한_URL";
```

### 4. 테스트
- 개발 서버 실행
- 폼 제출 테스트
- Google Sheets 확인

---

## 📦 프로젝트 구조

```
📁 landingtest
  📁 app/              ← 메인 페이지
  📁 components/       ← 모든 섹션
  📁 public/           ← 이미지 추가
  📄 README.md         ← 프로젝트 소개
  📄 SETUP-GUIDE.md    ← 상세 가이드
  📄 PROJECT-SUMMARY.md ← 완성 기능 목록
```

---

## 🎨 커스터마이징

### 색상 변경
`tailwind.config.ts`:
```typescript
primary: "#6366F1"   // 원하는 색상으로 변경
```

### 텍스트 수정
각 컴포넌트 파일에서 직접 수정

### 이미지 추가
`public/` 폴더에 이미지 추가 → 컴포넌트에서 `/이미지명.jpg` 사용

---

## 🚀 배포

### Vercel (가장 쉬움)
1. GitHub에 푸시
2. [Vercel](https://vercel.com) 연결
3. 자동 배포 완료

### 도메인 연결
Vercel 대시보드 > Settings > Domains

---

## 📊 완성된 섹션

✅ 히어로 섹션 (CTA 버튼)
✅ 문제 공감대 (4가지)
✅ 솔루션 제시 (비교 표)
✅ 사회적 증거 (후기)
✅ 커리큘럼 (타임라인)
✅ 강사 소개
✅ 긴급성 (카운트다운)
✅ 이메일 폼 (Google Apps Script)
✅ FAQ (아코디언)
✅ 푸터

---

## ⚠️ 체크리스트

배포 전 필수 작업:
- [ ] Google Apps Script URL 연동
- [ ] 회사 정보 업데이트
- [ ] 이미지 교체
- [ ] 카운트다운 날짜 설정

---

## 💡 도움말

더 자세한 정보는:
- `SETUP-GUIDE.md` - 상세 설정
- `PROJECT-SUMMARY.md` - 완성 기능
- `README.md` - 프로젝트 소개

---

**준비 완료! 🎉**

개발 서버를 실행하고 http://localhost:3000 에서 확인하세요!
