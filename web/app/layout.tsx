import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "스킬 시커 - Claude AI 스킬 자동 생성기",
  description: "문서 사이트를 Claude AI 스킬로 자동 변환하세요. 쉽고 빠르게!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
