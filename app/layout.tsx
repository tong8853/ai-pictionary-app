import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Pictionary - AI 你画我猜",
  description: "Draw something and let AI guess what it is!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
