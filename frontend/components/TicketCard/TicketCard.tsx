'use client';

import React from 'react';
import { motion } from 'motion/react'; // Đã sửa chuẩn thư viện của bạn!
import { Ticket, CheckCircle2, Clock, Coins, QrCode } from 'lucide-react';
import { useProgress, BookingStatus } from '@/context/ProgressContext';
import confetti from 'canvas-confetti';

interface TicketCardProps {
    booking: {
        id: string;
        villageId: string;
        villageName: string;
        date: string;
        status: BookingStatus;
        timestamp: number;
    };
}

export default function TicketCard({ booking }: TicketCardProps) {
    const { updateBookingStatus, addCoins } = useProgress();

    const handleClaimCoins = () => {
        if (booking.status === 'completed') {
            updateBookingStatus(booking.id, 'claimed');
            addCoins(500); 
            
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F59E0B', '#FBBF24', '#10B981']
            });
        }
    };

    const handleAdminVerify = () => {
        if (booking.status === 'pending') {
            updateBookingStatus(booking.id, 'completed'); 
        }
    };

    const isClaimed = booking.status === 'claimed';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${isClaimed ? 'grayscale opacity-75' : 'hover:shadow-xl hover:-translate-y-1'}`}
        >
            {/* THÂN VÉ */}
            <div className="flex-[3] bg-[#FDFBF7] p-6 relative border-y border-l border-amber-900/20 sm:rounded-l-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                        <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-amber-900/60 uppercase tracking-wider">Vé Trải Nghiệm Offline</h4>
                        <p className="text-xs font-mono text-amber-900/40">ID: {booking.id.toUpperCase()}</p>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-amber-950 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {booking.villageName}
                </h3>
                
                <div className="flex items-center gap-6 mt-6">
                    <div>
                        <p className="text-[10px] uppercase text-amber-900/60 font-bold mb-1">Ngày tham gia</p>
                        <p className="text-sm font-semibold text-amber-950 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-900/10">
                            {booking.date}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase text-amber-900/60 font-bold mb-1">Phần thưởng</p>
                        <p className="text-sm font-bold text-amber-600 flex items-center gap-1">
                            <Coins className="w-4 h-4" /> 500 Xu
                        </p>
                    </div>
                </div>

                <div className="hidden sm:block absolute -right-3 top-[-10px] w-6 h-6 bg-stone-900 rounded-full border-b border-amber-900/20 z-10" />
                <div className="hidden sm:block absolute -right-3 bottom-[-10px] w-6 h-6 bg-stone-900 rounded-full border-t border-amber-900/20 z-10" />
            </div>

            {/* RĂNG CƯA */}
            <div className="hidden sm:flex flex-col justify-center items-center bg-[#FDFBF7] border-y border-amber-900/20 relative z-0">
                <div className="h-full border-l-2 border-dashed border-amber-900/20"></div>
            </div>

            {/* CUỐNG VÉ */}
            <div className="flex-[1.5] bg-[#F4EBE1] p-6 flex flex-col items-center justify-center border-y border-r border-amber-900/20 sm:rounded-r-2xl relative text-center">
                {booking.status === 'pending' && (
                    <>
                        <div className="text-amber-600 mb-3 animate-pulse"><Clock className="w-10 h-10 mx-auto" /></div>
                        <p className="text-sm font-bold text-amber-950 mb-1">Đang chờ</p>
                        <p className="text-[10px] text-amber-800 mb-4 px-2">Hoàn thành chuyến đi nhận xu</p>
                        <button onClick={handleAdminVerify} className="flex items-center gap-1 text-[9px] text-white bg-stone-800 px-3 py-1.5 rounded-full hover:bg-black transition-colors shadow-sm">
                            <QrCode className="w-3 h-3" /> Admin Duyệt
                        </button>
                    </>
                )}
                {booking.status === 'completed' && (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 animate-pulse"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="text-green-600 mb-2"><CheckCircle2 className="w-12 h-12 mx-auto drop-shadow-md" /></div>
                            <p className="text-sm font-bold text-green-800 mb-3">Đã xác nhận!</p>
                            <button onClick={handleClaimCoins} className="relative overflow-hidden group bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>
                                <Coins className="w-5 h-5" /> Nhận 500 Xu
                            </button>
                        </div>
                    </>
                )}
                {booking.status === 'claimed' && (
                    <>
                        <div className="text-stone-400 mb-2"><CheckCircle2 className="w-10 h-10 mx-auto" /></div>
                        <p className="text-xs font-bold text-stone-500 uppercase">Đã nhận xu</p>
                    </>
                )}
            </div>
        </motion.div>
    );
}