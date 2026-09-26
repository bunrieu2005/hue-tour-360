'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PaintingActivityProps {
    currentStep?: number;
    onStepChange?: (step: number) => void;
    onComplete: () => void;
}

export default function PaintingActivity({ currentStep = 0, onStepChange, onComplete }: PaintingActivityProps) {
    const [woodblockState, setWoodblockState] = useState<'raw' | 'inked' | 'covered'>('raw');
    const [paperState, setPaperState] = useState<'stack' | 'placed' | 'printed'>('stack');
    const [activeTool, setActiveTool] = useState<'none' | 'ink-brush' | 'color-brush' | 'paper'>('none');

    const [gameStage, setGameStage] = useState(0);
    const [rubCount, setRubCount] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleSelectTool = (tool: 'ink-brush' | 'color-brush' | 'paper') => {
        if (tool === 'ink-brush' && gameStage === 0) setActiveTool(tool);
        if (tool === 'paper' && gameStage === 1) setActiveTool(tool);
        if (tool === 'color-brush' && gameStage === 3) setActiveTool(tool);
    };

    const handleWoodblockClick = () => {
        if (activeTool === 'ink-brush' && woodblockState === 'raw') {
            setWoodblockState('inked');
            setActiveTool('none');
            setGameStage(1);
            if (onStepChange) onStepChange(2);
        }
        else if (activeTool === 'paper' && woodblockState === 'inked') {
            setWoodblockState('covered');
            setPaperState('placed');
            setActiveTool('none');
            setGameStage(2);
            if (onStepChange) onStepChange(3);
        }
    };

    const handleRubbing = () => {
        if (gameStage === 2 && paperState === 'placed') {
            const newCount = rubCount + 1;
            setRubCount(newCount);
            if (newCount >= 3) {
                setPaperState('printed');
                setGameStage(3);
                if (onStepChange) onStepChange(4);
            }
        }
    };

    const handlePaintingClick = () => {
        if (activeTool === 'color-brush' && paperState === 'printed') {
            setActiveTool('none');
            setGameStage(4);
            if (onStepChange) onStepChange(5);
            setTimeout(() => {
                onComplete();
            }, 1000);
        }
    };

    const getCursorImage = () => {
        if (activeTool === 'ink-brush') return "/game/game-langsinh/co-ve-de-nhung-muc-dichuyen.png";
        if (activeTool === 'color-brush') return "/game/game-langsinh/co-ve-de-to-mau-dichuyen.png";
        if (activeTool === 'paper') return "/game/game-langsinh/buctranh-trang.png";
        return null;
    };

    const getInstructionText = () => {
        if (gameStage === 0) return "Bước 1: Chọn bát mực lấy cọ, sau đó nhấn lên mộc bản để quét mực đen";
        if (gameStage === 1) return "Bước 2: Chọn lấy giấy bản trắng, sau đó nhấn đặt giấy lên mộc bản";
        if (gameStage === 2) return `Bước 3: Nhấn hoặc vuốt mạnh để giấy thấm mực (Lần ${rubCount} trên 3)`;
        if (gameStage === 3) return "Bước 4: Chọn ống bút màu để tô các chi tiết cho bức tranh";
        return "Tuyệt vời! Bạn đã hoàn thành in và tô màu tranh Làng Sình!";
    };

    return (
        <section 
            role="region" 
            aria-label="Trò chơi tương tác thực hành in tranh dân gian Làng Sình"
            className={`relative w-full h-full min-h-[700px] bg-[#d7c4b1] flex flex-col items-center p-8 select-none rounded-xl overflow-hidden ${activeTool !== 'none' ? 'cursor-none' : 'cursor-default'}`}
            style={{
                backgroundImage: 'radial-gradient(#a38c75 1.5px, transparent 1.5px)',
                backgroundSize: '30px 30px'
            }}
        >
            {/* Con trỏ ảo theo chuột */}
            {activeTool !== 'none' && (
                <div 
                    aria-hidden="true"
                    className="fixed pointer-events-none z-50 transition-transform duration-75"
                    style={{
                        left: mousePos.x,
                        top: mousePos.y,
                        transform: 'translate(-20%, -80%)'
                    }}
                >
                    <img src={getCursorImage()!} alt="" className="w-40 h-40 object-contain drop-shadow-2xl" />
                </div>
            )}

            {/* Bảng hướng dẫn & vùng thông báo trực tiếp cho NVDA */}
            <div className="absolute top-6 left-0 right-0 text-center z-10">
                <div 
                    aria-live="assertive" 
                    className="inline-block bg-black/80 text-amber-200 px-8 py-4 rounded-full text-base md:text-lg font-bold backdrop-blur-md shadow-2xl tracking-wide border border-amber-500/40"
                >
                    {getInstructionText()}
                </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-center gap-16 md:gap-24 mt-16">

                {/* DANH SÁCH DỤNG CỤ LÀM TRANH */}
                <div role="toolbar" aria-label="Bàn dụng cụ làm tranh Làng Sình" className="flex flex-col gap-10 items-center z-20">
                    
                    {/* Bát mực */}
                    <motion.button
                        type="button"
                        whileHover={gameStage === 0 ? { scale: 1.05 } : {}}
                        whileTap={gameStage === 0 ? { scale: 0.95 } : {}}
                        onClick={() => handleSelectTool('ink-brush')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectTool('ink-brush');
                            }
                        }}
                        disabled={gameStage !== 0}
                        aria-label={`Dụng cụ bát mực và cọ quét mực đen. ${gameStage === 0 ? 'Nhấn để cầm cọ' : 'Chưa cần dùng'}`}
                        aria-pressed={activeTool === 'ink-brush'}
                        className={`relative w-36 h-36 flex items-center justify-center transition-all bg-transparent border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-2xl ${
                            gameStage === 0 ? 'cursor-pointer drop-shadow-2xl' : 'opacity-40 grayscale cursor-not-allowed'
                        }`}
                    >
                        <img src="/game/game-langsinh/muc-nhung-moc-ban.png" alt="Bát mực đen truyền thống" className="w-full h-full object-contain" />
                        {activeTool === 'ink-brush' && (
                            <div aria-hidden="true" className="absolute -top-3 -right-3 bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded-md shadow-lg">
                                Đang cầm
                            </div>
                        )}
                    </motion.button>

                    {/* Giấy bản */}
                    <motion.button
                        type="button"
                        whileHover={gameStage === 1 ? { scale: 1.05 } : {}}
                        whileTap={gameStage === 1 ? { scale: 0.95 } : {}}
                        onClick={() => handleSelectTool('paper')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectTool('paper');
                            }
                        }}
                        disabled={gameStage !== 1}
                        aria-label={`Xấp giấy điệp trắng. ${gameStage === 1 ? 'Nhấn để cầm giấy đặt lên mộc bản' : 'Chưa cần dùng'}`}
                        aria-pressed={activeTool === 'paper'}
                        className={`relative w-32 h-44 flex items-center justify-center transition-all bg-transparent border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-2xl ${
                            gameStage === 1 ? 'cursor-pointer drop-shadow-2xl' : 'opacity-40 cursor-not-allowed'
                        }`}
                    >
                        <img src="/game/game-langsinh/buctranh-trang.png" alt="Tờ giấy điệp trắng" className="w-full h-full object-contain" />
                        {activeTool === 'paper' && (
                            <div aria-hidden="true" className="absolute -top-3 -right-3 bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded-md shadow-lg">
                                Đang cầm
                            </div>
                        )}
                    </motion.button>

                    {/* Ống cọ màu */}
                    <motion.button
                        type="button"
                        whileHover={gameStage === 3 ? { scale: 1.05 } : {}}
                        whileTap={gameStage === 3 ? { scale: 0.95 } : {}}
                        onClick={() => handleSelectTool('color-brush')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectTool('color-brush');
                            }
                        }}
                        disabled={gameStage !== 3}
                        aria-label={`Hộp cọ vẽ màu tự nhiên. ${gameStage === 3 ? 'Nhấn để lấy cọ tô màu' : 'Chưa cần dùng'}`}
                        aria-pressed={activeTool === 'color-brush'}
                        className={`relative w-32 h-44 flex items-center justify-center transition-all bg-transparent border-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 rounded-2xl ${
                            gameStage === 3 ? 'cursor-pointer drop-shadow-2xl' : 'opacity-40 grayscale cursor-not-allowed'
                        }`}
                    >
                        <img src="/game/game-langsinh/hop-dung-co-ve.png" alt="Ống đựng cọ màu" className="w-full h-full object-contain" />
                        {activeTool === 'color-brush' && (
                            <div aria-hidden="true" className="absolute -top-3 -right-3 bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded-md shadow-lg">
                                Đang cầm
                            </div>
                        )}
                    </motion.button>
                </div>

                {/* KHU VỰC THAO TÁC: BÀN IN & TRANH */}
                <div className="relative flex items-center justify-center w-[500px] h-[600px] z-10">
                    <AnimatePresence mode="wait">
                        {/* GIAI ĐOẠN 1 & 2: MỘC BẢN VÀ ÉP GIẤY */}
                        {gameStage < 3 && (
                            <motion.div
                                key="woodblock"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                tabIndex={0}
                                role="button"
                                aria-label={
                                    gameStage === 2 
                                        ? `Giấy đang phủ trên mộc bản. Nhấn chuột hoặc phím Enter để vuốt giấy, tiến độ ${rubCount} trên 3 lần`
                                        : woodblockState === 'raw' 
                                        ? "Mộc bản khắc gỗ Làng Sình chưa quét mực. Nhấn để quét mực nếu đang cầm cọ"
                                        : "Mộc bản đã phủ lớp mực đen bóng. Nhấn để đặt giấy lên nếu đang cầm giấy"
                                }
                                onClick={gameStage === 2 ? handleRubbing : handleWoodblockClick}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        if (gameStage === 2) handleRubbing();
                                        else handleWoodblockClick();
                                    }
                                }}
                                whileTap={gameStage === 2 ? { scale: 0.96 } : {}}
                                className={`w-[400px] h-[550px] relative transition-all duration-300 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 ${
                                    (activeTool === 'ink-brush' || activeTool === 'paper' || gameStage === 2) 
                                        ? 'cursor-pointer ring-8 ring-amber-400/50 rounded-2xl bg-black/5' 
                                        : ''
                                }`}
                            >
                                <img
                                    src={woodblockState === 'raw' ? "/game/game-langsinh/moc-ban-chua-to-mau.png" : "/game/game-langsinh/moc-ban-da-nhung-muc.png"}
                                    alt={woodblockState === 'raw' ? "Mộc bản khắc gỗ thô" : "Mộc bản đã quét mực"}
                                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] p-6"
                                />

                                {gameStage === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 z-10 p-2"
                                    >
                                        <img
                                            src="/game/game-langsinh/buctranh-trang.png"
                                            alt="Giấy điệp đang phủ trên mộc bản"
                                            className="w-full h-full object-contain drop-shadow-2xl"
                                        />

                                        <img
                                            src="/game/game-langsinh/buc-tranh-khi-da-nhung.png"
                                            alt={`Nét in hiện ra sau lần vuốt thứ ${rubCount}`}
                                            className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300"
                                            style={{ opacity: rubCount * 0.33 }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* GIAI ĐOẠN 3: BỨC TRANH ĐÃ ĐƯỢC IN VÀ TÔ MÀU */}
                        {gameStage >= 3 && (
                            <motion.div
                                key="painting"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                tabIndex={0}
                                role="button"
                                aria-label={
                                    gameStage === 4 
                                        ? "Bức tranh Làng Sình đã được tô màu hoàn thiện rực rỡ" 
                                        : "Bản in nét đen của tranh Làng Sình. Nhấn để tô màu tự nhiên nếu đang cầm cọ màu"
                                }
                                onClick={handlePaintingClick}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handlePaintingClick();
                                    }
                                }}
                                className={`w-[450px] transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 ${
                                    activeTool === 'color-brush' ? 'cursor-pointer ring-8 ring-amber-400/50 rounded-md' : ''
                                }`}
                            >
                                <img
                                    src={gameStage === 4 ? "/game/game-langsinh/buc-tranh-khi-da-to-mau.png" : "/game/game-langsinh/buc-tranh-khi-da-nhung.png"}
                                    alt={gameStage === 4 ? "Bức tranh Làng Sình hoàn thiện với đầy đủ sắc màu" : "Bản in nét đen chưa tô màu"}
                                    className="w-full h-full object-contain shadow-[0_25px_50px_rgba(0,0,0,0.5)] bg-[#f5efe6]"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}