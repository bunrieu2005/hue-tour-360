'use client';

import { ITINERARY_STEPS } from "@/data/itinerary";
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useProgress } from "@/context/ProgressContext";
import { villages } from "@/data/villages";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hand, X, BookOpen, Palette, CheckCircle2, MessageCircle, Map,Volume2, VolumeX, CalendarDays, ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ExperienceTab from "./ExperienceTab";

type LangKey = "vi" | "en";

interface SceneConfig {
    bgStyle: React.CSSProperties;
    clothingColor: string;
    isFemale: boolean;
    greeting: Record<LangKey, string>;
    signGreeting: string;
    particles: string[];
    standingImageUrl?: string;
    audioUrl?: string;
    captions?: { time: number; text: string }[];
}

const SCENES: Record<string, SceneConfig> = {
    "sinh-painting": {
        bgStyle: { background: "linear-gradient(180deg, #120600 0%, #5A1500 45%, #B03008 80%, #D05010 100%)" },
        clothingColor: "#7A1800",
        isFemale: false,
        greeting: {
            vi: "Xin chào! Tôi là nghệ nhân Kỳ Hữu Phước — 72 tuổi, hơn 50 năm gắn bó với tranh dân gian Sình. Mỗi nét vẽ, mỗi màu sắc đều mang tâm hồn của người nghệ nhân. Tranh Sình không chỉ là hình vẽ mà còn là câu chuyện văn hóa ngàn năm của cha ông để lại.",
            en: "Hello! I am artisan Ky Huu Phuoc — 72 years old, devoted over 50 years to Sinh folk painting. Each stroke and colour carries the craftsman's soul. Sinh paintings are not mere images — they are thousand-year cultural stories from our ancestors.",
        },
        signGreeting: "👋 Xin chào!\n🎨 Nghệ nhân Kỳ Hữu Phước\n👴 72 tuổi • 50+ năm nghề\n🖌️ Tranh dân gian Sình\n📜 Di sản UNESCO 2021",
        standingImageUrl: "/tranhlangsinh-img/nghenhan-voice.png",
        audioUrl: "/voice/voiceLangsinhmp3.mp3",
        particles: ["🖌️", "📜", "✨", "🔴", "🖌️"],
        captions: [
            { time: 0, text: "Xin chào! Tôi là nghệ nhân Kỳ Hữu Phước, đã hơn năm mươi năm gắn bó với tranh làng Sình." },
            { time: 5, text: "Nghề này của cha ông để lại, có từ hàng trăm năm trước, gắn liền với vùng đất Lại Ân bên dòng sông Hương." },
            { time: 11, text: "Có những năm tháng khó khăn, nghề tranh tưởng chừng mai một." },
            { time: 15, text: "Nhưng tôi vẫn lặng lẽ giữ lấy từng bản khắc gỗ, như giữ lấy hồn cốt của tổ tiên." },
            { time: 21, text: "Mỗi nét vẽ, mỗi gam màu đều được làm thủ công, từ giấy dó đến màu tự nhiên." },
            { time: 27, text: "Ngày nay, khách phương xa tìm về ngày một nhiều." },
            { time: 31, text: "Tranh làng Sình lại có dịp sống dậy, mang theo câu chuyện văn hóa của một vùng đất cố đô." },
        ],
    },
    
};


const ArtisanSVG = ({ villageId, clothingColor }: { villageId: string; clothingColor: string }) => {
    const skin = "#E8C09A";
    const hair = "#0D0400";
    const hat = "#D4B460";

    return (
        <svg viewBox="0 0 200 285" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
            <ellipse cx="100" cy="282" rx="64" ry="10" fill="rgba(0,0,0,0.4)" />
            <path d="M40 226 Q22 265 68 274 L100 266 L132 274 Q178 265 160 226 Z" fill={clothingColor} />
            <ellipse cx="60" cy="275" rx="26" ry="10" fill="#160900" />
            <ellipse cx="140" cy="275" rx="26" ry="10" fill="#160900" />
            <path d="M46 150 L154 150 L168 234 L32 234 Z" fill={clothingColor} />
            <path d="M85 150 L100 175 L115 150" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" />
            <line x1="100" y1="175" x2="100" y2="234" stroke="rgba(255,255,255,0.13)" strokeWidth="2" />
            <path d="M50 166 Q25 200 22 237" stroke={clothingColor} strokeWidth="30" fill="none" strokeLinecap="round" />
            <ellipse cx="20" cy="240" rx="16" ry="13" fill={skin} />
            <path d="M150 166 Q175 200 178 237" stroke={clothingColor} strokeWidth="30" fill="none" strokeLinecap="round" />
            <ellipse cx="180" cy="240" rx="16" ry="13" fill={skin} />
            <rect x="85" y="135" width="30" height="22" rx="9" fill={skin} />
            <ellipse cx="100" cy="106" rx="38" ry="38" fill={hair} />
            <ellipse cx="100" cy="104" rx="32" ry="33" fill={skin} />
            <path d="M100 0 L4 88 L196 88 Z" fill={hat} />
            <ellipse cx="100" cy="88" rx="96" ry="16" fill="#B89A40" />
        </svg>
    );
};

