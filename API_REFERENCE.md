# 🔌 API Reference - Landing Page Project

> Technical reference for APIs, integrations, and data structures

**Last Updated**: 2025-10-31

---

## 📖 Table of Contents

1. [Google Apps Script API](#-google-apps-script-api)
2. [Component Props Reference](#-component-props-reference)
3. [Utility Functions](#-utility-functions)
4. [Type Definitions](#-type-definitions)
5. [Integration Endpoints](#-integration-endpoints)

---

## 📊 Google Apps Script API

### Endpoint Configuration

**Base URL**: Your deployed Google Apps Script Web App URL
**Method**: POST
**Content-Type**: application/json

### Request Schema

#### Email Submission Endpoint

**Location**: [components/CTASection.tsx](components/CTASection.tsx:12)

```typescript
POST {GOOGLE_SCRIPT_URL}

// Request Body
{
  name: string;              // User's full name
  email: string;             // User's email address
  phone?: string;            // Optional phone number
  marketingConsent: boolean; // Marketing agreement status
  timestamp: string;         // ISO 8601 timestamp
  utmSource?: string;        // UTM source parameter
  utmCampaign?: string;      // UTM campaign parameter
}
```

#### Request Example

```typescript
const formData = {
  name: "홍길동",
  email: "hong@example.com",
  phone: "010-1234-5678",
  marketingConsent: true,
  timestamp: "2025-10-31T14:30:00.000Z",
  utmSource: "facebook",
  utmCampaign: "ai-workshop-nov"
};

const response = await fetch(GOOGLE_SCRIPT_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
});
```

### Response Schema

#### Success Response

```typescript
{
  status: "success";
  message: "신청이 완료되었습니다";
}
```

**HTTP Status**: 200 OK

#### Error Response

```typescript
{
  status: "error";
  message: string; // Error description
}
```

**HTTP Status**: 200 OK (Apps Script limitation)

### Google Sheets Data Structure

**Sheet Headers** (Row 1):
```
이름 | 이메일 | 전화번호 | 마케팅동의 | 신청일시 | UTM Source | UTM Campaign
```

**Data Row Example**:
```
홍길동 | hong@example.com | 010-1234-5678 | 동의 | 2025-10-31 14:30:00 | facebook | ai-workshop-nov
```

### Apps Script Implementation

**File**: [google-apps-script-example.js](google-apps-script-example.js)

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Append row to sheet
    sheet.appendRow([
      data.name,
      data.email,
      data.phone || '',
      data.marketingConsent ? '동의' : '미동의',
      data.timestamp,
      data.utmSource || '',
      data.utmCampaign || ''
    ]);

    // Optional: Send confirmation email
    GmailApp.sendEmail(
      data.email,
      "특강 신청 완료",
      `${data.name}님, 신청이 완료되었습니다.`
    );

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: '신청이 완료되었습니다'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Error Handling

**Client-Side Validation**:
```typescript
// Email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error("올바른 이메일 형식이 아닙니다");
}

// Required field validation
if (!name || !email) {
  throw new Error("필수 항목을 입력해주세요");
}

// Marketing consent validation
if (!marketingConsent) {
  throw new Error("마케팅 수신 동의가 필요합니다");
}
```

**Network Error Handling**:
```typescript
try {
  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("서버 오류가 발생했습니다");
  }

  const result = await response.json();

  if (result.status === "error") {
    throw new Error(result.message);
  }

} catch (error) {
  console.error("Form submission error:", error);
  alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
}
```

---

## 🧩 Component Props Reference

### Core Section Components

Most section components follow the pattern of being **prop-less** (no required props) for simplicity. Content is hard-coded within components for this landing page implementation.

#### Header Component

**File**: [components/Header.tsx](components/Header.tsx)

```typescript
interface HeaderProps {
  // No props - static navigation
}

export default function Header(): JSX.Element
```

#### HeroSection Component

**File**: [components/HeroSection.tsx](components/HeroSection.tsx)

```typescript
interface HeroSectionProps {
  // No props - static content with internal scroll logic
}

export default function HeroSection(): JSX.Element
```

**Internal Methods**:
- `scrollToCTA()`: Smooth scroll to CTA section

#### CTASection Component

**File**: [components/CTASection.tsx](components/CTASection.tsx)

```typescript
interface CTASectionProps {
  // No props - form logic self-contained
}

interface FormData {
  name: string;
  email: string;
  phone?: string;
  marketingConsent: boolean;
}

interface SubmissionState {
  isSubmitting: boolean;
  showSuccess: boolean;
  error: string | null;
}

export default function CTASection(): JSX.Element
```

**Internal State**:
```typescript
const [formData, setFormData] = useState<FormData>({
  name: "",
  email: "",
  phone: "",
  marketingConsent: false,
});

const [state, setState] = useState<SubmissionState>({
  isSubmitting: false,
  showSuccess: false,
  error: null,
});
```

**Methods**:
- `handleSubmit(e: FormEvent)`: Form submission handler
- `handleInputChange(field: keyof FormData, value: any)`: Input change handler
- `validateForm()`: Client-side validation

#### FAQSection Component

**File**: [components/FAQSection.tsx](components/FAQSection.tsx)

```typescript
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  // No props - static FAQ data
}

export default function FAQSection(): JSX.Element
```

**Internal State**:
```typescript
const [openIndex, setOpenIndex] = useState<number | null>(null);

const faqs: FAQItem[] = [
  {
    question: "프로그래밍 경험이 없어도 참여할 수 있나요?",
    answer: "네, 전혀 문제없습니다..."
  },
  // ... more FAQ items
];
```

#### UrgencySection Component

**File**: [components/UrgencySection.tsx](components/UrgencySection.tsx)

```typescript
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UrgencySectionProps {
  // No props - countdown logic self-contained
}

export default function UrgencySection(): JSX.Element
```

**Internal State**:
```typescript
const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

// Target date configuration
const targetDate = new Date("2025-12-31T23:59:59");
```

**Methods**:
- `calculateTimeRemaining()`: Calculate time difference
- `updateCountdown()`: Update timer every second

### UI Components

#### Card Component

**File**: [components/ui/card.tsx](components/ui/card.tsx)

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  className,
  children,
  ...props
}: CardProps): JSX.Element
```

**Variants**:
- `default`: Standard card with background
- `outline`: Card with border only
- `ghost`: Minimal styling

#### Spotlight Component

**File**: [components/ui/spotlight.tsx](components/ui/spotlight.tsx)

```typescript
interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({
  className,
  fill = "white"
}: SpotlightProps): JSX.Element
```

---

## 🔧 Utility Functions

### [lib/utils.ts](lib/utils.ts)

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**Usage Example**:
```typescript
import { cn } from "@/lib/utils";

// Merge multiple class names with proper precedence
const className = cn(
  "px-4 py-2",
  "bg-blue-500",
  isActive && "bg-green-500", // Conditional class
  props.className // External classes
);
// Result: "px-4 py-2 bg-green-500 {props.className}"
```

### Animation Utilities

**Framer Motion Variants**:

```typescript
// Fade in from bottom
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Fade in with delay
const fadeInWithDelay = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay }
});

