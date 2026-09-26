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

    return (
        <div className={`relative w-full h-full min-h-[700px] bg-[#d7c4b1] flex flex-col items-center p-8 select-none rounded-xl overflow-hidden ${activeTool !== 'none' ? 'cursor-none' : 'cursor-default'}`}
             style={{
                 backgroundImage: 'radial-gradient(#a38c75 1.5px, transparent 1.5px)',
                 backgroundSize: '30px 30px'
             }}>

            {activeTool !== 'none' && (
                <div className="fixed pointer-events-none z-50 transition-transform duration-75"
                     style={{
                         left: mousePos.x,
                         top: mousePos.y,
                         transform: 'translate(-20%, -80%)'
                     }}>
                    <img src={getCursorImage()!} alt="tool" className="w-40 h-40 object-contain drop-shadow-2xl" />
                </div>
            )}

            <div className="absolute top-6 left-0 right-0 text-center z-10 pointer-events-none">
                <div className="inline-block bg-black/75 text-white px-8 py-4 rounded-full text-lg md:text-xl font-bold backdrop-blur-md shadow-2xl tracking-wide border border-white/20">
                    {gameStage === 0 && "1. Nhấn bát mực lấy cọ ➔ Quét mực lên mộc bản"}
                    {gameStage === 1 && "2. Nhấn lấy giấy trắng ➔ Đặt lên mộc bản"}
                    {gameStage === 2 && `Vuốt mạnh để giấy thấm mực (click chuột) (${rubCount}/3)`}
                    {gameStage === 3 && "3.Lấy cọ màu để tô bức tranh thôi nào"}
                    {gameStage === 4 && "✨ Tuyệt vời! Bức tranh đã hoàn thiện ✨"}
                </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-center gap-16 md:gap-24 mt-16">

                <div className="flex flex-col gap-12 items-center z-20">
                    <motion.div
                        whileHover={gameStage === 0 ? { scale: 1.05 } : {}}
                        whileTap={gameStage === 0 ? { scale: 0.95 } : {}}
                        onClick={() => handleSelectTool('ink-brush')}
                        className={`relative w-40 h-40 flex items-center justify-center transition-all ${gameStage === 0 ? 'cursor-pointer drop-shadow-2xl' : 'opacity-40 grayscale cursor-not-allowed'}`}>
                        <img src="/game/game-langsinh/muc-nhung-moc-ban.png" alt="Bát mực" className="w-full h-full object-contain" />
                        {activeTool === 'ink-brush' && <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">Đang cầm</div>}
                    </motion.div>

                    <motion.div
                        whileHover={gameStage === 1 ? { scale: 1.05 } : {}}
                        whileTap={gameStage === 1 ? { scale: 0.95 } : {}}
                        onClick={() => handleSelectTool('paper')}
                        className={`relative w-36 h-48 flex items-center justify-center transition-all ${gameStage === 1 ? 'cursor-pointer drop-shadow-2xl' : 'opacity-40 cursor-not-allowed'}`}>
                        <img src="/game/game-langsinh/buctranh-trang.png" alt="Giấy bản" className="w-full h-full object-contain" />
                        {activeTool === 'paper' && <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">Đang cầm</div>}
                    </motion.div>

                    <motion.div
                        whileHover={gameStage === 3 ? { scale: 1.05 } : {}}
                        whileTap={gameStage === 3 ? { scale: 0.95 } : {}}
                        onClick={() => handleSelectTool('color-brush')}
                        className={`relative w-36 h-48 flex items-center justify-center transition-all ${gameStage === 3 ? 'cursor-pointer drop-shadow-2xl' : 'opacity-40 grayscale cursor-not-allowed'}`}>
                        <img src="/game/game-langsinh/hop-dung-co-ve.png" alt="Ống bút màu" className="w-full h-full object-contain" />
                        {activeTool === 'color-brush' && <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">Đang cầm</div>}
                    </motion.div>
                </div>

                <div className="relative flex items-center justify-center w-[500px] h-[600px] z-10">
                    <AnimatePresence mode="wait">
                        {/* TRẠNG THÁI 1: MỘC BẢN & VUỐT GIẤY */}
                        {gameStage < 3 && (
                            <motion.div
                                key="woodblock"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={gameStage === 2 ? handleRubbing : handleWoodblockClick}
                                whileTap={gameStage === 2 ? { scale: 0.96 } : {}}
                                className={`w-[400px] h-[550px] relative transition-all duration-300 flex items-center justify-center ${(activeTool === 'ink-brush' || activeTool === 'paper' || gameStage === 2) ? 'cursor-pointer ring-8 ring-amber-400/50 rounded-2xl bg-black/5' : ''}`}>

                                {/* Ảnh mộc bản */}
                                <img
                                    src={woodblockState === 'raw' ? "/game/game-langsinh/moc-ban-chua-to-mau.png" : "/game/game-langsinh/moc-ban-da-nhung-muc.png"}
                                    alt="Mộc bản"
                                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] p-6"
                                />

                                {/* Tờ giấy đắp lên ghi đè hoàn toàn (Hiện ra khi Stage 2) */}
                                {gameStage === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 z-10 p-2"
                                    >
                                        <img
                                            src="/game/game-langsinh/buctranh-trang.png"
                                            alt="Giấy đang phủ"
                                            className="w-full h-full object-contain drop-shadow-2xl"
                                        />

                                        {/* Nét in đen từ từ hiện ra mỗi lần vuốt */}
                                        <img
                                            src="/game/game-langsinh/buc-tranh-khi-da-nhung.png"
                                            alt="Nét in mờ"
                                            className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-300"
                                            style={{ opacity: rubCount * 0.3 }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* TRẠNG THÁI 2: BỨC TRANH ĐÃ IN XONG VÀ TÔ MÀU */}
                        {gameStage >= 3 && (
                            <motion.div
                                key="painting"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handlePaintingClick}
                                className={`w-[450px] transition-all duration-500 ${activeTool === 'color-brush' ? 'cursor-pointer ring-8 ring-amber-400/50 rounded-md' : ''}`}>
                                <img
                                    src={gameStage === 4 ? "/game/game-langsinh/buc-tranh-khi-da-to-mau.png" : "/game/game-langsinh/buc-tranh-khi-da-nhung.png"}
                                    alt="Bức tranh"
                                    className="w-full h-full object-contain shadow-[0_25px_50px_rgba(0,0,0,0.5)] bg-[#f5efe6]"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}