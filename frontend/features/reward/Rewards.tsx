'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { rewards, Reward } from '@/data/villages';
import Navbar from '@/components/Navbar';
import TicketCard from '@/components/TicketCard/TicketCard';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
    Gift, Lock, Unlock, Hotel, ShoppingBag, Coffee, MapPin, Utensils,
    Sparkles, Copy, CheckCircle2, ChevronRight, Compass, PartyPopper,
    Tag, ShieldCheck, Calendar, Ticket, Coins
} from 'lucide-react';

const REWARD_ICONS: Record<string, React.ElementType> = {
    homestay: Hotel, souvenir: ShoppingBag, cafe: Coffee, tour: Compass, restaurant: Utensils, spa: Sparkles,
};

const REWARD_COLORS: Record<string, { from: string; to: string; badge: string; border: string }> = {
    homestay: { from: '#8B1A00', to: '#C05010', badge: 'bg-red-500/20 text-red-300 border-red-500/40', border: '#C05010' },
    souvenir: { from: '#14532D', to: '#16A34A', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', border: '#16A34A' },
    cafe: { from: '#78350F', to: '#D97706', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', border: '#D97706' },
    tour: { from: '#1E3A8A', to: '#2563EB', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40', border: '#2563EB' },
    restaurant: { from: '#581C87', to: '#9333EA', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40', border: '#9333EA' },
    spa: { from: '#0F766E', to: '#14B8A6', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40', border: '#14B8A6' },
};

// BẢNG GIÁ XU MỚI (Thay thế cho số làng hoàn thành)
const REWARD_COSTS: Record<string, { cost: number; categoryGroup: string }> = {
    'reward-3': { cost: 100, categoryGroup: 'cafe' }, // Cafe Cổ Đô: 100 Xu
    'reward-2': { cost: 150, categoryGroup: 'souvenir' }, // Đông Ba: 150 Xu
    'reward-1': { cost: 300, categoryGroup: 'homestay' }, // Phú Mộng: 300 Xu
    'reward-6': { cost: 400, categoryGroup: 'souvenir' },
    'reward-5': { cost: 500, categoryGroup: 'homestay' },
    'reward-7': { cost: 600, categoryGroup: 'restaurant' },
    'reward-4': { cost: 800, categoryGroup: 'tour' }, // Tour Làng Nghề: 800 Xu
    'reward-8': { cost: 1000, categoryGroup: 'spa' }, // Spa VIP: 1000 Xu
};

export default function Rewards() {
    const router = useRouter();
    const { language } = useLanguage();

    // Lấy đầy đủ state và hàm từ Context
    const {
        unlockedRewards,
        unlockReward,
        getCompletedVillagesCount,
        bookings,
        coins,
        addCoins,
        deductCoins
    } = useProgress();

    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('tickets'); // Mở tab Vé đầu tiên

    const currentLang = language || 'vi';
    const langKey = currentLang === 'sign' ? 'vi' : currentLang;
    const completedCount = getCompletedVillagesCount();

    // Kiểm tra xem voucher đã được mua chưa
    const isRewardUnlocked = (rewardId: string) => {
        return !!unlockedRewards[rewardId];
    };

    const unlockedList = rewards.filter((r) => isRewardUnlocked(r.id));
    const unlockedCount = unlockedList.length;

    // HÀM TIÊU XU ĐỔI QUÀ
    const handleRedeemVoucher = (rewardId: string, cost: number, title: string) => {
        if (coins >= cost) {
            if (deductCoins(cost)) {
                unlockReward(rewardId);
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#F59E0B', '#10B981', '#EC4899'] });
                toast.success(currentLang === 'en' ? `Successfully redeemed: ${title}!` : `Đã đổi thành công: ${title}!`);
            }
        } else {
            toast.error(currentLang === 'en' ? `Not enough Coins! Need ${cost - coins} more.` : `Chưa đủ Xu! Bạn cần thêm ${cost - coins} Xu nữa.`);
        }
    };

    // HÀM TẶNG XU TÂN THỦ (Làm vốn)
    const handleClaimStarterGift = () => {
        addCoins(300);
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors: ['#F59E0B', '#D97706', '#FBBF24'] });
        toast.success(currentLang === 'en' ? '300 Starter Coins claimed!' : 'Đã nhận 300 Xu Người mới! Bắt đầu đổi quà thôi.');
    };

    const handleCopy = (code: string, partner: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ['#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899'] });
        toast.success(currentLang === 'en' ? `Voucher code ${code} copied for ${partner}!` : `Đã sao chép mã ${code} cho ${partner}!`);
        setTimeout(() => setCopiedCode(null), 2500);
    };

    const t = {
        vi: {
            eyebrow: 'Trải nghiệm về - Nhận Voucher', title: 'Voucher & Phần Thưởng Đối Tác Cố Đô', subtitle: 'Hoàn thành chuyến đi thực tế để nhận Xu. Dùng xu để đổi trọn bộ voucher.',
            stat_completed: 'Làng nghề hoàn thành', stat_unlocked: 'Voucher đã mở khóa', stat_value: 'Số dư Xu',
            btn_starter: 'Nhận Quà Người Mới (300 Xu)', btn_explore: 'Khám Phá Thêm',
            filter_tickets: 'Vé Trải Nghiệm', filter_all: 'Tất cả Voucher', filter_unlocked: 'Đã mở khóa',
            filter_homestay: 'Khách sạn & Homestay', filter_dining: 'Ẩm thực & Cafe', filter_tour: 'Quà lưu niệm', filter_spa: 'Spa',
            empty_unlocked: 'Chưa có voucher nào.', empty_unlocked_sub: 'Hãy kiếm thêm xu để đổi nhé!',
            voucher_code: 'MÃ VOUCHER', copy_code: 'Sao chép', copied: 'Đã sao chép!',
            unlocked_badge: 'Sẵn Sàng Sử Dụng', locked_badge: 'Chưa Đủ Xu',
        },
        en: {
            eyebrow: 'Imperial Treasury', title: 'Hue Partner Vouchers', subtitle: 'Complete field trips to earn Coins and unlock vouchers.',
            stat_completed: 'Completed Villages', stat_unlocked: 'Unlocked Vouchers', stat_value: 'Coin Balance',
            btn_starter: 'Claim Starter Gift (300 Coins)', btn_explore: 'Explore More',
            filter_tickets: 'My Tickets', filter_all: 'All Vouchers', filter_unlocked: 'Unlocked',
            filter_homestay: 'Homestay', filter_dining: 'Dining', filter_tour: 'Souvenirs', filter_spa: 'Spa',
            empty_unlocked: 'No vouchers unlocked yet.', empty_unlocked_sub: 'Earn more coins!',
            voucher_code: 'VOUCHER CODE', copy_code: 'Copy Code', copied: 'Copied!',
            unlocked_badge: 'Ready to Redeem', locked_badge: 'Locked',
        },
        sign: {
            eyebrow: 'Kho Báu Quà Tặng 🎁', title: 'Voucher & Phần Thưởng', subtitle: 'Hoàn thành làng nghề để nhận Xu. Dùng xu mở khóa voucher!',
            stat_completed: 'Làng nghề đã qua 🏘️', stat_unlocked: 'Quà đã mở khóa 🔓', stat_value: 'Số dư Xu 💰',
            btn_starter: 'Quà Tân Thủ 🎁', btn_explore: 'Đi làm nghề 🏘️',
            filter_tickets: 'Vé của tôi 🎟️', filter_all: 'Tất cả Voucher', filter_unlocked: 'Của tôi 🎁',
            filter_homestay: 'Khách sạn 🏨', filter_dining: 'Ẩm thực 🍵', filter_tour: 'Quà tặng 🛍️', filter_spa: 'Spa 🌿',
            empty_unlocked: 'Chưa có quà!', empty_unlocked_sub: 'Tích xu thêm nhé!',
            voucher_code: 'MÃ ƯU ĐÃI', copy_code: 'Sao chép 📋', copied: 'Đã copy! ✅',
            unlocked_badge: 'Đã Mở Khóa 🔓', locked_badge: 'Thiếu Xu 🔒',
        },
    };
    const copy = t[currentLang];

    const filteredList = rewards.filter((r) => {
        if (filter === 'all' || filter === 'tickets') return true;
        if (filter === 'unlocked') return isRewardUnlocked(r.id);
        if (filter === 'homestay') return r.type === 'homestay';
        if (filter === 'dining') return r.type === 'cafe' || r.type === 'restaurant';
        if (filter === 'tour') return r.type === 'tour' || r.type === 'souvenir';
        if (filter === 'spa') return r.type === 'spa';
        return true;
    });

    return (
        <div className="relative min-h-screen bg-[#0E0602] text-white selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <Navbar currentPage="rewards" />

            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1705823637026-92c0ef6d6222?w=1800&h=1000&fit=crop&auto=format')` }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-purple-900/20 via-amber-700/15 to-transparent blur-3xl" />
                <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24">
                {/* HERO SECTION */}
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-[#1F082B] via-[#2D0F38] to-[#12050B] p-6 sm:p-10 lg:p-12 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(45deg, #E9D5FF 0, #E9D5FF 1px, transparent 0, transparent 40%)`, backgroundSize: '16px 16px' }} />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-6 flex flex-col items-start">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
                                <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
                                <span>{copy.eyebrow}</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {copy.title}
                            </h1>
                            <p className="text-purple-200/90 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl" style={{ fontFamily: "'Lora', serif" }}>
                                {copy.subtitle}
                            </p>
                            <div className="flex items-center gap-3.5 flex-wrap">
                                <button onClick={handleClaimStarterGift} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95">
                                    <Gift className="w-4 h-4 text-stone-950" />
                                    <span>{copy.btn_starter}</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* STATS CARDS */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-6 grid grid-cols-3 gap-3 sm:gap-4">
                            <div className="rounded-2xl bg-stone-950/85 border border-amber-500/30 p-3 sm:p-4 text-center shadow-xl backdrop-blur-md flex flex-col justify-center">
                                <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-1 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    <span>{completedCount}</span><span className="text-base sm:text-lg text-amber-400/60 font-semibold">/8</span>
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-stone-300 font-medium leading-tight">{copy.stat_completed}</div>
                            </div>

                            <div className="rounded-2xl bg-stone-950/85 border border-emerald-500/30 p-3 sm:p-4 text-center shadow-xl backdrop-blur-md flex flex-col justify-center">
                                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    <span>{unlockedCount}</span><span className="text-base sm:text-lg text-emerald-400/60 font-semibold">/8</span>
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-stone-300 font-medium leading-tight">{copy.stat_unlocked}</div>
                            </div>

                            {/* Ô TỔNG XU */}
                            <div className="rounded-2xl bg-stone-950/85 border border-amber-500/50 p-3 sm:p-4 text-center shadow-xl shadow-amber-500/10 backdrop-blur-md flex flex-col justify-center overflow-hidden">
                                <div className="text-xl sm:text-2xl font-black text-amber-400 mb-1 tracking-tight truncate flex items-center justify-center gap-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {coins || 0}
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-amber-200/80 font-bold uppercase tracking-wider leading-tight">{copy.stat_value}</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* TABS LỌC */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-950/90 border border-white/10 overflow-x-auto max-w-full mb-8">
                    {[
                        { key: 'tickets', label: copy.filter_tickets, count: (bookings || []).length, icon: Ticket },
                        { key: 'all', label: copy.filter_all, count: rewards.length, icon: Sparkles },
                        { key: 'homestay', label: copy.filter_homestay, icon: Hotel },
                        { key: 'dining', label: copy.filter_dining, icon: Utensils },
                        { key: 'tour', label: copy.filter_tour, icon: Compass },
                        { key: 'spa', label: copy.filter_spa, icon: Sparkles },
                    ].map((tab) => {
                        const TabIcon = tab.icon;
                        const isActive = filter === tab.key;
                        return (
                            <button key={tab.key} onClick={() => setFilter(tab.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/25 scale-[1.02]' : 'text-stone-400 hover:text-white hover:bg-white/5'}`}>
                                <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? 'bg-stone-950/25 text-stone-950' : 'bg-white/10 text-stone-300'}`}>{tab.count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* NỘI DUNG CHÍNH */}
                {filter === 'tickets' ? (
                    (!bookings || bookings.length === 0) ? (
                        <div className="rounded-3xl border border-white/10 bg-stone-950/60 p-12 text-center my-8">
                            <Ticket className="w-12 h-12 text-stone-500 mx-auto mb-4 opacity-50" />
                            <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Bạn chưa có vé trải nghiệm nào.</h3>
                            <p className="text-stone-300 text-sm max-w-md mx-auto mb-6">Hãy vào trang làng nghề và đặt lịch Workshop để nhận vé!</p>
                            <button onClick={() => router.push('/home')} className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all">Đi tới trang Làng Nghề</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 mb-16">
                            {(bookings || []).map(booking => (
                                <TicketCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    )
                ) : (
                    filteredList.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-stone-950/60 p-12 text-center my-8">
                            <Gift className="w-12 h-12 text-stone-500 mx-auto mb-4" />
                            <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{copy.empty_unlocked}</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                            {filteredList.map((reward, index) => {
                                const unlocked = isRewardUnlocked(reward.id);
                                const Icon = REWARD_ICONS[reward.type] || Gift;
                                const color = REWARD_COLORS[reward.type] || { from: '#8B1A00', to: '#C05010', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', border: '#F59E0B' };

                                const cost = REWARD_COSTS[reward.id]?.cost || 9999;

                                const REWARD_PHOTOS: Record<string, string> = {
                                    'reward-1': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&h=450&fit=crop&auto=format',
                                    'reward-2': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=700&h=450&fit=crop&auto=format',
                                    'reward-3': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&h=450&fit=crop&auto=format',
                                    'reward-4': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=700&h=450&fit=crop&auto=format',
                                    'reward-5': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&h=450&fit=crop&auto=format',
                                    'reward-6': 'https://images.unsplash.com/photo-1574614366831-900f959788c9?w=700&h=450&fit=crop&auto=format',
                                    'reward-7': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&h=450&fit=crop&auto=format',
                                    'reward-8': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&h=450&fit=crop&auto=format',
                                };
                                const photoUrl = REWARD_PHOTOS[reward.id] || REWARD_PHOTOS['reward-1'];

                                return (
                                    <motion.div
                                        key={reward.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.04 * index, duration: 0.5 }}
                                        className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 ${unlocked ? 'border-amber-500/40 hover:border-amber-400 bg-gradient-to-b from-stone-900/95 to-[#120703] shadow-2xl hover:-translate-y-1.5' : 'border-white/10 hover:border-amber-500/30 bg-gradient-to-b from-stone-950/90 to-[#0A0402] opacity-85 hover:opacity-100 hover:-translate-y-1'}`}
                                    >
                                        <div className="relative h-48 overflow-hidden bg-stone-950">
                                            <img src={photoUrl} alt={reward.partner} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #120703 0%, ${color.from}70 60%, rgba(0,0,0,0.5) 100%)` }} />
                                            <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/65 text-amber-200 border border-amber-500/30 backdrop-blur-md shadow-sm">{reward.partner}</span>
                                                {unlocked ? (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white border border-emerald-400/40 backdrop-blur-md flex items-center gap-1"><Unlock className="w-2.5 h-2.5" /><span>{copy.unlocked_badge}</span></span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1"><Lock className="w-2.5 h-2.5 text-amber-400" /><span>{copy.locked_badge}</span></span>
                                                )}
                                            </div>
                                            <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2">
                                                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-400/60 shadow-lg">
                                                    <div className="w-7 h-7 rounded-xl flex items-center justify-center text-stone-950 font-bold shadow-sm" style={{ background: `linear-gradient(135deg, #F59E0B, #D97706)` }}><Icon className="w-4 h-4 text-stone-950" /></div>
                                                    <span className="text-xl font-black text-amber-300 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{reward.discount}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-amber-200" style={{ fontFamily: "'Playfair Display', serif" }}>{reward.title[langKey]}</h3>
                                            </div>
                                            <div className="pt-3 border-t border-white/10 mt-auto">
                                                {unlocked ? (
                                                    <div className="space-y-2">
                                                        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-dashed border-amber-500/50 flex items-center justify-between px-3">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">{copy.voucher_code}</span>
                                                                <span className="text-base font-mono font-black tracking-widest text-amber-200">{reward.code}</span>
                                                            </div>
                                                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                                                        </div>
                                                        <button onClick={() => handleCopy(reward.code, reward.partner)} className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${copiedCode === reward.code ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/20 hover:scale-[1.02]'}`}>
                                                            {copiedCode === reward.code ? <><CheckCircle2 className="w-4 h-4" /><span>{copy.copied}</span></> : <><Copy className="w-4 h-4" /><span>{copy.copy_code}</span></>}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="pt-1">
                                                        <button
                                                            onClick={() => handleRedeemVoucher(reward.id, cost, reward.title[langKey])}
                                                            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                                                                coins >= cost
                                                                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                                                                    : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5'
                                                            }`}
                                                        >
                                                            <Coins className={`w-4 h-4 ${coins >= cost ? 'text-stone-950' : 'text-stone-500'}`} />
                                                            <span>{coins >= cost ? `Đổi ${cost} Xu` : `Cần ${cost} Xu`}</span>
                                                        </button>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                                <div className="h-full bg-amber-500/50 rounded-full" style={{ width: `${Math.min(100, (coins / cost) * 100)}%` }} />
                                                            </div>
                                                            <span className="text-[9px] text-stone-400 font-mono">{coins}/{cost}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )
                )}
            </main>
        </div>
    );
}