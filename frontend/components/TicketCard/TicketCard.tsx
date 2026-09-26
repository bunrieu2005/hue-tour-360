'use client';

import React from 'react';
import { motion } from 'motion/react';
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

    const getStatusText = () => {
        if (booking.status === 'pending') return 'Đang chờ trải nghiệm';
        if (booking.status === 'completed') return 'Đã xác nhận, sẵn sàng nhận thưởng';
        return 'Đã hoàn thành và nhận 500 xu';
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            role="region"
            aria-label={`Vé trải nghiệm ${booking.villageName}, mã vé ${booking.id.toUpperCase()}, trạng thái: ${getStatusText()}`}
            tabIndex={0}
            className={`relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isClaimed ? 'grayscale opacity-75' : 'hover:shadow-xl hover:-translate-y-1'
            }`}
        >
            {/* THÂN VÉ */}
            <div className="flex-[3] bg-[#FDFBF7] p-6 relative border-y border-l border-amber-900/20 sm:rounded-l-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <div aria-hidden="true" className="p-2 bg-amber-100 rounded-lg text-amber-700">
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
                            <Coins aria-hidden="true" className="w-4 h-4" /> 
                            <span>500 Xu</span>
                        </p>
                    </div>
                </div>

                {/* Các vết đục lỗ trang trí */}
                <div aria-hidden="true" className="hidden sm:block absolute -right-3 top-[-10px] w-6 h-6 bg-stone-900 rounded-full border-b border-amber-900/20 z-10" />
                <div aria-hidden="true" className="hidden sm:block absolute -right-3 bottom-[-10px] w-6 h-6 bg-stone-900 rounded-full border-t border-amber-900/20 z-10" />
            </div>

            {/* RĂNG CƯA TRANG TRÍ */}
            <div aria-hidden="true" className="hidden sm:flex flex-col justify-center items-center bg-[#FDFBF7] border-y border-amber-900/20 relative z-0">
                <div className="h-full border-l-2 border-dashed border-amber-900/20"></div>
            </div>

            {/* CUỐNG VÉ */}
            <div className="flex-[1.5] bg-[#F4EBE1] p-6 flex flex-col items-center justify-center border-y border-r border-amber-900/20 sm:rounded-r-2xl relative text-center">
                <div aria-live="polite" className="sr-only">
                    Trạng thái vé: {getStatusText()}
                </div>

                {booking.status === 'pending' && (
                    <>
                        <div aria-hidden="true" className="text-amber-600 mb-3 animate-pulse">
                            <Clock className="w-10 h-10 mx-auto" />
                        </div>
                        <p className="text-sm font-bold text-amber-950 mb-1">Đang chờ</p>
                        <p className="text-[10px] text-amber-800 mb-4 px-2">Hoàn thành chuyến đi nhận xu</p>
                        <button 
                            onClick={handleAdminVerify} 
                            aria-label={`Duyệt xác nhận vé ${booking.id.toUpperCase()} cho làng ${booking.villageName}`}
                            className="flex items-center gap-1 text-[9px] text-white bg-stone-800 px-3 py-1.5 rounded-full hover:bg-black transition-colors shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                            <QrCode aria-hidden="true" className="w-3 h-3" /> Admin Duyệt
                        </button>
                    </>
                )}

                {booking.status === 'completed' && (
                    <>
                        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 animate-pulse pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div aria-hidden="true" className="text-green-600 mb-2">
                                <CheckCircle2 className="w-12 h-12 mx-auto drop-shadow-md" />
                            </div>
                            <p className="text-sm font-bold text-green-800 mb-3">Đã xác nhận!</p>
                            <button 
                                onClick={handleClaimCoins} 
                                aria-label="Nhận thưởng 500 xu từ vé trải nghiệm này"
                                className="relative overflow-hidden group bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                            >
                                <span aria-hidden="true" className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                                <Coins aria-hidden="true" className="w-5 h-5" /> 
                                <span>Nhận 500 Xu</span>
                            </button>
                        </div>
                    </>
                )}

                {booking.status === 'claimed' && (
                    <>
                        <div aria-hidden="true" className="text-stone-400 mb-2">
                            <CheckCircle2 className="w-10 h-10 mx-auto" />
                        </div>
                        <p className="text-xs font-bold text-stone-500 uppercase">Đã nhận xu</p>
                    </>
                )}
            </div>
        </motion.div>
    );
}