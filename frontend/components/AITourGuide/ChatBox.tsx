"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Compass, Gift, Home, Send, X } from "lucide-react";

const MAI_QUOTES = [
  "Chào bạn! Cần Mai dẫn đi thăm làng nghề nào không? ✨",
  "Đừng quên ghé Kho Báu đổi voucher ưu đãi nhé! 🎁",
  "Bạn đã thử trải nghiệm Bản Đồ 360° chưa? Rất đẹp đó ạ! 🗺️",
  "Hôm nay thời tiết ở Cố Đô thật đẹp, đi làm nghề thôi! 🏮",
];

// BỘ DỮ LIỆU GIẢ (MOCK DATA) CHO BUỔI THUYẾT TRÌNH
const MOCK_ANSWERS = [
  {
    keywords: ["tranh sình", "làng sình", "ở đâu"],
    answer: "Dạ, Làng tranh Sình (hay còn gọi là làng Lại Ân) nằm hiền hòa bên hạ lưu sông Hương, thuộc xã Phú Mậu, huyện Phú Vang, tỉnh Thừa Thiên Huế. Nơi đây cách trung tâm thành phố khoảng 9km về phía Đông. Ngôi làng có bề dày lịch sử hơn 400 năm, từng là trung tâm cung cấp tranh thờ cúng và trang trí cho Hoàng cung. Bạn có thể nhấn vào mục 'Bản Đồ 360°' trên thanh menu để dạo quanh làng nhé! ✨"
  },
  {
    keywords: ["lịch sử", "bao lâu", "nguồn gốc", "có từ bao giờ", "giới thiệu về làng tranh sình"],
    answer: "Làng tranh Sình tự hào sở hữu bề dày lịch sử hơn 400 năm, gắn liền với quá trình mở cõi về phương Nam của chúa Nguyễn. Điểm đáng tự hào và vang dội nhất là vào tháng 12 năm 2021, nghệ thuật làm tranh dân gian Sình đã chính thức được UNESCO ghi danh vào danh sách Di sản văn hóa phi vật thể đại diện của nhân loại. Đây là minh chứng cho sức sống mãnh liệt của một di sản xứ Huế! 🏆"
  },
  {
    keywords: ["màu", "chất liệu", "làm bằng gì", "in tranh", "tô màu"],
    answer: "Quy trình làm tranh Sình mang đậm dấu ấn thủ công truyền thống! Tranh Sình chỉ dùng một bản khắc gỗ để in nét viền đen bằng mực bồ hóng lên giấy dó. Sau khi bản in khô, nghệ nhân sẽ tự tay bôi từng mảng màu bằng cọ. Điều đặc biệt nhất là 100% màu sắc đều chiết xuất từ thiên nhiên: màu đỏ rực từ gạch son, màu vàng tươi từ củ nghệ, màu xanh từ lá cây rừng. 🎨"
  },
  {
    keywords: ["nghệ nhân", "ai làm", "người làm", "kỳ hữu phước"],
    answer: "Nhắc đến Làng Sình, Mai phải giới thiệu ngay Nghệ nhân ưu tú Kỳ Hữu Phước. Dù đã bước sang tuổi 72, ông vẫn miệt mài với hơn 50 năm tuổi nghề và là người hiếm hoi còn nắm giữ trọn vẹn bí quyết pha chế màu tự nhiên từ lá, hoa và khoáng vật cổ truyền. Ông luôn tâm niệm rằng: 'Mỗi nét vẽ, mỗi màu sắc đều mang trong mình tâm hồn của người thợ'. 👨‍🎨"
  },
  {
    keywords: ["nón", "nón lá", "bài thơ"],
    answer: "Nón bài thơ - biểu tượng lãng mạn vô giá của xứ Huế mộng mơ! 🌸 Điểm tinh tế nhất của chiếc nón này là những vần thơ và hình ảnh danh thắng được nghệ nhân khéo léo chèn giữa hai lớp lá cọ non mỏng manh. Khi bạn soi nón dưới ánh mặt trời, những câu thơ sẽ kỳ diệu hiện ra."
  },
  {
    keywords: ["voucher", "khuyến mãi", "phần thưởng", "xu"],
    answer: "Hệ thống 'Kho Báu' của Tour Huế 360° đang ngập tràn ưu đãi chờ bạn khám phá đó ạ! 🎁 Mỗi khi bạn hoàn thành việc tìm hiểu một làng nghề hoặc chơi mini-game tương tác, bạn sẽ tích lũy được Xu. Số Xu này có thể dùng để đổi lấy các phần thưởng giá trị thực như: Mã giảm giá 20% Homestay, giảm 15% đồ thủ công, hoặc voucher Cafe Cổ Đô."
  },
  {
    keywords: ["chào", "hello", "hi", "mai"],
    answer: "Dạ Mai chào bạn! Mai là hướng dẫn viên AI độc quyền của Tour Huế 360 độ. Mai được lập trình để hiểu biết tường tận về lịch sử, văn hóa của 8 làng nghề truyền thống cũng như cách đổi voucher du lịch thực tế. Bạn cứ nhắn Mai nhé! 👋"
  }
];

