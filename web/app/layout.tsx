import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./common/ToastProvider";
import { LoadingProvider } from './context/LoadingContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "메추라기 - AI 메뉴 큐레이션", // 브라우저 탭에 표시될 제목
  description: "고민은 덜고 취향은 가득채워 AI가 메뉴를 추천해주는 서비스입니다.",
  // SNS 공유 시 보이는 정보 (Open Graph)
  openGraph: {
    title: "메추라기 - AI 메뉴 큐레이션",
    description: "고민은 덜고 취향은 가득채워 AI가 메뉴를 추천해주는 서비스입니다.",
    url: "https://mechuragi.site/", 
    siteName: "메추라기",
    images: [
      {
        url: "/og-image.png", // public 폴더에 이 이름으로 파일을 넣어주세요
        width: 800,
        height: 600,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  // 트위터/X 공유 설정
  twitter: {
    card: "summary_large_image",
    title: "메추라기 - AI 메뉴 큐레이션",
    description: "고민은 덜고 취향은 가득채워 AI가 메뉴를 추천해주는 서비스입니다.",
    images: ["/public/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <UserProvider>
          <NotificationProvider>
            <ToastProvider>
              <LoadingProvider>
                <ClientLayout>{children}</ClientLayout>
              </LoadingProvider>
            </ToastProvider>
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}