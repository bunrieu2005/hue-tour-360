'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useProgress } from '@/context/ProgressContext';
import { motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import dynamic from 'next/dynamic';

import { villages } from '@/data/villages';
import {
    VILLAGE_IMAGES,
    VILLAGE_METADATA,
} from '@/data/villageDisplay';

import {
    Compass,
    Sparkles,
    ChevronRight,
    ArrowRight,
    MapPin,
    Scroll,
    Palette,
    Gift,
    PlayCircle,
    CheckCircle2,
    Search,
    User,
    ExternalLink,
    HeartHandshake,
} from 'lucide-react';

const VillageVRTour = dynamic(
    () => import('@/components/VillageVRTour'),
    {
        ssr: false,
    }
);

export default function LanguageSelection() {
    const router = useRouter();

    const { language } = useLanguage();

    const {
        completedVillages,
        getCompletedVillagesCount,
        unlockedRewards,
    } = useProgress();

    const [activeVR, setActiveVR] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const currentLang = language || 'vi';
    const langKey = currentLang === 'sign' ? 'vi' : currentLang;

    const completedCount = getCompletedVillagesCount();

    const unlockedCount = Object.keys(unlockedRewards).filter(
        (k) => unlockedRewards[k]
    ).length;

    const pct =
        villages.length > 0
            ? Math.round((completedCount / villages.length) * 100)
            : 0;

    /**
     * ==========================================
     * LANGUAGE CONTENT
     * ==========================================
     */

    const t = {
        vi: {
            eyebrow: 'Di sản Văn hóa Phi vật thể • Cố đô Huế',

            hero_title_1: 'Hành Trình Di Sản',
            hero_title_2: '& Khám Phá 360°',

            hero_subtitle:
                'Cổng thông tin văn hóa số đưa bạn khám phá 8 làng nghề truyền thống hơn 400 năm lịch sử và dạo bước thực tế ảo sống động qua từng góc phố Cố đô Huế.',

            cta_street_view: 'Khám Phá 360°',
            cta_explore_villages: 'Khám Phá Làng Nghề',

            preview_badge: 'Trải Nghiệm Mới',

            preview_title:
                'Chế Độ Xem Phố 360° Độc Bản',

            preview_desc:
                'Di chuyển tới lui, xoay toàn cảnh 360 độ, khám phá hiện vật và bản đồ mini tương tác thời gian thực.',

            try_street_view: 'Khám phá ngay',

            stat_villages: '8 Làng nghề',
            stat_villages_desc: 'Di sản 400+ năm',

            stat_street_view: 'Xem Phố 360°',
            stat_street_view_desc: 'Hình ảnh sắc nét HD',

            stat_interactive: '100% Tương tác',
            stat_interactive_desc: 'Tự tay làm nghề ảo',

            stat_rewards: 'Quà lưu niệm',
            stat_rewards_desc: 'Đổi voucher du lịch',

            section_villages_title:
                'Khám Phá 8 Làng Nghề Truyền Thống',

            section_villages_subtitle:
                'Tìm hiểu lịch sử, gặp gỡ nghệ nhân và trực tiếp trải nghiệm những nghề thủ công truyền thống của Cố đô Huế.',

            view_all_villages:
                'Xem bản đồ làng nghề',

            search_placeholder:
                'Tìm tên làng nghề, nghệ nhân hoặc sản phẩm...',

            search_empty:
                'Không tìm thấy làng nghề phù hợp.',

            btn_start:
                'Tìm hiểu làng nghề',

            btn_revisit:
                'Xem lại làng nghề',

            btn_360:
                'Trải nghiệm 360°',

            btn_detail:
                'Tìm hiểu lịch sử & nghệ nhân',

            completed_badge:
                'Đã Hoàn Thành',

            pillar_title:
                'Trải Nghiệm Văn Hóa Khác Biệt',

            pillar_subtitle:
                'Sự kết hợp giữa công nghệ hiện đại và chiều sâu di sản Cố đô',

            pillar_1_title:
                'Tự Tay Làm Nghề Thủ Công',

            pillar_1_desc:
                'Tương tác mô phỏng từng công đoạn: tô màu tranh Sình, gấp hoa giấy, se hương trầm ngay trên màn hình.',

            pillar_2_title:
                'Dạo Phố 360° Như Thực Địa',

            pillar_2_desc:
                'Hệ thống Street View giúp bạn lướt qua các ngõ phố Cố đô, xem radar camera và nhảy điểm trên bản đồ.',

            pillar_3_title:
                'Hỏi Đáp & Nhận Quà Thật',

            pillar_3_desc:
                'Tham gia câu đố văn hóa sau mỗi làng nghề để nhận mã giảm giá lưu niệm, homestay và ẩm thực tại Huế.',

            footer_text:
                'Dự án số hóa Di sản Văn hóa phi vật thể Cố đô Huế • Bảo tồn & Phát huy truyền thống Việt Nam',
        },

        en: {
            eyebrow:
                'UNESCO Intangible Cultural Heritage • Hue Ancient Capital',

            hero_title_1:
                'Imperial Heritage',

            hero_title_2:
                '& 360° VR Journey',

            hero_subtitle:
                'Digital cultural gateway exploring 8 traditional craft villages with 400+ years of history and immersive 360° Street View through the ancient streets of Hue.',

            cta_street_view:
                'Explore 360° Street View',

            cta_explore_villages:
                'Discover Craft Villages',

            preview_badge:
                'New Experience',

            preview_title:
                'Immersive 360° Street View',

            preview_desc:
                'Walk forward and backward, pan 360 degrees, inspect hotspots and real-time interactive mini-map.',

            try_street_view:
                'Launch 360 View',

            stat_villages:
                '8 Villages',

            stat_villages_desc:
                '400+ years history',

            stat_street_view:
                '360° Street View',

            stat_street_view_desc:
                'Crystal HD panoramas',

            stat_interactive:
                '100% Interactive',

            stat_interactive_desc:
                'Virtual crafting tools',

            stat_rewards:
                'Travel Rewards',

            stat_rewards_desc:
                'Real discounts & vouchers',

            section_villages_title:
                'Explore 8 Traditional Craft Villages',

            section_villages_subtitle:
                'Meet master artisans, discover heritage stories and experience traditional crafts from Hue.',

            view_all_villages:
                'Explore Village Map',

            search_placeholder:
                'Search village, master artisan, or craft...',

            search_empty:
                'No craft villages found.',

            btn_start:
                'Begin Craft Experience',

            btn_revisit:
                'Revisit Village',

            btn_360:
                'Experience 360°',

            btn_detail:
                'View History & Master Artisan',

            completed_badge:
                'Completed',

            pillar_title:
                'A Truly Immersive Cultural Journey',

            pillar_subtitle:
                'A combination of modern technology and the cultural depth of Imperial Hue',

            pillar_1_title:
                'Hands-on Virtual Crafting',

            pillar_1_desc:
                'Simulate authentic crafting steps: block-printing Sinh paintings, folding paper flowers, and rolling incense.',

            pillar_2_title:
                'Authentic 360° Street View',

            pillar_2_desc:
                'Walk through the streets of Hue with dynamic camera vision and interactive waypoint pins.',

            pillar_3_title:
                'Quizzes & Real Rewards',

            pillar_3_desc:
                'Complete cultural quizzes to earn vouchers for local homestays, dining and travel experiences.',

            footer_text:
                'Hue Cultural Heritage Digital Preservation Project • Preserving & Celebrating Vietnamese Tradition',
        },

        sign: {
            eyebrow:
                '🤟 Di sản Văn hóa Huế • Trực quan hóa',

            hero_title_1:
                'Khám Phá Di Sản',

            hero_title_2:
                '& Bản Đồ 360°',

            hero_subtitle:
                'Hành trình trực quan số qua 8 làng nghề truyền thống và chế độ xem phố 360 độ trực quan, sinh động.',

            cta_street_view:
                '🧭 Bản Đồ 360°',

            cta_explore_villages:
                '🏮 Xem Các Làng Nghề',

            preview_badge:
                'Khám Phá Ngay',

            preview_title:
                'Xem Phố 360° Trực Quan',

            preview_desc:
                'Xem phố 360 độ, di chuyển tới lui và chạm vào các hiện vật làng nghề.',

            try_street_view:
                'Mở bản đồ',

            stat_villages:
                '8 Làng Nghề',

            stat_villages_desc:
                'Nghề cổ truyền',

            stat_street_view:
                'Bản Đồ 360°',

            stat_street_view_desc:
                'Ảnh góc rộng',

            stat_interactive:
                'Thực Hành Ảo',

            stat_interactive_desc:
                'Tự tay làm thử',

            stat_rewards:
                'Phần Thưởng',

            stat_rewards_desc:
                'Quà lưu niệm',

            section_villages_title:
                'Khám Phá 8 Làng Nghề Huế',

            section_villages_subtitle:
                'Tìm hiểu những làng nghề truyền thống nổi tiếng của Cố đô Huế.',

            view_all_villages:
                'Xem bản đồ',

            search_placeholder:
                'Tìm kiếm làng nghề...',

            search_empty:
                'Không tìm thấy làng nghề.',

            btn_start:
                'Bắt đầu làm nghề',

            btn_revisit:
                'Xem lại',

            btn_360:
                'Trải nghiệm 360°',

            btn_detail:
                'Xem lịch sử',

            completed_badge:
                'Đã hoàn thành',

            pillar_title:
                'Trải Nghiệm Nổi Bật',

            pillar_subtitle:
                'Công nghệ hiện đại kết hợp với di sản văn hóa Huế',

            pillar_1_title:
                'Thực Hành Nghề Thủ Công',

            pillar_1_desc:
                'Tương tác vẽ tranh, làm hoa giấy và làm hương trực quan trên màn hình.',

            pillar_2_title:
                'Xem Phố 360° Toàn Cảnh',

            pillar_2_desc:
                'Dạo quanh các góc phố Huế bằng góc nhìn 360 độ bao quát.',

            pillar_3_title:
                'Thử Thách Nhận Quà',

            pillar_3_desc:
                'Trả lời câu hỏi để nhận những phần quà du lịch ý nghĩa.',

            footer_text:
                'Dự án Di sản Văn hóa Huế • Trải nghiệm số thân thiện và dễ tiếp cận',
        },
    };

    const copy = t[currentLang];

    /**
     * ==========================================
     * FILTER 8 VILLAGES
     * ==========================================
     */

    const filteredVillages = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();

        if (!q) {
            return villages;
        }

        return villages.filter((village) => {
            const name =
                village.name[langKey]?.toLowerCase() || '';

            const description =
                village.description[langKey]?.toLowerCase() || '';

            const artisan =
                village.artisan.name?.toLowerCase() || '';

            return (
                name.includes(q) ||
                description.includes(q) ||
                artisan.includes(q)
            );
        });
    }, [searchQuery, langKey]);

    return (
        <div
            className="relative min-h-screen bg-[#0E0602] text-white selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden"
            style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
        >

            {/* ==========================================
                BACKGROUND
            ========================================== */}

            <div
                aria-hidden="true"
                className="fixed inset-0 pointer-events-none z-0"
            >
                <div
                    className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity scale-105 transition-transform duration-1000"
                    style={{
                        backgroundImage:
                            `url('https://images.unsplash.com/photo-1705823637026-92c0ef6d6222?w=1800&h=1000&fit=crop&auto=format')`,
                    }}
                />

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-600/15 via-red-950/20 to-transparent blur-3xl" />

                <div className="absolute bottom-0 inset-x-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            {/* ==========================================
                NAVBAR
            ========================================== */}

            <Navbar currentPage="landing" />

            {/* ==========================================
                MAIN
            ========================================== */}

            <main
                role="main"
                aria-label="Nội dung trang chủ giới thiệu di sản Huế"
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-24"
            >

                {/* ==========================================
                    HERO
                ========================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* HERO LEFT */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        className="lg:col-span-7 flex flex-col items-start"
                    >

                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm shadow-lg">

                            <span
                                aria-hidden="true"
                                className="w-2 h-2 rounded-full bg-amber-400 animate-ping"
                            />

                            <span>
                                {copy.eyebrow}
                            </span>

                        </div>

                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6"
                            style={{
                                fontFamily:
                                    "'Playfair Display', serif",
                            }}
                        >
                            {copy.hero_title_1}

                            <br />

                            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                                {copy.hero_title_2}
                            </span>
                        </h1>

                        <p
                            className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mb-8"
                            style={{
                                fontFamily: "'Lora', serif",
                            }}
                        >
                            {copy.hero_subtitle}
                        </p>

                        {/* CTA */}

                        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">

                            <button
                                onClick={() =>
                                    router.push('/map')
                                }
                                aria-label="Khám phá bản đồ Street View 360 độ"
                                className="group relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 border border-amber-300/60 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
                            >
                                <Compass
                                    aria-hidden="true"
                                    className="w-5 h-5 text-stone-950 group-hover:rotate-45 transition-transform duration-300"
                                />

                                <span>
                                    {copy.cta_street_view}
                                </span>

                                <ArrowRight
                                    aria-hidden="true"
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                />
                            </button>

                            <button
                                onClick={() =>
                                    document
                                        .getElementById(
                                            'villages'
                                        )
                                        ?.scrollIntoView({
                                            behavior: 'smooth',
                                        })
                                }
                                aria-label="Khám phá 8 làng nghề truyền thống"
                                className="px-6 py-3.5 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all hover:border-amber-400/60 shadow-lg flex items-center gap-2 cursor-pointer"
                            >
                                <span>
                                    {copy.cta_explore_villages}
                                </span>

                                <ChevronRight
                                    aria-hidden="true"
                                    className="w-4 h-4 text-stone-400"
                                />
                            </button>

                        </div>

                        {/* STATS */}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-6 border-t border-white/10">

                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <p className="text-sm font-bold text-amber-300">
                                    {copy.stat_villages}
                                </p>

                                <p className="text-[11px] text-stone-400 mt-0.5">
                                    {copy.stat_villages_desc}
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <p className="text-sm font-bold text-sky-300">
                                    {copy.stat_street_view}
                                </p>

                                <p className="text-[11px] text-stone-400 mt-0.5">
                                    {copy.stat_street_view_desc}
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <p className="text-sm font-bold text-emerald-300">
                                    {copy.stat_interactive}
                                </p>

                                <p className="text-[11px] text-stone-400 mt-0.5">
                                    {copy.stat_interactive_desc}
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <p className="text-sm font-bold text-rose-300">
                                    {copy.stat_rewards}
                                </p>

                                <p className="text-[11px] text-stone-400 mt-0.5">
                                    {copy.stat_rewards_desc}
                                </p>
                            </div>

                        </div>

                    </motion.div>

                    {/* HERO RIGHT - 360 */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                        }}
                        className="lg:col-span-5 relative"
                    >

                        <div
                            aria-hidden="true"
                            className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-500/40 via-red-600/30 to-amber-600/40 blur-xl opacity-70 animate-pulse"
                        />

                        <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 bg-stone-900/90 shadow-2xl backdrop-blur-xl group">

                            <div
                                className="relative h-64 sm:h-72 overflow-hidden cursor-pointer"
                                onClick={() =>
                                    router.push('/map')
                                }
                            >

                                <img
                                    src="/panoramas/hue_walking_street_day.jpg"
                                    alt="Ảnh chụp toàn cảnh 360 độ phố đi bộ và di sản Huế"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent"
                                />

                                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2">
                                    <Compass
                                        aria-hidden="true"
                                        className="w-4 h-4 text-amber-400 animate-spin"
                                    />

                                    <span>
                                        360° PHOTO SPHERE
                                    </span>
                                </div>

                                <div
                                    aria-hidden="true"
                                    className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/90 text-stone-950 text-[10px] font-bold shadow-lg animate-bounce"
                                >
                                    <Sparkles className="w-3 h-3" />

                                    <span>
                                        Gian Hàng Lồng Đèn
                                    </span>
                                </div>

                                <div
                                    aria-hidden="true"
                                    className="absolute bottom-16 right-8 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/90 border border-white/20 text-white text-[10px] font-bold shadow-lg"
                                >
                                    <MapPin className="w-3 h-3 text-sky-400" />

                                    <span>
                                        Cửa Ngõ Đại Nội
                                    </span>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                                    <div className="px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-2xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
                                        <Compass
                                            aria-hidden="true"
                                            className="w-4 h-4"
                                        />

                                        <span>
                                            Vào Dạo Phố 360° Ngay
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className="p-6">

                                <div className="flex items-center justify-between gap-2 mb-2">

                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                                        {copy.preview_badge}
                                    </span>

                                    <span className="text-xs text-stone-400">
                                        Huế, Việt Nam
                                    </span>

                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                                    {copy.preview_title}
                                </h3>

                                <p className="text-xs text-stone-300 leading-relaxed mb-5">
                                    {copy.preview_desc}
                                </p>

                                <button
                                    onClick={() =>
                                        router.push('/map')
                                    }
                                    aria-label="Khởi chạy trải nghiệm xem phố 360 độ"
                                    className="w-full py-3 rounded-xl bg-stone-800 hover:bg-amber-600 text-white hover:text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-amber-400 cursor-pointer"
                                >
                                    <Compass
                                        aria-hidden="true"
                                        className="w-4 h-4"
                                    />

                                    <span>
                                        {copy.try_street_view} →
                                    </span>
                                </button>

                            </div>

                        </div>
                    </motion.div>

                </div>

                {/* ==========================================
                    8 VILLAGES
                ========================================== */}

                <section
                    id="villages"
                    className="mt-28"
                >

                    {/* SECTION HEADER */}

                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">

                        <div>

                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">

                                <Scroll
                                    aria-hidden="true"
                                    className="w-3.5 h-3.5"
                                />

                                <span>
                                    Di Sản Bách Nghệ
                                </span>

                            </div>

                            <h2
                                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                                style={{
                                    fontFamily:
                                        "'Playfair Display', serif",
                                }}
                            >
                                {copy.section_villages_title}
                            </h2>

                            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                                {copy.section_villages_subtitle}
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                router.push('/map')
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors shrink-0"
                        >
                            <span>
                                {copy.view_all_villages}
                            </span>

                            <ArrowRight
                                aria-hidden="true"
                                className="w-3.5 h-3.5"
                            />
                        </button>

                    </div>

                    {/* SEARCH */}

                    <div className="relative w-full md:w-96 mb-8">

                        <Search
                            aria-hidden="true"
                            className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                        />

                        <label
                            htmlFor="home-village-search"
                            className="sr-only"
                        >
                            Tìm kiếm làng nghề
                        </label>

                        <input
                            id="home-village-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                            placeholder={
                                copy.search_placeholder
                            }
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-950/90 border border-white/10 text-white placeholder:text-stone-500 text-xs focus:outline-none focus:border-amber-500/60 transition-all"
                        />

                    </div>

                    {/* PROGRESS */}

                    <div className="mb-8 rounded-2xl bg-stone-950/70 border border-white/10 p-4">

                        <div className="flex items-center justify-between gap-4 mb-2">

                            <div className="flex items-center gap-2">

                                <CheckCircle2
                                    className="w-4 h-4 text-emerald-400"
                                />

                                <span className="text-xs font-semibold text-stone-300">
                                    Tiến độ khám phá
                                </span>

                            </div>

                            <span className="text-xs font-bold text-amber-300">
                                {completedCount}/{villages.length}
                            </span>

                        </div>

                        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">

                            <motion.div
                                initial={{
                                    width: 0,
                                }}
                                animate={{
                                    width: `${Math.max(
                                        pct,
                                        completedCount > 0
                                            ? 3
                                            : 0
                                    )}%`,
                                }}
                                transition={{
                                    duration: 1,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300"
                            />

                        </div>

                    </div>

                    {/* ==========================================
                        VILLAGE GRID - 2 / ROW
                    ========================================== */}

                    {filteredVillages.length === 0 ? (

                        <div
                            role="status"
                            className="rounded-3xl border border-white/10 bg-stone-950/60 p-12 text-center my-8"
                        >

                            <Compass
                                aria-hidden="true"
                                className="w-12 h-12 text-stone-500 mx-auto mb-4"
                            />

                            <p className="text-stone-300 text-lg">
                                {copy.search_empty}
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {filteredVillages.map(
                                (village, index) => {

                                    const isCompleted =
                                        (
                                            completedVillages ||
                                            []
                                        ).includes(
                                            village.id
                                        );

                                    const meta =
                                        VILLAGE_METADATA[
                                            village.id
                                        ] ||
                                        VILLAGE_METADATA[
                                            'sinh-painting'
                                        ];

                                    const imgUrl =
                                        VILLAGE_IMAGES[
                                            village.id
                                        ] ||
                                        village.image;

                                    const fromLeft =
                                        index % 2 === 0;

                                    return (

                                        <motion.div
                                            key={village.id}
                                            initial={{
                                                opacity: 0,
                                                x: fromLeft
                                                    ? -35
                                                    : 35,
                                            }}
                                            whileInView={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            viewport={{
                                                once: true,
                                                amount: 0.2,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                delay:
                                                    0.05 *
                                                    (index % 2),
                                                ease: 'easeOut',
                                            }}
                                            className="group relative flex flex-col sm:flex-row rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/40 bg-gradient-to-b from-stone-900/90 to-[#120703]/95 shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                                        >

                                            {/* IMAGE */}

                                            <div className="relative w-full sm:w-2/5 h-64 sm:h-auto overflow-hidden bg-stone-950 shrink-0">

                                                <img
                                                    src={imgUrl}
                                                    alt={`Hình ảnh minh họa cho ${village.name[langKey]}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />

                                                <div
                                                    aria-hidden="true"
                                                    className="absolute inset-0"
                                                    style={{
                                                        background:
                                                            `linear-gradient(to top, #120703 0%, ${meta.gradientFrom}70 50%, transparent 100%)`,
                                                    }}
                                                />

                                                {/* CATEGORY */}

                                                <div className="absolute top-3.5 left-3.5">

                                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 text-amber-200 border border-amber-500/40 backdrop-blur-md">

                                                        {
                                                            meta
                                                                .heritageTag[
                                                                langKey
                                                            ]
                                                        }

                                                    </span>

                                                </div>

                                                {/* COMPLETED */}

                                                {isCompleted && (

                                                    <div
                                                        aria-label="Đã hoàn thành làng nghề này"
                                                        className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-emerald-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-400/50"
                                                    >

                                                        <CheckCircle2
                                                            aria-hidden="true"
                                                            className="w-3.5 h-3.5 text-emerald-200"
                                                        />

                                                        <span>
                                                            {
                                                                copy.completed_badge
                                                            }
                                                        </span>

                                                    </div>

                                                )}

                                            </div>

                                            {/* CONTENT */}

                                            <div className="flex-1 flex flex-col p-6">

                                                <h3
                                                    className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 mb-2"
                                                    style={{
                                                        fontFamily:
                                                            "'Playfair Display', serif",
                                                    }}
                                                >
                                                    {
                                                        village
                                                            .name[
                                                            langKey
                                                        ]
                                                    }
                                                </h3>

                                                {/* ARTISAN */}

                                                <div className="flex items-center gap-2 text-xs text-amber-300/90 mb-3 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20 w-fit max-w-full">

                                                    <User
                                                        aria-hidden="true"
                                                        className="w-3.5 h-3.5 text-amber-400 shrink-0"
                                                    />

                                                    <span className="font-semibold truncate">
                                                        Nghệ nhân:{' '}
                                                        {
                                                            village
                                                                .artisan
                                                                .name
                                                        }
                                                    </span>

                                                </div>

                                                {/* DESCRIPTION */}

                                                <p
                                                    className="text-stone-300 text-sm leading-relaxed mb-5 line-clamp-3 flex-1"
                                                    style={{
                                                        fontFamily:
                                                            "'Lora', serif",
                                                    }}
                                                >
                                                    {
                                                        village
                                                            .description[
                                                            langKey
                                                        ]
                                                    }
                                                </p>

                                                {/* BUTTONS */}

                                                <div className="space-y-2 mt-auto">

                                                    <div className="flex flex-col sm:flex-row gap-2">

                                                        {/* DETAIL */}

                                                        <button
                                                            onClick={() =>
                                                                router.push(
                                                                    `/village/${village.id}`
                                                                )
                                                            }
                                                            aria-label={
                                                                isCompleted
                                                                    ? `Xem lại làng nghề ${village.name[langKey]}`
                                                                    : `Bắt đầu tìm hiểu làng nghề ${village.name[langKey]}`
                                                            }
                                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white shadow-md cursor-pointer transition-all hover:brightness-110"
                                                            style={{
                                                                background:
                                                                    `linear-gradient(135deg, ${meta.gradientFrom}, ${meta.gradientTo})`,
                                                            }}
                                                        >

                                                            <PlayCircle
                                                                aria-hidden="true"
                                                                className="w-4 h-4"
                                                            />

                                                            <span>
                                                                {isCompleted
                                                                    ? copy.btn_revisit
                                                                    : copy.btn_start}
                                                            </span>

                                                            <ChevronRight
                                                                aria-hidden="true"
                                                                className="w-4 h-4 text-white/70"
                                                            />

                                                        </button>

                                                        {/* VR */}

                                                        <button
                                                            onClick={(
                                                                e
                                                            ) => {
                                                                e.stopPropagation();

                                                                setActiveVR(
                                                                    village.id
                                                                );
                                                            }}
                                                            aria-label={`Khám phá thực tế ảo 360 độ làng ${village.name[langKey]}`}
                                                            className="flex-1 py-2.5 bg-stone-900 text-amber-400 border border-amber-500/50 rounded-xl font-bold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                                                        >

                                                            <Compass
                                                                aria-hidden="true"
                                                                className="w-4 h-4"
                                                            />

                                                            <span>
                                                                {
                                                                    copy.btn_360
                                                                }
                                                            </span>

                                                        </button>

                                                    </div>

                                                    {/* DETAIL LINK */}

                                                    <button
                                                        onClick={() =>
                                                            router.push(
                                                                `/village/${village.id}`
                                                            )
                                                        }
                                                        aria-label={`Xem chi tiết lịch sử và nghệ nhân làng ${village.name[langKey]}`}
                                                        className="w-full py-1.5 text-center text-[11px] text-stone-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                                    >

                                                        <span>
                                                            {
                                                                copy.btn_detail
                                                            }
                                                        </span>

                                                        <ExternalLink
                                                            aria-hidden="true"
                                                            className="w-3 h-3 text-stone-500"
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        </motion.div>

                                    );
                                }
                            )}

                        </div>

                    )}

                </section>

                {/* ==========================================
                    EXPERIENCE PILLARS
                ========================================== */}

                <section
                    role="region"
                    aria-label="Các trụ cột trải nghiệm cốt lõi"
                    className="mt-28 py-12 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950 border border-white/10 shadow-2xl relative overflow-hidden"
                >

                    <div
                        aria-hidden="true"
                        className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
                    />

                    <div className="text-center max-w-2xl mx-auto mb-12">

                        <h2
                            className="text-2xl sm:text-3xl font-bold text-white mb-3"
                            style={{
                                fontFamily:
                                    "'Playfair Display', serif",
                            }}
                        >
                            {copy.pillar_title}
                        </h2>

                        <p className="text-xs sm:text-sm text-stone-400">
                            {copy.pillar_subtitle}
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* PILLAR 1 */}

                        <div className="p-6 rounded-2xl bg-stone-800/50 border border-white/10 hover:border-amber-400/40 transition-all flex flex-col items-start">

                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4">

                                <Palette
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                />

                            </div>

                            <h3 className="text-base font-bold text-white mb-2">
                                {copy.pillar_1_title}
                            </h3>

                            <p className="text-xs text-stone-300 leading-relaxed">
                                {copy.pillar_1_desc}
                            </p>

                        </div>

                        {/* PILLAR 2 */}

                        <div className="p-6 rounded-2xl bg-stone-800/50 border border-white/10 hover:border-sky-400/40 transition-all flex flex-col items-start">

                            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 mb-4">

                                <Compass
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                />

                            </div>

                            <h3 className="text-base font-bold text-white mb-2">
                                {copy.pillar_2_title}
                            </h3>

                            <p className="text-xs text-stone-300 leading-relaxed">
                                {copy.pillar_2_desc}
                            </p>

                        </div>

                        {/* PILLAR 3 */}

                        <div className="p-6 rounded-2xl bg-stone-800/50 border border-white/10 hover:border-emerald-400/40 transition-all flex flex-col items-start">

                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 mb-4">

                                <Gift
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                />

                            </div>

                            <h3 className="text-base font-bold text-white mb-2">
                                {copy.pillar_3_title}
                            </h3>

                            <p className="text-xs text-stone-300 leading-relaxed">
                                {copy.pillar_3_desc}
                            </p>

                        </div>

                    </div>

                </section>

            </main>

            {/* ==========================================
                VR360 POPUP
            ========================================== */}

            {activeVR && (

                <div
                    role="dialog"
                    aria-label="Trình phát tham quan thực tế ảo VR 360 độ"
                    className="fixed inset-0 z-[9999] bg-black w-screen h-screen flex items-center justify-center"
                >

                    <button
                        onClick={() =>
                            setActiveVR(null)
                        }
                        aria-label="Đóng cửa sổ VR 360"
                        className="absolute top-6 right-6 bg-red-600/80 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 z-50 backdrop-blur-sm cursor-pointer"
                    >
                        Đóng X
                    </button>

                    <div className="w-full h-full">
                        <VillageVRTour />
                    </div>

                </div>

            )}

            {/* ==========================================
                FOOTER
            ========================================== */}

            <footer
                role="contentinfo"
                aria-label="Chân trang di sản Huế"
                className="relative z-10 border-t border-white/10 bg-black/60 py-10 px-4 sm:px-6"
            >

                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

                    <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">

                            <Scroll
                                aria-hidden="true"
                                className="w-4 h-4"
                            />

                        </div>

                        <div>

                            <p className="text-xs font-bold text-white tracking-wider uppercase">
                                TOUR HUẾ • DI SẢN CỐ ĐÔ
                            </p>

                            <p className="text-[10px] text-stone-400">
                                {copy.footer_text}
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-300">

                        <button
                            onClick={() =>
                                router.push('/map')
                            }
                            aria-label="Đi đến bản đồ 360 độ"
                            className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <Compass
                                aria-hidden="true"
                                className="w-3.5 h-3.5 text-amber-400"
                            />

                            <span>
                                Bản Đồ 360°
                            </span>

                        </button>

                        <span>•</span>

                        <button
                            onClick={() =>
                                document
                                    .getElementById(
                                        'villages'
                                    )
                                    ?.scrollIntoView({
                                        behavior: 'smooth',
                                    })
                            }
                            aria-label="Xem danh sách 8 làng nghề"
                            className="hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            8 Làng Nghề
                        </button>

                        <span>•</span>

                        <button
                            onClick={() =>
                                router.push('/rewards')
                            }
                            aria-label="Xem trang phần thưởng và voucher"
                            className="hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            Phần Thưởng
                        </button>

                    </div>

                </div>

            </footer>

        </div>
    );
}