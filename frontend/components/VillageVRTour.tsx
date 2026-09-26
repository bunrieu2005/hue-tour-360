"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Pannellum } from "pannellum-react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Scene = "vr0" | "vr1" | "vr2";

interface DetailImage {
  src: string;
  title: string;
}

interface GalleryImage extends DetailImage {
  tag: string;
}

export default function VillageVRTour() {
  const [currentScene, setCurrentScene] = useState<Scene>("vr0");
  const [activeDetail, setActiveDetail] = useState<DetailImage | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const sceneImages = {
    vr0: "/tranhlangsinh-img/tranhlangsinh-vr0.jpg",
    vr1: "/tranhlangsinh-img/tranhlangsinh-vr1.png",
    vr2: "/tranhlangsinh-img/tranhlangsinh-vr2.png",
  };

  const tranhSinhGallery: GalleryImage[] = [
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.1.png", title: "Tranh sinh hoạt dân gian 1", tag: "Sinh hoạt dân gian" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.2.png", title: "Tranh sinh hoạt dân gian 2", tag: "Sinh hoạt dân gian" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.4.png", title: "Tranh sinh hoạt dân gian 3", tag: "Sinh hoạt dân gian" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.3.png", title: "Tranh sinh hoạt dân gian 4", tag: "Sinh hoạt dân gian" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.5.png", title: "Tranh sinh hoạt dân gian 5", tag: "Sinh hoạt dân gian" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.6.png", title: "Bộ tranh Bát Âm ", tag: "Bát Âm · hơn 400 năm tuổi" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.7.png", title: "Bộ tranh Bát Âm 2", tag: "Bát Âm · hơn 400 năm tuổi" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.8.png", title: "Bộ tranh Bát Âm 3", tag: "Bát Âm · hơn 400 năm tuổi" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.9.png", title: "Bộ tranh Bát Âm 4", tag: "Bát Âm · hơn 400 năm tuổi" },
    { src: "/tranhlangsinh-img/tranhlangsinh-vr2.1.10.png", title: "Tranh Sinh Hoạt Kết Thúc", tag: "Sinh hoạt dân gian" },
  ];

  const closeGallery = useCallback(() => setGalleryIndex(null), []);
  const showPrev = useCallback(() => {
    setGalleryIndex((i) => (i === null ? null : (i - 1 + tranhSinhGallery.length) % tranhSinhGallery.length));
  }, [tranhSinhGallery.length]);
  const showNext = useCallback(() => {
    setGalleryIndex((i) => (i === null ? null : (i + 1) % tranhSinhGallery.length));
  }, [tranhSinhGallery.length]);

  useEffect(() => {
    if (galleryIndex === null && !activeDetail) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (galleryIndex !== null) closeGallery();
        if (activeDetail) setActiveDetail(null);
      }
      if (galleryIndex !== null) {
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryIndex, activeDetail, closeGallery, showPrev, showNext]);

  const renderScene = () => {
    switch (currentScene) {
      case "vr0":
        return (
          <Pannellum
            id="vr-scene-0"
            width="100%"
            height="100%"
            image={sceneImages.vr0}
            pitch={-5}
            yaw={0}
            hfov={130}
            maxHfov={150}
            minHfov={50}
            autoLoad
            compass={false}
          >
            <Pannellum.Hotspot
              type="custom"
              pitch={-5}
              yaw={5}
              handleClick={() => setCurrentScene("vr1")}
              cssClass="custom-hotspot-with-text hotspot-cong"
            />
          </Pannellum>
        );

      case "vr1":
        return (
          <Pannellum
            id="vr-scene-1"
            width="100%"
            height="100%"
            image={sceneImages.vr1}
            pitch={0}
            yaw={0}
            hfov={130}
            maxHfov={150}
            minHfov={50}
            autoLoad
            compass={false}
          >
            <Pannellum.Hotspot
              type="custom"
              pitch={-2}
              yaw={35}
              handleClick={() => setCurrentScene("vr2")}
              cssClass="custom-hotspot-with-text hotspot-xuong"
            />
          </Pannellum>
        );

      case "vr2":
        return (
          <Pannellum
            id="vr-scene-2"
            width="100%"
            height="100%"
            image={sceneImages.vr2}
            pitch={0}
            yaw={0}
            hfov={130}
            maxHfov={150}
            minHfov={50}
            autoLoad
            compass={false}
          >
            <Pannellum.Hotspot
              type="custom"
              pitch={15}
              yaw={60}
              handleClick={() => setGalleryIndex(0)}
              cssClass="custom-hotspot-with-text hotspot-tranh"
            />
            <Pannellum.Hotspot
              type="custom"
              pitch={-20}
              yaw={-40}
              handleClick={() => setActiveDetail({ src: "/tranhlangsinh-img/tranhlangsinh-vr2.2.png", title: "Gỗ Điêu khắc" })}
              cssClass="custom-hotspot-with-text hotspot-woodcarving"
            />
            <Pannellum.Hotspot
              type="custom"
              pitch={10}
              yaw={-10}
              handleClick={() => setActiveDetail({ src: "/tranhlangsinh-img/tranhlangsinh-vr2.3.png", title: "Lịch 12 con giáp" })}
              cssClass="custom-hotspot-with-text hotspot-zodiaccalendar"
            />
            <Pannellum.Hotspot
              type="custom"
              pitch={5}
              yaw={-25}
              handleClick={() => setActiveDetail({ src: "/tranhlangsinh-img/tranhlangsinh-vr2.4.png", title: "Bách Tuế Đồ" })}
              cssClass="custom-hotspot-with-text hotspot-centuriestexture"
            />
            <Pannellum.Hotspot
              type="custom"
              pitch={0}
              yaw={180}
              handleClick={() => setCurrentScene("vr1")}
              cssClass="custom-hotspot-with-text hotspot-quaylai"
            />
          </Pannellum>
        );

      default:
        return null;
    }
  };

  const activeGalleryImage = galleryIndex !== null ? tranhSinhGallery[galleryIndex] : null;

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {renderScene()}

      {/* Modal xem 1 ảnh chi tiết */}
      <AnimatePresence>
        {activeDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-modal-title"
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full bg-stone-900 rounded-xl overflow-hidden shadow-2xl border border-amber-500/30"
            >
              <button
                onClick={() => setActiveDetail(null)}
                aria-label="Đóng cửa sổ xem chi tiết"
                className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full transition-colors z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <img
                src={activeDetail.src}
                alt={`Chi tiết hiện vật: ${activeDetail.title}`}
                className="w-full h-auto max-h-[70vh] object-contain bg-black"
              />
              <div className="px-5 py-4 bg-gradient-to-t from-stone-900 to-stone-900/80">
                <p id="detail-modal-title" className="text-amber-300 text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {activeDetail.title}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Gallery nhiều ảnh */}
      <AnimatePresence>
        {activeGalleryImage && galleryIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-image-title"
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            {/* Vùng đọc trực tiếp khi đổi ảnh cho NVDA */}
            <div aria-live="polite" className="sr-only">
              Đang xem ảnh {galleryIndex + 1} trên {tranhSinhGallery.length}: {activeGalleryImage.title} ({activeGalleryImage.tag})
            </div>

            <div className="relative w-full max-w-5xl">
              <button
                onClick={closeGallery}
                aria-label="Đóng bộ sưu tập tranh"
                className="absolute -top-2 right-0 md:top-0 md:-right-12 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full transition-colors z-20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <X size={20} aria-hidden="true" />
              </button>

              <div className="relative bg-stone-900 rounded-xl overflow-hidden shadow-2xl border border-amber-500/30">
                {/* Nút Xem Trước */}
                <button
                  onClick={showPrev}
                  aria-label="Xem bức tranh trước đó (hoặc bấm phím Mũi tên Trái)"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-600 text-white p-2 rounded-full transition-colors z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <ChevronLeft size={24} aria-hidden="true" />
                </button>

                {/* Nút Kế Tiếp */}
                <button
                  onClick={showNext}
                  aria-label="Xem bức tranh kế tiếp (hoặc bấm phím Mũi tên Phải)"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-600 text-white p-2 rounded-full transition-colors z-10 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <ChevronRight size={24} aria-hidden="true" />
                </button>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeGalleryImage.src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={activeGalleryImage.src}
                    alt={`Bức tranh: ${activeGalleryImage.title} thuộc dòng ${activeGalleryImage.tag}`}
                    className="w-full h-auto max-h-[60vh] object-contain bg-black mx-auto"
                  />
                </AnimatePresence>

                <div className="px-5 py-4 bg-gradient-to-t from-stone-900 to-stone-900/80 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-amber-500/80">{activeGalleryImage.tag}</p>
                    <p id="gallery-image-title" className="text-amber-300 text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {activeGalleryImage.title}
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-stone-400 text-sm">
                    {galleryIndex + 1} / {tranhSinhGallery.length}
                  </span>
                </div>
              </div>

              {/* Danh sách Thumbnail */}
              <div role="tablist" aria-label="Danh sách các tranh nhỏ để chọn nhanh" className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {tranhSinhGallery.map((img, i) => (
                  <button
                    key={img.src}
                    role="tab"
                    aria-selected={i === galleryIndex}
                    aria-label={`Bức tranh số ${i + 1}: ${img.title}`}
                    onClick={() => setGalleryIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      i === galleryIndex ? "border-amber-500 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img.src} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}