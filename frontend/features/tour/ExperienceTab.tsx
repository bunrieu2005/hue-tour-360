import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Import các Activity của bạn vào đây
import PaintingActivity from "@/features/activities/PaintingActivity";
// import SequencingActivity from "@/features/activities/SequencingActivity";
// ...

interface ExperienceTabProps {
    village: any;
    villageId: string;
    lang: "vi" | "en";
    copy: any;
    currentStep: number;
    setCurrentStep: (step: number) => void;
    isActivityDone: boolean;
    sceneColor: string;
}

export default function ExperienceTab({
                                          village,
                                          villageId,
                                          lang,
                                          copy,
                                          currentStep,
                                          setCurrentStep,
                                          isActivityDone,
                                          sceneColor
                                      }: ExperienceTabProps) {
    const router = useRouter();

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    className="flex flex-col lg:flex-row gap-6">

            {/* CỘT TRÁI: Danh sách Quy trình (Chiếm 1/3) */}
            <div className="w-full lg:w-1/3 space-y-4">
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {village.process.title[lang]}
                </h3>
                <div className="space-y-3">
                    {village.process.steps[lang].map((step: string, i: number) => {
                        const isActive = currentStep === i;
                        const isPassed = currentStep > i;

                        return (
                            <motion.div key={i}
                                        className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-300 ${
                                            isActive ? "bg-white shadow-md border-l-4" :
                                                isPassed ? "opacity-60 bg-black/5" : "bg-black/5"
                                        }`}
                                        style={{
                                            borderLeftColor: isActive ? sceneColor : "transparent",
                                            transform: isActive ? "scale(1.02)" : "scale(1)"
                                        }}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                    isActive || isPassed ? "text-white" : "text-gray-500 bg-gray-200"
                                }`} style={{ background: isActive || isPassed ? sceneColor : "" }}>
                                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <p className={`text-sm pt-0.5 leading-snug ${isActive ? "font-semibold text-gray-900" : "text-gray-600"}`}
                                   style={{ fontFamily: "'Lora', serif" }}>
                                    {step}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* CỘT PHẢI: Bàn làm việc / Mini-game (Chiếm 2/3) */}
            <div className="w-full lg:w-2/3">
                <div className="rounded-2xl border h-full min-h-[500px] overflow-hidden relative shadow-inner bg-[#eaddcf]"
                     style={{ borderColor: "var(--border)" }}>

                    {/* Render Activity tương ứng với làng */}
                    {village.activity.type === "painting" && (
                        <PaintingActivity
                            currentStep={currentStep}
                            onStepChange={setCurrentStep} onComplete={function (): void {
                            throw new Error("Function not implemented.");
                        }}                        />
                    )}
                    {/* Thêm logic cho các type khác: sequencing, incense, v.v. */}

                    {/* Màn hình Overlay chúc mừng khi làm xong */}
                    {isActivityDone && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50">
                            <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                            <h4 className="text-2xl font-bold text-green-900 mb-2">{copy.done}</h4>
                            <p className="text-green-700 text-center mb-6">{copy.quizHint}</p>
                            <Button onClick={() => router.push(`/quiz/${villageId}`)}
                                    className="w-full max-w-xs py-6 text-white font-semibold rounded-xl"
                                    style={{ background: "linear-gradient(135deg, #1A7A30, #2AAA50)" }}>
                                {copy.quiz} →
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}