// Stagger children animation
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

**Usage**:
```typescript
<motion.div {...fadeInUp}>
  <h1>Animated Title</h1>
</motion.div>

<motion.div variants={staggerContainer} animate="animate">
  {items.map((item, i) => (
    <motion.div key={i} variants={fadeInUp}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Form Validation

```typescript
/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Korean format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
}
```

### Date/Time Utilities

```typescript
/**
 * Format timestamp to Korean datetime
 */
export function formatKoreanDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

/**
 * Calculate time difference
 */
export function getTimeDifference(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000)
  };
}
```

---

## 📐 Type Definitions

### Global Types

```typescript
// SEO Metadata
interface SiteMetadata {
  title: string | { default: string; template: string };
  description: string;
  keywords: string[];
  openGraph: {
    type: string;
    url: string;
    title: string;
    description: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
}

// Form Types
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  marketingConsent: boolean;
  timestamp: string;
  utmSource?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmTerm?: string;
  utmContent?: string;
}

// Animation Types
interface MotionVariants {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit?: Record<string, any>;
  transition?: Record<string, any>;
}

// Component Common Types
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}
```

### Component-Specific Types

```typescript
// FAQ Types
interface FAQItem {
  question: string;
  answer: string;
}

// Testimonial Types
interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

// Curriculum Types
interface CurriculumModule {
  title: string;
  duration: string;
  topics: string[];
  description: string;
}

// Countdown Timer Types
interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
```

---

## 🔗 Integration Endpoints

### Analytics Integration

#### Google Analytics 4

```typescript
// GA4 Configuration
interface GA4Config {
  measurementId: string; // G-XXXXXXXXXX
  events: {
    page_view: boolean;
    form_submit: boolean;
    cta_click: boolean;
  };
}

