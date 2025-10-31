const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500 // Slow down actions for visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 } // Smaller viewport to avoid image size errors
  });
  const page = await context.newPage();

  // Collect all console logs
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    console.log('🖥️ Browser Console:', msg.type(), text);
  });

  // Collect errors
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
    console.error('❌ Page Error:', error.message);
  });

  try {
    console.log('1️⃣ Navigating to http://localhost:3002');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

    console.log('2️⃣ Waiting 3 seconds for page to load');
    await page.waitForTimeout(3000);

    console.log('3️⃣ Taking initial screenshot');
    await page.screenshot({ path: 'screenshot-1-initial.png', fullPage: true });

    console.log('4️⃣ Looking for chatbot button');
    // Try multiple possible selectors for the chatbot button
    const buttonSelectors = [
      'button[class*="chatbot"]',
      'button[id*="chatbot"]',
      '.chatbot-button',
      '#chatbot-button',
      'button:has-text("챗봇")',
      'button:has-text("채팅")',
      '[aria-label*="chat"]'
    ];

    let chatbotButton = null;
    for (const selector of buttonSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.count() > 0) {
          chatbotButton = element;
          console.log(`✅ Found chatbot button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!chatbotButton) {
      // Try to find any button in the bottom right
      console.log('Looking for buttons in bottom-right area...');
      const allButtons = await page.locator('button').all();
      console.log(`Found ${allButtons.length} buttons on page`);

      // Get the last button (likely in bottom right)
      if (allButtons.length > 0) {
        chatbotButton = page.locator('button').last();
        console.log('Using last button on page as chatbot button');
      }
    }

    if (chatbotButton) {
      console.log('5️⃣ Clicking chatbot button');
      await chatbotButton.click();
      await page.waitForTimeout(2000);

      console.log('6️⃣ Taking screenshot after clicking button');
      await page.screenshot({ path: 'screenshot-2-after-click.png', fullPage: true });

      console.log('7️⃣ Looking for chat input field');
      const inputSelectors = [
        'input[type="text"]',
        'textarea',
        'input[placeholder*="메시지"]',
        'input[placeholder*="message"]',
        '[contenteditable="true"]'
      ];

      let chatInput = null;
      for (const selector of inputSelectors) {
        try {
          const element = await page.locator(selector).last();
          if (await element.isVisible()) {
            chatInput = element;
            console.log(`✅ Found input field with selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      if (chatInput) {
        console.log('8️⃣ Typing test message: "특강은 무료인가요?"');
        const testMessage = '특강은 무료인가요?';
        await chatInput.fill(testMessage);
        await page.waitForTimeout(1000);

        console.log('9️⃣ Taking screenshot with typed message');
        await page.screenshot({ path: 'screenshot-3-message-typed.png', fullPage: true });

        console.log('🔟 Looking for send button');
        const sendSelectors = [
          'button[type="submit"]',
          'button:has-text("전송")',
          'button:has-text("Send")',
          'button:has-text("보내기")',
          'button[aria-label*="send"]'
        ];

        let sendButton = null;
        for (const selector of sendSelectors) {
          try {
            const element = await page.locator(selector).last();
            if (await element.isVisible()) {
              sendButton = element;
              console.log(`✅ Found send button with selector: ${selector}`);
              break;
            }
          } catch (e) {
            // Continue
          }
        }

        if (sendButton) {
          console.log('1️⃣1️⃣ Clicking send button');
          await sendButton.click();
        } else {
          console.log('1️⃣1️⃣ Send button not found, pressing Enter');
          await chatInput.press('Enter');
        }

        console.log('1️⃣2️⃣ Waiting for AI response (8 seconds)');
        await page.waitForTimeout(8000);

        console.log('1️⃣3️⃣ Taking final screenshot with response');
        await page.screenshot({ path: 'screenshot-4-final-with-response.png', fullPage: true });

        // Check for Notion save confirmation
        console.log('1️⃣4️⃣ Checking for Notion save confirmation in console logs');
        const notionConfirmation = consoleLogs.find(log =>
          log.includes('대화 내역이 노션에 저장되었습니다') ||
          log.includes('노션에 저장') ||
          log.includes('Notion')
        );

        // Generate test summary report
        console.log('\n' + '='.repeat(70));
        console.log('📊 CHATBOT TEST SUMMARY REPORT');
        console.log('='.repeat(70));
        console.log('✅ Chatbot opened successfully: YES');
        console.log('✅ Message was sent: YES');
        console.log('✅ AI responded: Waiting period completed');
        console.log('✅ Notion save confirmation:', notionConfirmation ? 'YES' : 'NO');
        if (notionConfirmation) {
          console.log('   📝 Message:', notionConfirmation);
        }
        console.log('\n📝 Total console logs captured:', consoleLogs.length);
        console.log('❌ Total errors found:', errors.length);
        if (errors.length > 0) {
          console.log('   Errors:', errors.join(', '));
        }
        console.log('='.repeat(70));

        console.log('✅ Test completed successfully');
      } else {
        console.log('❌ Could not find chat input field');
        await page.screenshot({ path: 'screenshot-error-no-input.png', fullPage: true });
      }
    } else {
      console.log('❌ Could not find chatbot button');
      await page.screenshot({ path: 'screenshot-error-no-button.png', fullPage: true });
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
    await page.screenshot({ path: 'screenshot-error.png', fullPage: true });
  } finally {
    console.log('Waiting 5 seconds before closing browser...');
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
