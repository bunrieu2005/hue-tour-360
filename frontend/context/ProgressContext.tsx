'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Khai báo các trạng thái của Vé đặt lịch
export type BookingStatus = 'pending' | 'completed' | 'claimed';

export interface Booking {
    id: string;
    villageId: string;
    villageName: string;
    date: string;
    status: BookingStatus;
    timestamp: number;
}

interface ProgressContextType {
    completedVillages: string[];
    unlockedRewards: Record<string, boolean>;
    coins: number; // TỔNG XU HIỆN CÓ
    bookings: Booking[]; // DANH SÁCH VÉ
    addCoins: (amount: number) => void;
    deductCoins: (amount: number) => boolean;
    addBooking: (villageId: string, villageName: string, date: string) => void;
    updateBookingStatus: (id: string, status: BookingStatus) => void;
    unlockReward: (rewardId: string) => void;
    getCompletedVillagesCount: () => number;
    markVillageComplete: (villageId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    const [completedVillages, setCompletedVillages] = useState<string[]>([]);
    const [unlockedRewards, setUnlockedRewards] = useState<Record<string, boolean>>({});
    const [coins, setCoins] = useState<number>(0);
    const [bookings, setBookings] = useState<Booking[]>([]);

    // Tải dữ liệu từ LocalStorage khi khởi chạy
    useEffect(() => {
        try {
            const savedVillages = localStorage.getItem('completedVillages');
            const savedRewards = localStorage.getItem('unlockedRewards');
            const savedCoins = localStorage.getItem('userCoins');
            const savedBookings = localStorage.getItem('userBookings');

            if (savedVillages) setCompletedVillages(JSON.parse(savedVillages));
            if (savedRewards) setUnlockedRewards(JSON.parse(savedRewards));
            if (savedCoins) setCoins(JSON.parse(savedCoins));
            if (savedBookings) setBookings(JSON.parse(savedBookings));
        } catch (error) {
            console.error("Failed to load progress from localStorage", error);
        }
    }, []);

    // Lưu dữ liệu vào LocalStorage mỗi khi có thay đổi
    useEffect(() => {
        localStorage.setItem('completedVillages', JSON.stringify(completedVillages));
        localStorage.setItem('unlockedRewards', JSON.stringify(unlockedRewards));
        localStorage.setItem('userCoins', JSON.stringify(coins));
        localStorage.setItem('userBookings', JSON.stringify(bookings));
    }, [completedVillages, unlockedRewards, coins, bookings]);

    /* --- LOGIC XỬ LÝ XU --- */
    const addCoins = (amount: number) => {
        setCoins(prev => prev + amount);
    };

    const deductCoins = (amount: number) => {
        if (coins >= amount) {
            setCoins(prev => prev - amount);
            return true; // Trừ thành công (để mua voucher)
        }
        return false; // Không đủ xu
    };

    /* --- LOGIC XỬ LÝ VÉ ĐẶT LỊCH --- */
    const addBooking = (villageId: string, villageName: string, date: string) => {
        const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            villageId,
            villageName,
            date,
            status: 'pending', // Mặc định là chờ trải nghiệm
            timestamp: Date.now()
        };
        setBookings(prev => [newBooking, ...prev]);
    };

    const updateBookingStatus = (id: string, status: BookingStatus) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    };

    /* --- LOGIC LÀNG NGHỀ & PHẦN THƯỞNG CŨ --- */
    const unlockReward = (rewardId: string) => {
        setUnlockedRewards(prev => ({ ...prev, [rewardId]: true }));
    };

    const getCompletedVillagesCount = () => completedVillages.length;

    const markVillageComplete = (villageId: string) => {
        if (!completedVillages.includes(villageId)) {
            setCompletedVillages(prev => [...prev, villageId]);
        }
    };

    return (
        <ProgressContext.Provider value={{
            completedVillages,
            unlockedRewards,
            coins,
            bookings,
            addCoins,
            deductCoins,
            addBooking,
            updateBookingStatus,
            unlockReward,
            getCompletedVillagesCount,
            markVillageComplete
        }}>
            {children}
        </ProgressContext.Provider>
    );
}

export function useProgress() {
    const context = useContext(ProgressContext);
    if (context === undefined) {
        throw new Error('useProgress must be used within a ProgressProvider');
    }
    return context;
}