import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { Toaster } from "sonner";
import ChatBox from "@/components/AITourGuide/ChatBox";

export const metadata: Metadata = {
    title: "Tour Huế 360° - Di Sản & Làng Nghề Cố Đô",
    description: "Trải nghiệm thực tế ảo và khám phá văn hóa làng nghề xứ Huế",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
        <body className="bg-[#0E0602] text-white antialiased">
        <LanguageProvider>
            <ProgressProvider>
                {/* Nội dung các trang */}
                {children}

                {/* 🔥 ĐẶT CHATBOX Ở ĐÂY ĐỂ NÓ NỔI GÓC DƯỚI BÊN PHẢI MỌI TRANG */}
                <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 shadow-2xl">
                    <ChatBox />
                </div>

                <Toaster position="top-right" richColors />
            </ProgressProvider>
        </LanguageProvider>
        </body>
        </html>
    );
}