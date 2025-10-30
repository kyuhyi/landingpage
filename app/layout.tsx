import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://landingtest-six.vercel.app"; // ← 배포 도메인으로 교체

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BSD AI 사이트 모음집 | AI 바이브코딩 & 퍼널",
    template: "%s | BSD AI",
  },
  description:
    "AI 바이브코딩, 퍼널마케팅, 자동화 툴을 한곳에. 퍼널띵의 실전 콘텐츠와 랜딩 템플릿, 교육 자료를 빠르게 찾아보세요.",
  alternates: {
    canonical: siteUrl,
    languages: { ko: `${siteUrl}/` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "BSD AI 사이트 모음집",
    description:
      "퍼널띵의 유익한 컨텐츠를 모아보세요. AI 바이브코딩과 퍼널마케팅 리소스가 한 곳에.",
    siteName: "BSD AI",
    images: [
      {
        url: "/bsd-og.png",
        width: 1200,
        height: 630,
        alt: "BSD AI 사이트 모음집",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BSD AI 사이트 모음집",
    description: "AI 바이브코딩 & 퍼널마케팅 리소스 컬렉션.",
    images: ["/bsd-og.png"],
  },
  // 'keywords'는 비권장이나 요청 시 최소화하여 배열로:
  keywords: ["AI 바이브코딩", "퍼널마케팅", "랜딩페이지", "BSD", "퍼널띵"],
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  category: "technology",
  verification: {
    // 필요한 경우: google: "구글서치콘솔코드"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
