/**
 * Google Apps Script 백엔드 코드
 *
 * 이 코드를 Google Sheets의 Apps Script 에디터에 붙여넣으세요.
 *
 * 설정 방법:
 * 1. Google Sheets 생성
 * 2. 확장 프로그램 > Apps Script
 * 3. 이 코드 붙여넣기
 * 4. 배포 > 새 배포 > 웹 앱 > 누구나 액세스 가능
 */

// POST 요청 처리
function doPost(e) {
  try {
    // 활성 시트 가져오기
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // JSON 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 데이터 유효성 검사
    if (!data.name || !data.email) {
      throw new Error('필수 정보가 누락되었습니다');
    }

    // 현재 시간
    const timestamp = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul'
    });

    // 스프레드시트에 행 추가
    sheet.appendRow([
      data.name,
      data.email,
      data.phone || '',
      data.marketingConsent ? '동의' : '미동의',
      timestamp,
      data.utmSource || '',
      data.utmCampaign || ''
    ]);

    // 자동 이메일 발송 (선택사항)
    sendWelcomeEmail(data.email, data.name);

    // 성공 응답
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '신청이 완료되었습니다'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 에러 로깅
    Logger.log('Error: ' + error.toString());

    // 에러 응답
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 웰컴 이메일 발송 (선택사항)
function sendWelcomeEmail(email, name) {
  try {
    const subject = '[BSD] 무료 특강 신청이 완료되었습니다! 🎉';

    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .button { display: inline-block; background: #EC4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 신청이 완료되었습니다!</h1>
            </div>
            <div class="content">
              <p><strong>${name}</strong>님, 안녕하세요!</p>

              <p>AI 바이브코딩 무료 특강 신청이 완료되었습니다.</p>

              <h2>📅 특강 일정</h2>
              <p>
                <strong>일시:</strong> 2025년 11월 20일 (수) 오후 8시<br>
                <strong>장소:</strong> 온라인 Zoom (링크는 당일 오전 발송)<br>
                <strong>준비물:</strong> 노트북, 인터넷 연결
              </p>

              <h2>🎁 참석 혜택</h2>
              <ul>
                <li>바이브코딩 스타터 템플릿 무료 증정</li>
                <li>1:1 무료 상담권 제공</li>
                <li>24시간 다시보기 제공</li>
              </ul>

              <p>특강 시작 1일 전에 리마인더 메일을 보내드리겠습니다.</p>

              <p>감사합니다!<br>
              BSD 바이브코딩 전문교육센터</p>
            </div>
            <div class="footer">
              <p>문의: contact@bsdvibecoding.com</p>
              <p>© 2025 BSD 바이브코딩 전문교육센터</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // 이메일 발송
    GmailApp.sendEmail(email, subject, '', {
      htmlBody: htmlBody,
      name: 'BSD 바이브코딩 전문교육센터'
    });

    Logger.log('Welcome email sent to: ' + email);

  } catch (error) {
    Logger.log('Email sending failed: ' + error.toString());
    // 이메일 발송 실패해도 신청은 성공으로 처리
  }
}

// GET 요청 처리 (테스트용)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Google Apps Script is running!'
  })).setMimeType(ContentService.MimeType.JSON);
}

// 리마인더 이메일 발송 (선택사항 - 트리거 설정 필요)
function sendReminderEmails() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    // 첫 번째 행(헤더) 제외
    for (let i = 1; i < data.length; i++) {
      const email = data[i][1]; // 이메일 컬럼
      const name = data[i][0];  // 이름 컬럼

      if (email) {
        sendReminderEmail(email, name);
      }
    }

    Logger.log('Reminder emails sent successfully');

  } catch (error) {
    Logger.log('Reminder email error: ' + error.toString());
  }
}

// 개별 리마인더 이메일
function sendReminderEmail(email, name) {
  const subject = '[BSD] 내일 특강입니다! 준비하셨나요? 🚀';

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Malgun Gothic', sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; }
          .zoom-link { background: #10B981; color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 내일 특강입니다!</h1>
          </div>
          <div class="content">
            <p><strong>${name}</strong>님, 안녕하세요!</p>

            <p>내일이면 기다리던 AI 바이브코딩 무료 특강이 시작됩니다!</p>

            <div class="zoom-link">
              <h2 style="margin: 0 0 10px 0;">📺 Zoom 링크</h2>
              <a href="https://zoom.us/j/your-meeting-id" style="color: white; font-size: 18px;">
                특강 참가하기
              </a>
            </div>

            <h3>⏰ 일정</h3>
            <p><strong>2025년 11월 20일 (수) 오후 8시</strong></p>

            <h3>✅ 준비사항</h3>
            <ul>
              <li>노트북 준비</li>
              <li>ChatGPT 계정 생성 (무료)</li>
              <li>안정적인 인터넷 연결</li>
            </ul>

            <p>특강 시작 10분 전 접속을 권장드립니다!</p>

            <p>내일 만나요!<br>
            BSD 바이브코딩 전문교육센터</p>
          </div>
        </div>
      </body>
    </html>
  `;

  GmailApp.sendEmail(email, subject, '', {
    htmlBody: htmlBody,
    name: 'BSD 바이브코딩 전문교육센터'
  });
}