// Track custom event
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      params?: Record<string, any>
    ) => void;
  }
}

// Usage
window.gtag('event', 'form_submit', {
  event_category: 'engagement',
  event_label: 'email_collection',
  value: 1
});
```

#### Meta Pixel

```typescript
// Meta Pixel Configuration
interface MetaPixelConfig {
  pixelId: string;
  events: {
    PageView: boolean;
    Lead: boolean;
    CompleteRegistration: boolean;
  };
}

// Track custom event
declare global {
  interface Window {
    fbq: (
      command: 'track' | 'trackCustom',
      event: string,
      params?: Record<string, any>
    ) => void;
  }
}

// Usage
window.fbq('track', 'Lead', {
  content_name: 'AI Workshop Signup',
  value: 0,
  currency: 'KRW'
});
```

### UTM Parameter Tracking

```typescript
/**
 * Extract UTM parameters from URL
 */
export function getUTMParameters(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
} {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    utmContent: params.get('utm_content') || undefined,
  };
}

// Usage in form submission
const utmParams = getUTMParameters();
const formData = {
  ...userInput,
  ...utmParams,
  timestamp: new Date().toISOString()
};
```

### Email Service Integration

#### Gmail API (via Apps Script)

```javascript
// In Google Apps Script
function sendConfirmationEmail(recipientEmail, recipientName) {
  const subject = "AI 바이브코딩 특강 신청 완료";

  const htmlBody = `
    <h2>${recipientName}님, 신청이 완료되었습니다!</h2>
    <p>AI 바이브코딩 무료 특강에 신청해주셔서 감사합니다.</p>
    <h3>특강 일정</h3>
    <ul>
      <li>날짜: 2025년 12월 31일</li>
      <li>시간: 오후 8시</li>
      <li>방식: 온라인 (Zoom)</li>
    </ul>
    <p>특강 시작 1시간 전에 Zoom 링크를 보내드리겠습니다.</p>
  `;

  GmailApp.sendEmail(recipientEmail, subject, "", {
    htmlBody: htmlBody,
    name: "AI 바이브코딩"
  });
}
```

---

## 🔐 Security Considerations

### CORS Configuration

**Apps Script**: Automatically handles CORS for web apps

**Next.js API Routes** (if adding custom endpoints):
```typescript
// app/api/example/route.ts
export async function POST(request: Request) {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### Data Privacy

**Client-Side**:
- No sensitive data stored in localStorage
- Form data sent via HTTPS only
- Marketing consent explicitly required

**Server-Side (Apps Script)**:
- Data stored in private Google Sheets
- Access controlled via Google permissions
- Email automation respects marketing consent

### Rate Limiting

**Recommended Implementation**:
```typescript
// Client-side rate limiting
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 5000; // 5 seconds

function canSubmit(): boolean {
  const now = Date.now();
  if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
    return false;
  }
  lastSubmitTime = now;
  return true;
}
```

---

## 📚 API Usage Examples

### Complete Form Submission Flow

```typescript
// components/CTASection.tsx - Complete example

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // 1. Validate form
  if (!isValidEmail(formData.email)) {
    alert("올바른 이메일 형식이 아닙니다");
    return;
  }

  if (!formData.marketingConsent) {
    alert("마케팅 수신 동의가 필요합니다");
    return;
  }

  // 2. Prepare submission data
  const submissionData = {
    ...formData,
    timestamp: new Date().toISOString(),
    ...getUTMParameters(),
  };

  // 3. Set loading state
  setState({ isSubmitting: true, showSuccess: false, error: null });

  try {
    // 4. Submit to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    const result = await response.json();

    if (result.status === "error") {
      throw new Error(result.message);
    }

    // 5. Track analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: 'workshop_signup',
      });
    }

    // 6. Show success modal
    setState({ isSubmitting: false, showSuccess: true, error: null });

    // 7. Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      marketingConsent: false,
    });

  } catch (error) {
    console.error("Form submission error:", error);
    setState({
      isSubmitting: false,
      showSuccess: false,
      error: "신청 중 오류가 발생했습니다. 다시 시도해주세요."
    });
  }
};
```

---

**API Documentation Maintained By**: Development Team
**Last Review**: 2025-10-31
**Next Review**: As needed for integration updates
