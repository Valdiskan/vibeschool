import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "VibeSchool — программируй словами",
  description:
    "Платформа вайбкодинга для школьников 5–9 классов: опиши программу — ИИ напишет код, песочница его запустит.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t-2 border-ink py-6 text-center text-sm text-ink/50">
          VibeSchool · пилотная версия · код выполняется в изолированной песочнице
        </footer>
      </body>
    </html>
  );
}
