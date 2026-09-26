"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Compass, Gift, Home, Send, X } from "lucide-react";

const MAI_QUOTES = [
  "Chào bạn! Cần Mai dẫn đi thăm làng nghề nào không? ✨",
  "Đừng quên ghé Kho Báu đổi voucher ưu đãi nhé! 🎁",
  "Bạn đã thử trải nghiệm Bản Đồ 360° chưa? Rất đẹp đó ạ! 🗺️",
  "Hôm nay thời tiết ở Cố Đô thật đẹp, đi làm nghề thôi! 🏮",
];

export default function ChatBox() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [currentQuote, setCurrentQuote] = useState("");
  const [showQuote, setShowQuote] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Xin chào 👋 Tôi là Mai, hướng dẫn viên AI Huế. Bạn muốn tôi dẫn đi khám phá trang nào?",
    },
  ]);

  useEffect(() => {
    const triggerRandomBubble = () => {
      if (!isOpen) {
        const randomMsg = MAI_QUOTES[Math.floor(Math.random() * MAI_QUOTES.length)];
        setCurrentQuote(randomMsg);
        setShowQuote(true);

        setTimeout(() => {
          setShowQuote(false);
        }, 5000);
      }
    };

    const initialTimer = setTimeout(triggerRandomBubble, 3000);
    const interval = setInterval(triggerRandomBubble, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isOpen]);

  async function sendMessage(textToSend?: string) {
    const textQuery = textToSend || message;
    if (!textQuery.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: textQuery }]);
    if (!textToSend) setMessage("");
    setIsTyping(true);

    try {
      const currentPath = window.location.pathname;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textQuery,
          currentPath: currentPath,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer || "AI chưa có câu trả lời.",
        },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Xin lỗi, AI đang gặp lỗi kết nối.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="fixed bottom-0 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Khung chat bung ra khi bấm vào nhân vật */}
      {isOpen && (
        <div className="pointer-events-auto mb-2 w-80 sm:w-96 flex flex-col h-[450px] bg-[#120703]/95 backdrop-blur-xl border border-amber-500/40 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-900/50 to-stone-900 border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 overflow-hidden flex items-center justify-center">
                <img 
                  src="/guide/guide.png" 
                  alt="Mai AI Guide" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200">Mai - Hướng Dẫn Viên AI</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Trực tuyến
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Navigation Buttons */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-950/70 border-b border-white/5 overflow-x-auto text-[11px]">
            <span className="text-stone-400 text-[10px] shrink-0">Đến nhanh:</span>
            <button
              onClick={() => router.push('/home')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shrink-0 cursor-pointer"
            >
              <Home className="w-3 h-3" /> Trang Chủ
            </button>
            <button
              onClick={() => router.push('/map')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shrink-0 cursor-pointer"
            >
              <Compass className="w-3 h-3" /> Bản Đồ
            </button>
            <button
              onClick={() => router.push('/rewards')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shrink-0 cursor-pointer"
            >
              <Gift className="w-3 h-3" /> Phần Thưởng
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500 text-stone-950 font-medium rounded-br-none shadow-md"
                      : "bg-stone-900/90 text-stone-200 border border-amber-500/20 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-stone-900 px-3.5 py-2 rounded-2xl border border-amber-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Ô nhập tin nhắn */}
          <div className="p-3 bg-stone-950 border-t border-amber-500/20 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Hỏi Mai về làng nghề, voucher..."
              disabled={isTyping}
              className="flex-1 bg-stone-900 text-white placeholder-stone-500 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 transition-all"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isTyping}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* NHÂN VẬT KÈM HÀO QUANG VÀ BONG BÓNG LỜI THOẠI ĐÃ ĐƯỢC MỞ RỘNG */}
      <div 
        className="pointer-events-auto relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 flex items-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Hào quang phát sáng */}
        <div className="absolute bottom-4 right-6 w-24 h-24 bg-amber-400/30 rounded-full blur-xl animate-pulse pointer-events-none"></div>

        {/* BONG BÓNG LỜI THOẠI ĐÃ MỞ RỘNG NGANG (max-w-[260px]) ĐỂ CHỮ KHÔNG BỊ DỌC */}
        {showQuote && !isOpen && (
          <div className="absolute right-full mr-2 bottom-20 w-[260px] px-4 py-3 bg-stone-950/95 border border-amber-500/60 text-amber-100 text-xs font-medium rounded-2xl shadow-[0_5px_25px_rgba(245,158,11,0.3)] leading-relaxed whitespace-normal break-words animate-in fade-in slide-in-from-right-2 duration-300 pointer-events-none">
            {currentQuote}
            {/* Mũi tên nhỏ trỏ về phía nhân vật */}
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-stone-950 border-r border-t border-amber-500/60 rotate-45"></div>
          </div>
        )}

        {/* Hình ảnh nhân vật */}
        <img 
          src="/guide/guide.png" 
          alt="Mai AI Guide Mascot" 
          className="w-36 sm:w-44 h-auto object-contain select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
        />
      </div>
    </div>
  );
}