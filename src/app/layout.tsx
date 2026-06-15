import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MVP 레기온 | 아이온2",
  description: "아이온2 MVP 레기온 2파티 공식 웹페이지 - 레기온 정보 및 공격 일정",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
