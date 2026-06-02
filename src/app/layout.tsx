import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { TabBar } from "@/components/layout/TabBar";

export const metadata: Metadata = {
  title: "Humans",
  description: "Telegram Mini App для поиска каналов и людей по интересам",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0b0d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="font-sans">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <AppProvider>
          <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-3">
            {children}
          </div>
          <TabBar />
        </AppProvider>
      </body>
    </html>
  );
}