const SceneBg = ({ villageId }: { villageId: string }) => {
    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-stone-900 to-stone-950" />
    );
};

const FloatingParticle = ({ emoji, index }: { emoji: string; index: number }) => {
    const left = 8 + (index * 71 + 13) % 84;
    const delay = (index * 0.7) % 3;
    const dur = 3 + (index % 3);
    return (
        <motion.div className="absolute text-xl pointer-events-none select-none"
                    style={{ left: `${left}%`, bottom: "15%" }}
                    animate={{ y: [0, -60 - index * 10, 0], opacity: [0.6, 1, 0], x: [0, (index % 2 === 0 ? 12 : -12), 0] }}
                    transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}>
            {emoji}
        </motion.div>
    );
};

export default function VillageTour() {
    const params = useParams<{ villageId?: string }>() ?? {};
    const villageId = Array.isArray(params.villageId) ? params.villageId[0] : params.villageId ?? "";
    const router = useRouter();
    const { language, setLanguage } = useLanguage();
    const { completedVillages, markVillageComplete,} = useProgress(); // Đã gỡ completeActivity vì ExperienceTab lo

    const [showBubble, setShowBubble] = useState(false);
    const [artisanTapped, setArtisanTapped] = useState(false);
const [activeTab, setActiveTab] = useState<"story" | "experience" | "itinerary">("story");
    const [currentStep, setCurrentStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentCaptionText, setCurrentCaptionText] = useState("");
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isItineraryOpen, setIsItineraryOpen] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);

    const village = villages.find((v) => v.id === villageId);
    const scene = SCENES[villageId] ?? SCENES["sinh-painting"];
    const lang: LangKey = language === "sign" ? "vi" : (language as LangKey);
    const isSign = language === "sign";
    const canUseRealAudio = Boolean(scene.audioUrl) && lang === "vi" && !isSign;
    const { addBooking } = useProgress(); // Kéo hàm addBooking từ Context ra
    const [bookingDate, setBookingDate] = useState(""); // State lưu ngày đặt

    const handleConfirmBooking = () => {
        const vName = village?.name?.vi || "Làng nghề Cố Đô";
        const dateStr = bookingDate || new Date().toLocaleDateString('vi-VN'); // Nếu không chọn ngày thì lấy ngày hôm nay
        
        addBooking(villageId, vName, dateStr); // Lưu vé vào kho!
        setBookingConfirmed(true); // Chuyển sang màn hình "Thành công"
    };

    if (!village) {
        return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">Village not found</p></div>;
    }

   const isActivityDone = (completedVillages || []).includes(villageId);

    const handleArtisanClick = () => {
        if (canUseRealAudio) {
            handleSpeak();
            setArtisanTapped(true);
            return;
        }
        setShowBubble((p) => !p);
        if (!artisanTapped) setArtisanTapped(true);
    };

    const openBookingModal = () => {
        setBookingConfirmed(false);
        setIsBookingOpen(true);
    };

    const handleSignToggle = () => {
        if (isSpeaking) {
            if (canUseRealAudio) {
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
            } else {
                window.speechSynthesis?.cancel();
            }
            setIsSpeaking(false);
            setCurrentCaptionText("");
        }
        setLanguage(isSign ? "vi" : "sign");
        setShowBubble(false);
    };

    const handleSpeak = () => {
        if (canUseRealAudio) {
            const audio = audioRef.current;
            if (!audio) return;
            if (isSpeaking) {
                audio.pause();
                audio.currentTime = 0;
                setIsSpeaking(false);
                setCurrentCaptionText("");
                return;
            }
            audio.currentTime = 0;
            audio.play();
            setIsSpeaking(true);
            return;
        }

        if (!window.speechSynthesis) return;
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const text = isSign ? scene.signGreeting.replace(/\n/g, ". ") : scene.greeting[lang];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "en" ? "en-US" : "vi-VN";
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const t = {
        vi: { back: "Quay lại", story: "Câu chuyện", experience: "Trải nghiệm", workshop: "Đặt lịch trải nghiệm", workshopHint: "Chọn ngày, giờ và nghệ nhân để hẹn làm workshop", tap: "Chạm vào nghệ nhân để lắng nghe", signBtn: "Ký hiệu", quiz: "Làm bài kiểm tra", done: "Hoạt động hoàn thành!", quizHint: "Bạn đã sẵn sàng làm bài kiểm tra để nhận phần thưởng", artisan: "Nghệ nhân", speak: "Nghe", stop: "Dừng", confirmBooking: "Xác nhận lịch hẹn", cancelBooking: "Hủy", guestCount: "Số khách", note: "Ghi chú", selectedArtisans: "Chọn nghệ nhân", date: "Ngày", time: "Giờ", bookingSuccess: "Đã gửi yêu cầu đặt lịch", bookingSuccessHint: "Chúng tôi sẽ liên hệ để xác nhận workshop với các nghệ nhân bạn đã chọn.", singleArtisanNote: "Làng này hiện chỉ có 1 nghệ nhân trong dữ liệu mẫu." },
        en: { back: "Back", story: "Story", experience: "Experience", workshop: "Book workshop", workshopHint: "Choose a date, time, and artisan(s) for a craft workshop", tap: "Tap the artisan to listen", signBtn: "Sign", quiz: "Take Quiz", done: "Activity complete!", quizHint: "You are ready to take the quiz for your reward", artisan: "Master Artisan", speak: "Listen", stop: "Stop", confirmBooking: "Confirm booking", cancelBooking: "Cancel", guestCount: "Guests", note: "Note", selectedArtisans: "Select artisan(s)", date: "Date", time: "Time", bookingSuccess: "Booking request sent", bookingSuccessHint: "We will contact you to confirm the workshop with the artisan(s) you selected.", singleArtisanNote: "This village currently has only one artisan." },
        sign: { back: "⬅️", story: "📖 Câu chuyện", experience: "🎨 Trải nghiệm", workshop: "📅 Đặt lịch", workshopHint: "🗓️ Chọn ngày giờ và nghệ nhân", tap: "👆 Chạm nghệ nhân", signBtn: "🤟 ON", quiz: "📝 Kiểm tra", done: "✅ Xong!", quizHint: "📝 Làm bài kiểm tra", artisan: "👤 Nghệ nhân", speak: "🔊 Nghe", stop: "⏹ Dừng", confirmBooking: "✅ Xác nhận", cancelBooking: "Hủy", guestCount: "👥 Khách", note: "📝 Ghi chú", selectedArtisans: "👤 Nghệ nhân", date: "📅 Ngày", time: "⏰ Giờ", bookingSuccess: "✅ Đã gửi yêu cầu", bookingSuccessHint: "Chúng tôi sẽ liên hệ xác nhận workshop.", singleArtisanNote: "📌 Dữ liệu mẫu mới có 1 nghệ nhân." },
    };

    // Ép kiểu language đảm bảo lấy đúng từ khóa
    const currentLang = (language === "vi" || language === "en" || language === "sign") ? language : "vi";
    const copy = t[currentLang];

    return (
        <div className="min-h-screen" style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "var(--background)" }}>
            {scene.audioUrl && (
                <audio
                    ref={audioRef}
                    src={scene.audioUrl}
                    preload="none"
                    onEnded={() => { setIsSpeaking(false); setCurrentCaptionText(""); }}
                    onTimeUpdate={(e) => {
                        const time = e.currentTarget.currentTime;
                        const captions = scene.captions || [];
                        let text = "";
                        for (const c of captions) {
                            if (time >= c.time) text = c.text;
                        }
                        setCurrentCaptionText(text);
                    }}
                />
            )}

            <header className="relative py-5 px-4 shadow-lg" style={{ background: "linear-gradient(135deg, #1A0800 0%, #5A1A00 60%, #8B3010 100%)" }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 gap-2" onClick={() => router.push("/home")}>
                        <ArrowLeft className="w-5 h-5" />
                        {copy.back}
                    </Button>
                    <div className="text-center">
                        <h1 className="text-xl md:text-2xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {village.name[lang]}
                        </h1>
                        <p className="text-amber-300/60 text-xs mt-0.5">{village.artisan.name} • {village.artisan.age} tuổi</p>
                    </div>
                    <button onClick={handleSignToggle}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${isSign ? "bg-green-500 text-white border-green-400" : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"}`}>
                        <Hand className="w-4 h-4" />
                        <span className="hidden sm:inline">{isSign ? "🤟 ON" : copy.signBtn}</span>
                    </button>
                </div>
            </header>

            <div className="relative w-full overflow-hidden" style={{ height: "540px", ...scene.bgStyle }}>
                <SceneBg villageId={villageId} />
                {isSign && (
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 bg-green-900/60 backdrop-blur-sm z-20">
                        <span className="text-green-200 text-sm font-medium">🤟 Ngôn ngữ ký hiệu đang bật</span>
                    </div>
                )}
                <div className="absolute inset-0 pointer-events-none z-10">
                    {scene.particles.map((e, i) => <FloatingParticle key={i} emoji={e} index={i} />)}
                </div>

                {/* Panel phụ đề bên trái */}
                {canUseRealAudio && isSpeaking && currentCaptionText && (
                    <div className="absolute inset-y-0 right-0 z-20 flex items-center pointer-events-none" style={{ width: "50%", paddingLeft: "6%" }}>
                        <motion.p
                            key={currentCaptionText}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="px-6 md:px-10 text-white text-lg md:text-2xl leading-relaxed"
                            style={{ fontFamily: "'Lora', serif", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
                        >
                            {currentCaptionText}
                        </motion.p>
                    </div>
                )}

                {/* Nhân vật */}
                <div className="absolute bottom-0 z-20" style={{ width: "460px", maxWidth: "94%", height: "520px", left: "42%", transform: "translateX(-50%)" }}>
                    {!canUseRealAudio && showBubble && (
                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.25 }}
                                    className={`absolute bottom-full mb-4 left-0 rounded-2xl shadow-2xl z-30 ${isSign ? "bg-gray-950 text-white border-2 border-green-500" : "bg-white text-gray-900"}`}
                                    style={{ minWidth: "270px", maxWidth: "310px" }}>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: scene.clothingColor }}>
                                        {village.artisan.name.split(" ").pop()?.[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold leading-tight">{village.artisan.name}</p>
                                        <p className="text-xs opacity-60">{copy.artisan} • {village.artisan.age} tuổi</p>
                                    </div>
                                    <button onClick={handleSpeak}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSpeaking ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700 hover:bg-amber-200"}`}>
                                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setShowBubble(false); if (isSpeaking) { window.speechSynthesis?.cancel(); setIsSpeaking(false); } }}
                                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                        <X className="w-3.5 h-3.5 text-gray-600" />
                                    </button>
                                </div>
                                {isSign ? (
                                    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-green-300">{scene.signGreeting}</pre>
                                ) : (
                                    <p className="text-sm leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{scene.greeting[lang]}</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    <motion.div onClick={handleArtisanClick} className="cursor-pointer w-full h-full"
                                animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                        {scene.standingImageUrl ? (
                            <img
                                src={scene.standingImageUrl}
                                alt={village.artisan.name}
                                className="w-full h-full object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                            />
                        ) : (
                            <ArtisanSVG villageId={villageId} clothingColor={scene.clothingColor} />
                        )}
                    </motion.div>
                </div>

                {!artisanTapped && (
                    <motion.div className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none"
                                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.8, repeat: Infinity }}>
                        <div className="flex items-center gap-2 bg-black/50 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                            <MessageCircle className="w-4 h-4 text-amber-400" />
                            {copy.tap}
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-stretch">
                    <div className="flex flex-1 gap-1 bg-black/5 p-1 rounded-xl">
                        {(["story", "experience"] as const).map((tab) => {
                            const icons = { story: BookOpen, experience: Palette };
                            const labels = { story: copy.story, experience: "Trải nghiệm" };
                            const Icon = icons[tab];
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab ? "bg-white shadow text-amber-900" : "text-gray-500 hover:text-gray-800"}`}>
                                    <Icon className="w-4 h-4" />
                                    <span>{labels[tab]}</span>
                                    {tab === "experience" && isActivityDone && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                                </button>
                            );
                        })}
                    </div>
             <div className="flex gap-3">
                        <button onClick={() => setIsItineraryOpen(true)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-green-600 bg-green-50 px-5 py-3 text-sm font-bold text-green-700 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-green-100">
                            <Map className="w-4 h-4" />
                            <span>Xem Lộ Trình</span>
                        </button>
                        <button onClick={openBookingModal}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-900/15 bg-white px-5 py-3 text-sm font-semibold text-amber-900 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <CalendarDays className="w-4 h-4" />
                            <span>{copy.workshop}</span>
                        </button>
                    </div>
                </div>

                {activeTab === "story" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
                        <div className="rounded-2xl overflow-hidden mb-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <div className="px-6 py-5 flex items-center gap-4" style={{ background: `${scene.clothingColor}18` }}>
                                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                                     style={{ background: `linear-gradient(135deg, ${scene.clothingColor}, ${scene.clothingColor}99)` }}>
                                    {village.artisan.name.split(" ").pop()?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>{village.artisan.name}</p>
                                    <p className="text-sm text-stone-600">{lang === "vi" ? `Nghệ nhân ưu tú • ${village.artisan.age} tuổi` : `Master Artisan • Age ${village.artisan.age}`}</p>
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-base leading-relaxed italic border-l-4 pl-4" style={{ fontFamily: "'Lora', serif", borderColor: scene.clothingColor }}>
                                    "{village.artisan.story[lang]}"
                                </p>
                            </div>
                        </div>
                        <div className="rounded-2xl p-6 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {lang === "vi" ? "Lịch sử làng nghề" : "Village History"}
                            </h3>
                            <p className="text-base leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Lora', serif" }}>{village.history[lang]}</p>
                        </div>
                    </motion.div>
                )}

                {activeTab === "experience" && (
                    <ExperienceTab
                        village={village}
                        villageId={villageId}
                        lang={lang}
                        copy={copy}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        isActivityDone={isActivityDone}
                        sceneColor={scene.clothingColor}
                    />
                )}
                {activeTab === "itinerary" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} 
                                className="w-full bg-[#FDFBF7] rounded-3xl p-6 md:p-8 shadow-sm border border-amber-900/10 relative overflow-hidden mt-6">
                        
                        <div className="text-center mb-10 relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-green-800 inline-block px-8 py-2 rounded-full bg-green-100 border-2 border-green-700" 
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                LỘ TRÌNH CHI TIẾT
                            </h3>
                            <p className="mt-3 text-amber-900 font-medium">🕒 7h30 - 11h30 | Hành trình 4 tiếng trải nghiệm</p>
                        </div>

                        {/* Khung Scroll ngang cho Timeline */}
                        <div className="relative w-full overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                            <div className="absolute top-[28px] left-8 right-8 h-1 bg-amber-900/20 rounded-full hidden md:block"></div>
                            
                            <div className="flex gap-4 min-w-max px-4">
                                {ITINERARY_STEPS.map((step, idx) => (
                                    <div key={idx} className="w-[280px] snap-center shrink-0 relative flex flex-col pt-12 md:pt-0">
                                        
                                        <div className="hidden md:flex absolute top-[12px] left-1/2 -translate-x-1/2 z-10 items-center justify-center w-8 h-8 rounded-full border-4 border-[#FDFBF7]"
                                             style={{ backgroundColor: step.headerColor.replace('bg-', '') }}>
                                        </div>

                                        <div className={`mt-4 rounded-2xl overflow-hidden border border-black/5 shadow-sm h-full flex flex-col bg-white transition-transform hover:-translate-y-1`}>
                                            <div className={`${step.headerColor} p-3 flex items-center justify-center gap-2 relative`}>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center bg-[inherit]">
                                                    {step.icon}
                                                </div>
                                                <span className="text-white font-bold text-lg mt-3">{step.time}</span>
                                            </div>
                                            
                                            <div className={`${step.color} p-5 flex-1 flex flex-col gap-2 rounded-b-2xl`}>
                                                <h4 className={`text-lg font-bold text-center ${step.textColor}`}>{step.title}</h4>
                                                <div className="w-8 h-0.5 bg-black/10 mx-auto rounded-full my-1"></div>
                                                <p className={`text-sm leading-relaxed text-justify ${step.textColor}/80 mt-1`}>
                                                    • {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
{isItineraryOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm overflow-y-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                                className="w-full max-w-[1400px] my-auto bg-[#FDFBF7] rounded-3xl p-6 md:p-10 shadow-2xl relative">
                        
                        <button onClick={() => setIsItineraryOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 rounded-full bg-black/5 p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors z-20">
                            <X className="h-6 w-6" />
                        </button>

                        <div className="text-center mb-8 relative z-10">
                            <h3 className="text-3xl md:text-4xl font-bold text-green-800 inline-block px-10 py-3 rounded-full bg-green-100 border-2 border-green-700" 
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                LỘ TRÌNH CHI TIẾT
                            </h3>
                            <p className="mt-4 text-amber-900/80 font-bold text-lg">🕒 7h30 - 11h30 | Hành trình 4 tiếng trải nghiệm</p>
                        </div>

                        {/* Layout Dàn đều 5 cột ngang - KHÔNG SCROLL */}
                        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 mt-12">
                            {/* Đường chỉ đỏ/nâu chạy ngang phía sau (Chỉ hiện trên PC) */}
                            <div className="hidden lg:block absolute top-[16px] left-[10%] right-[10%] h-[3px] bg-amber-900/15 rounded-full z-0"></div>
                            
                            {ITINERARY_STEPS.map((step, idx) => (
                                <div key={idx} className="relative flex flex-col pt-10 lg:pt-0 group">
                                    {/* Cục mốc thời gian */}
                                    <div className="hidden lg:flex absolute top-[0px] left-1/2 -translate-x-1/2 z-10 items-center justify-center w-9 h-9 rounded-full border-4 border-[#FDFBF7] group-hover:scale-125 transition-transform"
                                         style={{ backgroundColor: step.headerColor.replace('bg-', '') }}>
                                    </div>

                               {/* Thẻ Card */}
                                    <div className={`mt-5 rounded-2xl border border-black/5 shadow-md h-full flex flex-col bg-white transition-all hover:-translate-y-2 hover:shadow-xl`}>
                                        <div className={`${step.headerColor} p-4 flex flex-col items-center justify-center gap-1 relative rounded-t-2xl`}>
                                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-[5px] border-white flex items-center justify-center bg-[inherit] shadow-sm">
                                                {step.icon}
                                            </div>
                                            <span className="text-white font-black text-xl mt-4">{step.time}</span>
                                        </div>
                                        
                                        <div className={`${step.color} p-6 flex-1 flex flex-col gap-3 rounded-b-2xl`}>
                                            <h4 className={`text-xl font-bold text-center ${step.textColor}`}>{step.title}</h4>
                                            <div className="w-12 h-1 bg-black/10 mx-auto rounded-full"></div>
                                            <p className={`text-base leading-relaxed text-justify ${step.textColor}/90 mt-2 font-medium`}>
                                                • {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
       ))}
                        </div>

                        {/* Nút Đặt lịch CTA (Call to Action) */}
                        <div className="mt-12 mb-2 flex justify-center relative z-10">
                            <button onClick={() => { setIsItineraryOpen(false); openBookingModal(); }} 
                                    className="px-10 py-4 rounded-full text-lg font-bold text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3"
                                    style={{ background: "linear-gradient(135deg, #c2410c, #9a3412)" }}>
                                <CalendarDays className="w-6 h-6" />
                                Liên hệ đặt lịch
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
            {isBookingOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.2 }}
                                className="w-full max-w-3xl my-auto overflow-hidden rounded-2xl bg-[#FBF8F1] shadow-2xl border border-amber-900/10 relative">

                        {/* HEADER - Phong cách mộc mạc */}
                        <div className="flex items-start justify-between gap-4 border-b border-amber-900/10 bg-[#F4EBE1] px-8 py-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-amber-950" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Liên hệ đặt lịch trải nghiệm
                                </h3>
                                <p className="mt-1 text-sm text-amber-800">
                                    Điền thông tin để nghệ nhân chuẩn bị không gian và nguyên liệu tốt nhất cho bạn.
                                </p>
                            </div>
                            <button onClick={() => setIsBookingOpen(false)} className="relative z-10 rounded-full bg-white/50 p-2 text-amber-900 transition-colors hover:bg-white hover:text-red-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* BODY FORM - Chia 2 cột giống hình ảnh thiết kế */}
                        <div className="p-8">
                            {!bookingConfirmed ? (
                                <div className="space-y-6">

                                    {/* Hàng 1: Họ tên + Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-amber-950">Họ và tên <span className="text-red-500">*</span></label>
                                            <input type="text" placeholder="Nguyễn Văn A"
                                                   className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all text-amber-950 placeholder:text-amber-900/40 shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-amber-950">Email <span className="text-red-500">*</span></label>
                                            <input type="email" placeholder="email@domain.com"
                                                   className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all text-amber-950 placeholder:text-amber-900/40 shadow-sm" />
                                        </div>
                                    </div>

                                    {/* Hàng 2: SĐT + Tổ chức/Số lượng */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-amber-950">Số điện thoại</label>
                                            <input type="tel" placeholder="+84 xxx xxx xxx"
                                                   className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all text-amber-950 placeholder:text-amber-900/40 shadow-sm" />
                                        </div>
                                <div className="space-y-2">
                                            <label className="text-sm font-bold text-amber-950">Ngày dự kiến đến <span className="text-red-500">*</span></label>
                                            <input type="date" 
                                                   value={bookingDate}
                                                   onChange={(e) => setBookingDate(e.target.value)}
                                                   className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all text-amber-950 shadow-sm" />
                                        </div>
                                    </div>

                                    {/* Hàng 3: Dropdown Làng nghề */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-amber-950">Địa điểm quan tâm</label>
                                        <div className="relative">
                                            {/* Tự động lấy tên làng hiện tại làm mặc định, nếu không có thì lấy Làng Tranh Sình */}
                                            <select defaultValue={village?.name?.vi || "Làng Tranh Sình"}
                                                    className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all text-amber-950 appearance-none cursor-pointer shadow-sm">
                                                <option value="Làng Tranh Sình">Làng Tranh Sình</option>
                                                <option value="Hoa Giấy Thanh Tiên">Hoa Giấy Thanh Tiên</option>
                                                <option value="Làng Hương Thủy Xuân">Làng Hương Thủy Xuân</option>
                                                <option value="Làng Nón Lá Huế">Làng Nón Lá Huế</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-900/50 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Hàng 4: Textarea Ghi chú */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-amber-950">Ghi chú thêm</label>
                                        <textarea rows={4} placeholder="Chia sẻ thêm về nhu cầu của bạn (ngày giờ dự kiến đến, yêu cầu đặc biệt)..."
                                                  className="w-full px-4 py-3 rounded-xl border border-amber-900/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 transition-all text-amber-950 placeholder:text-amber-900/40 resize-none shadow-sm"></textarea>
                                    </div>

                                    {/* Nút bấm Gửi */}
                    <div className="pt-4">
                                        <Button onClick={handleConfirmBooking}
                                                className="w-fit px-8 py-6 rounded-full text-base font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-3"
                                                style={{ background: "linear-gradient(135deg, #c2410c, #9a3412)" }}>
                                            Gửi yêu cầu đặt lịch <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                /* Giao diện sau khi gửi thành công */
                                <div className="py-12 flex flex-col items-center text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </motion.div>
                                    <h4 className="text-2xl font-bold text-amber-950 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        Đã gửi yêu cầu thành công!
                                    </h4>
                                    <p className="text-amber-800 max-w-md leading-relaxed">
                                        Cảm ơn bạn đã quan tâm. Thông tin của bạn đã được chuyển đến nghệ nhân. Chúng tôi sẽ sớm liên hệ qua Số điện thoại / Email để xác nhận lịch hẹn chi tiết.
                                    </p>
                                    <Button onClick={() => setIsBookingOpen(false)} className="mt-8 px-8 py-6 rounded-full border border-amber-900/20 bg-white text-amber-950 hover:bg-amber-50 hover:text-amber-900 font-semibold shadow-sm transition-colors">
                                        Đóng cửa sổ
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}