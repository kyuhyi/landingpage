# 📚 Project Index - AI 바이브코딩 랜딩페이지

> Comprehensive documentation and navigation guide for the landing page project

**Last Updated**: 2025-10-31
**Project Version**: 1.0.0
**Framework**: Next.js 14 + TypeScript + Tailwind CSS

---

## 📖 Table of Contents

1. [Project Overview](#-project-overview)
2. [Quick Navigation](#-quick-navigation)
3. [Architecture Documentation](#-architecture-documentation)
4. [Component Reference](#-component-reference)
5. [Configuration Reference](#-configuration-reference)
6. [Development Guides](#-development-guides)
7. [Deployment & Operations](#-deployment--operations)

---

## 🎯 Project Overview

### Purpose
High-conversion landing page for AI Vibe Coding free workshop, built with modern web technologies and conversion optimization best practices.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3, Framer Motion
- **Backend**: Google Apps Script (email collection)
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4 ready

### Key Features
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Smooth scroll animations with Framer Motion
- ✅ Real-time countdown timer
- ✅ Email collection form with Google Apps Script
- ✅ FAQ accordion
- ✅ SEO optimization

---

## 🧭 Quick Navigation

### Essential Documentation
- **[README.md](README.md)** - Project introduction and basic setup
- **[SETUP-GUIDE.md](SETUP-GUIDE.md)** - Complete step-by-step setup guide
- **[PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)** - Feature completion checklist
- **[QUICK-START.md](QUICK-START.md)** - Fast start guide
- **[prd.md](prd.md)** - Product Requirements Document

### Configuration Files
- [package.json](package.json) - Dependencies and scripts
- [tsconfig.json](tsconfig.json) - TypeScript configuration
- [tailwind.config.js](tailwind.config.js) - Tailwind CSS configuration
- [next.config.js](next.config.js) - Next.js configuration
- [next-sitemap.config.js](next-sitemap.config.js) - Sitemap generation

### Backend Integration
- [google-apps-script-example.js](google-apps-script-example.js) - Backend code for email collection

---

## 🏗️ Architecture Documentation

### Project Structure
```
landingpage-master/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with SEO metadata
│   ├── page.tsx                  # Main landing page (composition)
│   ├── globals.css               # Global styles
│   └── contact/                  # Contact page route
│       └── page.tsx
│
├── components/                   # React components
│   ├── Header.tsx                # Navigation header
│   ├── HeroSection.tsx           # Section 1: Hero with CTA
│   ├── ProblemSection.tsx        # Section 2: Problem identification
│   ├── SolutionSection.tsx       # Section 3: Solution presentation
│   ├── SocialProofSection.tsx    # Section 4: Testimonials & stats
│   ├── CurriculumSection.tsx     # Section 5: Course curriculum
│   ├── InstructorSection.tsx     # Section 6: Instructor profile
│   ├── UrgencySection.tsx        # Section 7: Countdown timer
│   ├── CTASection.tsx            # Section 8: Email collection form
│   ├── FAQSection.tsx            # Section 9: FAQ accordion
│   ├── ContactForm.tsx           # Contact form component
│   ├── SplineScene.tsx           # 3D scene component
│   ├── Footer.tsx                # Footer with links
│   └── ui/                       # UI primitives
│       ├── card.tsx              # Card component
│       ├── splite.tsx            # Split text animation
│       └── spotlight.tsx         # Spotlight effect
│
├── lib/                          # Utility functions
│   ├── utils.ts                  # TypeScript utilities
│   └── utils.js                  # JavaScript utilities
│
├── public/                       # Static assets
│   ├── bsd-og.png                # Open Graph image
│   ├── bsd-symbol-color.png      # Brand symbol
│   ├── bsd-white.png             # White logo variant
│   ├── class.gif                 # Class animation
│   ├── sitemap.xml               # Generated sitemap
│   ├── robots.txt                # Search engine instructions
│   └── verification files        # Google/Naver verification
│
└── SuperClaude_Framework/        # Framework documentation (separate)
```

### Page Composition Flow
[app/page.tsx](app/page.tsx:1-40) orchestrates all sections:

```
Header
  ↓
HeroSection (CTA)
  ↓
ProblemSection (pain points)
  ↓
SolutionSection (benefits)
  ↓
SocialProofSection (testimonials)
  ↓
CurriculumSection (course details)
  ↓
InstructorSection (credibility)
  ↓
UrgencySection (scarcity)
  ↓
CTASection (conversion)
  ↓
FAQSection (objection handling)
  ↓
Footer
```

### Data Flow
```
User Input (CTASection.tsx)
  ↓
Form Validation (client-side)
  ↓
POST to Google Apps Script
  ↓
Google Sheets Storage
  ↓
Email Automation (Gmail API)
  ↓
Success Modal Display
```

---

## 📦 Component Reference

### Layout Components

#### [app/layout.tsx](app/layout.tsx)
**Purpose**: Root layout with SEO metadata
**Key Features**:
- Complete SEO metadata (Open Graph, Twitter Card)
- Pretendard font loading
- HTML lang attribute (Korean)
- Favicon configuration

**Metadata Configuration**:
```typescript
export const metadata: Metadata = {
  title: "BSD AI 사이트 모음집",
  description: "AI 바이브코딩, 퍼널마케팅...",
  openGraph: { /* OG config */ },
  twitter: { /* Twitter Card */ },
  keywords: ["AI 바이브코딩", "퍼널마케팅"],
}
```

### Section Components

#### [components/Header.tsx](components/Header.tsx)
**Purpose**: Navigation header
**Features**: Logo, navigation links, CTA button

#### [components/HeroSection.tsx](components/HeroSection.tsx)
**Purpose**: Above-the-fold hero section
**Features**:
- Eye-catching headline
- Trust indicators (2,000 students, 4.9/5.0 rating)
- Primary CTA button with scroll functionality
- Pulse animation
- Hero image placeholder

#### [components/ProblemSection.tsx](components/ProblemSection.tsx)
**Purpose**: Pain point identification
**Features**:
- 4 core pain points
- Visual icons
- Sequential fade-in animation
- Card-based layout

#### [components/SolutionSection.tsx](components/SolutionSection.tsx)
**Purpose**: Solution presentation
**Features**:
- 3 key benefits
- Traditional vs AI Vibe Coding comparison table
- Gradient design
- Hover effects

#### [components/SocialProofSection.tsx](components/SocialProofSection.tsx)
**Purpose**: Social proof and testimonials
**Features**:
- Count-up statistics animation
- 3 student testimonials
- Star rating system
- Trust building elements

#### [components/CurriculumSection.tsx](components/CurriculumSection.tsx)
**Purpose**: Course curriculum display
**Features**:
- 3-part timeline structure
- Detailed content per section
- Bonus benefits highlight
- Timeline UI design

#### [components/InstructorSection.tsx](components/InstructorSection.tsx)
**Purpose**: Instructor credibility
**Features**:
- Profile card
- Career and certifications
- Instructor message
- Professional design

#### [components/UrgencySection.tsx](components/UrgencySection.tsx)
**Purpose**: Create urgency and scarcity
**Features**:
- Real-time countdown timer
- Remaining seats indicator (progress bar)
- Urgency messaging
- FOMO induction

**Timer Configuration**:
```typescript
// Set target date in component
const targetDate = new Date("2025-12-31T23:59:59");
```

#### [components/CTASection.tsx](components/CTASection.tsx)
**Purpose**: Email collection and conversion
**Features**:
- Email collection form
- Real-time validation
- Privacy emphasis
- Success modal
- Google Apps Script integration

**Configuration Required**:
```typescript
// Line 12
const GOOGLE_SCRIPT_URL = "YOUR_SCRIPT_URL_HERE";
```

#### [components/FAQSection.tsx](components/FAQSection.tsx)
**Purpose**: Handle objections
**Features**:
- 5 frequently asked questions
- Accordion UI
- Smooth animations
- Mobile optimized

#### [components/Footer.tsx](components/Footer.tsx)
**Purpose**: Footer with links and info
**Features**:
- Company information
- Links (Privacy Policy, Terms of Service)
- Social media icons
- Copyright information

### UI Components

#### [components/ui/card.tsx](components/ui/card.tsx)
**Purpose**: Reusable card component
**Variants**: Default, outline, ghost

#### [components/ui/splite.tsx](components/ui/splite.tsx)
**Purpose**: Split text animation
**Usage**: Animated text reveals

#### [components/ui/spotlight.tsx](components/ui/spotlight.tsx)
**Purpose**: Spotlight effect
**Usage**: Visual emphasis on sections

---

## ⚙️ Configuration Reference

### [package.json](package.json)
**Scripts**:
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Production build + sitemap generation
- `npm start` - Start production server
- `npm run lint` - Run ESLint

**Key Dependencies**:
- `next@^14.2.18` - Next.js framework
- `react@^18.3.1` - React library
- `framer-motion@^12.23.24` - Animation library
- `tailwindcss@^3.4.1` - CSS framework
- `lucide-react@^0.548.0` - Icon library
- `@splinetool/react-spline@^4.1.0` - 3D scene tool

### [tsconfig.json](tsconfig.json)
**Key Settings**:
- Target: ES2017
- Module: ESNext
- Path alias: `@/*` → `./*`
- Strict mode: Enabled

### [tailwind.config.js](tailwind.config.js)
**Customization Points**:
- Brand colors configuration
- Custom fonts
- Screen breakpoints
- Animation utilities

**Recommended Brand Colors**:
```javascript
colors: {
  primary: "#6366F1",    // Indigo - trust, professionalism
  secondary: "#EC4899",  // Pink - energy, action
  accent: "#10B981",     // Green - success, positivity
}
```

### [next.config.js](next.config.js)
**Configuration**:
- Image optimization settings
- Environment variables
- Build optimization

### [next-sitemap.config.js](next-sitemap.config.js)
**SEO Configuration**:
- Sitemap generation
- Robots.txt rules
- URL structure

---

## 🛠️ Development Guides

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Google Apps Script Setup

**Required for email collection functionality**

See detailed guide: [SETUP-GUIDE.md](SETUP-GUIDE.md)

**Quick Steps**:
1. Create Google Sheets with headers: `이름`, `이메일`, `전화번호`, `마케팅동의`, `신청일시`, `UTM Source`, `UTM Campaign`
2. Create Apps Script project: Extensions > Apps Script
3. Copy code from [google-apps-script-example.js](google-apps-script-example.js)
4. Deploy as Web App: Deploy > New Deployment
5. Update `GOOGLE_SCRIPT_URL` in [components/CTASection.tsx](components/CTASection.tsx:12)

### Customization Guide

#### Change Colors
Edit [tailwind.config.js](tailwind.config.js):
```javascript
theme: {
  extend: {
    colors: {
      primary: "#YOUR_COLOR",
      secondary: "#YOUR_COLOR",
      accent: "#YOUR_COLOR",
    }
  }
}
```

#### Modify Text Content
Each component file contains editable content. Search for Korean text strings and update as needed.

#### Add/Remove Sections
Edit [app/page.tsx](app/page.tsx) to change component order or remove sections:
```typescript
// Remove a section
// import ProblemSection from "@/components/ProblemSection";
// <ProblemSection />

// Change order
<HeroSection />
<SolutionSection />  // Moved up
<ProblemSection />   // Moved down
```

#### Adjust Animations
Each component uses Framer Motion. Modify `motion` properties:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Testing Checklist

- [ ] Mobile responsiveness (iPhone, Android)
- [ ] Cross-browser compatibility (Chrome, Safari, Firefox, Edge)
- [ ] Form submission and validation
- [ ] Email delivery test
- [ ] Countdown timer accuracy
- [ ] Animation smoothness
- [ ] Page load speed (Lighthouse audit)
- [ ] SEO metadata verification

---

## 🚀 Deployment & Operations

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Auto-deployment configured

3. **Environment Variables** (if needed)
   Add in Vercel dashboard:
   - `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - `NEXT_PUBLIC_GA_ID`

### Alternative Deployment: Netlify

1. Push code to GitHub
2. Connect repository on [netlify.com](https://netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Domain Configuration

After deployment, update [app/layout.tsx](app/layout.tsx:4):
```typescript
const siteUrl = "https://your-domain.com";
```

### Analytics Integration

#### Google Analytics 4
Add to [app/layout.tsx](app/layout.tsx):
```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script dangerouslySetInnerHTML={{
  __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `
}} />
```

#### Meta Pixel
Add Meta Pixel script similarly in layout.

### Performance Optimization

**Current Optimizations**:
- Next.js automatic code splitting
- Image optimization ready
- Tailwind CSS purge enabled
- Fast initial load

**Recommended**:
- Add actual images with `next/image` component
- Enable image optimization
- Implement lazy loading for below-fold content
- Configure CDN caching

### SEO Checklist

- [x] Meta tags configured
- [x] Open Graph support
- [x] Semantic HTML structure
- [x] Sitemap generation
- [x] Robots.txt
- [ ] Google Search Console verification
- [ ] Naver Search verification
- [ ] Submit sitemap to search engines
- [ ] Monitor Core Web Vitals

---

## 📊 Project Metrics & KPIs

### Target Metrics (from PRD)
- **Conversion Rate**: 15%+
- **Email Collection**: 300+ leads/month
- **Workshop Attendance**: 40%+
- **Ad ROAS**: 300%+

### Performance Benchmarks
- **Lighthouse Score**: 90+ (all categories)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

---

## 🔗 Related Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Design Resources
- [Design Philosophy](bsd-design-philosophy.md) - BSD design principles
- Brand Assets: [public/bsd-*](public/)

### Framework Documentation
- [SuperClaude_Framework/](SuperClaude_Framework/) - Separate framework docs

---

## 🆘 Troubleshooting

### Common Issues

**Form submission fails**
- Verify Google Apps Script URL is correct
- Check script deployment permissions
- Ensure CORS is enabled in Apps Script

**Animations not working**
- Check Framer Motion installation
- Verify `motion` components are used correctly
- Check browser compatibility

**Build fails**
- Run `npm install` to ensure dependencies
- Check TypeScript errors: `npm run lint`
- Verify all imports are correct

**Images not loading**
- Ensure images are in `public/` directory
- Use correct path: `/image.png` (not `./public/image.png`)
- Check file names match exactly (case-sensitive)

### Getting Help
1. Check [SETUP-GUIDE.md](SETUP-GUIDE.md) troubleshooting section
2. Review project documentation
3. Check GitHub issues
4. Contact development team

---

## 📝 License

MIT License

---

## ✅ Next Steps Checklist

### Required Tasks
- [ ] Configure Google Apps Script and update URL
- [ ] Replace placeholder images with actual images
- [ ] Update company information (business registration)
- [ ] Set countdown timer target date
- [ ] Purchase and connect domain

### Optional Enhancements
- [ ] Integrate Google Analytics
- [ ] Add Meta Pixel
- [ ] Add real student testimonials
- [ ] Add instructor profile photo
- [ ] Configure Zoom link for workshop
- [ ] Write Privacy Policy page
- [ ] Write Terms of Service page
- [ ] Add exit-intent popup
- [ ] Integrate live chat

---

**Documentation Maintained By**: Development Team
**Last Review**: 2025-10-31
**Next Review**: As needed for major updates