export default function ChatBox() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [showQuote, setShowQuote] = useState(false);

  const [messages, setMessages] = useState([{ role: "ai", text: "Xin chào 👋 Tôi là Mai, hướng dẫn viên AI Huế. Bạn muốn tôi dẫn đi khám phá trang nào?" }]);

  useEffect(() => {
    const triggerRandomBubble = () => {
      if (!isOpen) {
        setCurrentQuote(MAI_QUOTES[Math.floor(Math.random() * MAI_QUOTES.length)]);
        setShowQuote(true);
        setTimeout(() => { setShowQuote(false); }, 5000);
      }
    };
    const initialTimer = setTimeout(triggerRandomBubble, 3000);
    const interval = setInterval(triggerRandomBubble, 15000);
    return () => { clearTimeout(initialTimer); clearInterval(interval); };
  }, [isOpen]);

  async function sendMessage(textToSend?: string) {
    const textQuery = textToSend || message;
    if (!textQuery.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: textQuery }]);
    if (!textToSend) setMessage("");
    setIsTyping(true);

    try {
      // GIẢ LẬP ĐỘ TRỄ 9 ĐẾN 10.5 GIÂY ĐỂ BẠN CÓ THỜI GIAN THUYẾT TRÌNH TRÊN SÂN KHẤU
      const delay = Math.floor(Math.random() * 1500) + 9000;
      await new Promise(resolve => setTimeout(resolve, delay));

      const lowerQuery = textQuery.toLowerCase();
      let matchedAnswer = "Dạ, câu hỏi này rất thú vị ,đang đợi hệ thống trả lời, thử lại sau ít phút";

      for (const mock of MOCK_ANSWERS) {
        if (mock.keywords.some(kw => lowerQuery.includes(kw))) { matchedAnswer = mock.answer; break; }
      }
      
      setMessages((prev) => [...prev, { role: "ai", text: matchedAnswer }]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="fixed bottom-0 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div role="dialog" aria-label="Khung trò chuyện với hướng dẫn viên ảo Mai" className="pointer-events-auto mb-2 w-80 sm:w-96 flex flex-col h-[450px] bg-[#120703]/95 backdrop-blur-xl border border-amber-500/40 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-900/50 to-stone-900 border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400 overflow-hidden flex items-center justify-center">
                <img src="/guide/guide.png" alt="" aria-hidden="true" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-200">Mai - Hướng Dẫn Viên AI</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1"><span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Trực tuyến</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Đóng khung trò chuyện" className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-stone-950/70 border-b border-white/5 overflow-x-auto text-[11px]">
            <span className="text-stone-400 text-[10px] shrink-0">Đến nhanh:</span>
            <button onClick={() => router.push('/home')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shrink-0 cursor-pointer"><Home className="w-3 h-3" /> Trang Chủ</button>
            <button onClick={() => router.push('/map')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shrink-0 cursor-pointer"><Compass className="w-3 h-3" /> Bản Đồ</button>
            <button onClick={() => router.push('/rewards')} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all shrink-0 cursor-pointer"><Gift className="w-3 h-3" /> Phần Thưởng</button>
          </div>

          <div aria-live="polite" className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === "user" ? "bg-amber-500 text-stone-950 font-medium rounded-br-none shadow-md" : "bg-stone-900/90 text-stone-200 border border-amber-500/20 rounded-bl-none shadow-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div aria-label="Mai đang suy nghĩ và soạn tin nhắn" className="bg-stone-900 px-3.5 py-2 rounded-2xl border border-amber-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-stone-950 border-t border-amber-500/20 flex items-center gap-2">
            <label htmlFor="chat-input-mai" className="sr-only">Nhắn tin cho Mai</label>
            <input id="chat-input-mai" type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} placeholder="Hỏi Mai về làng nghề, voucher..." disabled={isTyping} className="flex-1 bg-stone-900 text-white placeholder-stone-500 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 transition-all disabled:opacity-50" />
            <button onClick={() => sendMessage()} disabled={isTyping} aria-label="Gửi tin nhắn" className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <button className="pointer-events-auto relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 flex items-end bg-transparent border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-full" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label={isOpen ? "Đóng khung chat với Mai" : "Mở khung chat với Mai, trợ lý ảo"}>
        <div aria-hidden="true" className="absolute bottom-4 right-6 w-24 h-24 bg-amber-400/30 rounded-full blur-xl animate-pulse pointer-events-none"></div>
        {showQuote && !isOpen && (
          <div aria-hidden="true" className="absolute right-full mr-2 bottom-20 w-[260px] px-4 py-3 bg-stone-950/95 border border-amber-500/60 text-amber-100 text-xs font-medium rounded-2xl shadow-[0_5px_25px_rgba(245,158,11,0.3)] leading-relaxed whitespace-normal break-words animate-in fade-in slide-in-from-right-2 duration-300 pointer-events-none">
            {currentQuote}
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-stone-950 border-r border-t border-amber-500/60 rotate-45"></div>
          </div>
        )}
        <img src="/guide/guide.png" alt="Ảnh đại diện Mai AI Guide" className="w-36 sm:w-44 h-auto object-contain select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]" />
      </button>
    </div>
  );
}