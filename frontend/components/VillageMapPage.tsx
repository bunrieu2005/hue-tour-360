'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Map as MapIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/locales';
import { canAccessVillageMap, type VillageMap } from '@/data/villageMaps';

interface VillageMapPageProps {
    map: VillageMap;
}

export default function VillageMapPage({ map }: VillageMapPageProps) {
    const { language } = useLanguage();
    const t = useTranslation('map');
    const [frameStatus, setFrameStatus] = useState<
        'loading' | 'ready' | 'error' | 'webgl-error'
    >('loading');
    const [retryKey, setRetryKey] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const readinessTimer = useRef<number | null>(null);
    const langKey = language === 'en' ? 'en' : 'vi';
    const hasMap = canAccessVillageMap(map);

    useEffect(() => {
        return () => {
            if (readinessTimer.current !== null) {
                window.clearTimeout(readinessTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!hasMap) return;

        const loadingTimeout = window.setTimeout(() => {
            setFrameStatus((current) =>
                current === 'loading' ? 'error' : current
            );
        }, 30_000);

        return () => window.clearTimeout(loadingTimeout);
    }, [hasMap, retryKey]);

    const handleFrameLoad = useCallback(() => {
        const checkReadiness = (deadline: number) => {
            const mapDocument = iframeRef.current?.contentDocument;
            const app = mapDocument?.getElementById('app');
            const loadingScreen = mapDocument?.getElementById('loading-screen');

            if (!app || !loadingScreen) {
                setFrameStatus('error');
                return;
            }

            if (app.dataset.mapStatus === 'webgl-error') {
                setFrameStatus('webgl-error');
                return;
            }

            if (app.dataset.mapStatus === 'error') {
                setFrameStatus('error');
                return;
            }

            if (loadingScreen.classList.contains('hidden')) {
                setFrameStatus('ready');
                return;
            }

            if (Date.now() >= deadline) {
                setFrameStatus('error');
                return;
            }

            readinessTimer.current = window.setTimeout(
                () => checkReadiness(deadline),
                250
            );
        };

        if (readinessTimer.current !== null) {
            window.clearTimeout(readinessTimer.current);
        }
        setFrameStatus('loading');
        checkReadiness(Date.now() + 30_000);
    }, []);

    const retryLoading = () => {
        if (readinessTimer.current !== null) {
            window.clearTimeout(readinessTimer.current);
        }
        setFrameStatus('loading');
        setRetryKey((current) => current + 1);
    };

    return (
        <main className="fixed inset-0 z-[60] flex min-h-0 flex-col overflow-hidden bg-[#0E0602] text-white">
            <Navbar currentPage="map" />

            <header className="z-10 flex shrink-0 flex-col gap-3 px-4 pb-3 pt-24 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <MapIcon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-amber-400"
                    />
                    <h1 className="truncate text-lg font-bold text-amber-100 sm:text-xl">
                        {map.name[langKey]}
                    </h1>
                </div>
                <nav aria-label={t('page_navigation')} className="flex gap-2">
                    <Link
                        href="/home"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-stone-900 px-3 text-xs font-semibold text-amber-100 transition-colors hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                        <span>{t('back')}</span>
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 text-xs font-bold text-stone-950 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                        <Home aria-hidden="true" className="h-4 w-4" />
                        <span>{t('home')}</span>
                    </Link>
                </nav>
            </header>

            {hasMap ? (
                <section
                    aria-label={`${t('frame_title')}: ${map.name[langKey]}`}
                    className="relative flex min-h-0 flex-1 flex-col"
                >
                    <iframe
                        key={retryKey}
                        ref={iframeRef}
                        src={map.path}
                        title={`${t('frame_title')}: ${map.name[langKey]}`}
                        onLoad={handleFrameLoad}
                        onError={() => setFrameStatus('error')}
                        className="h-full min-h-0 w-full flex-1 border-0"
                    />

                    {frameStatus !== 'ready' && (
                        <div
                            className="absolute inset-0 z-10 flex items-center justify-center bg-[#0E0602]/95 p-6 text-center"
                            role={
                                frameStatus === 'error' ||
                                frameStatus === 'webgl-error'
                                    ? 'alert'
                                    : 'status'
                            }
                            aria-live="polite"
                        >
                            <div className="max-w-sm">
                                {frameStatus === 'loading' ? (
                                    <>
                                        <div
                                            aria-hidden="true"
                                            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"
                                        />
                                        <p className="text-sm font-medium text-amber-100">
                                            {t('loading')}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mb-4 text-sm text-amber-100">
                                            {frameStatus === 'webgl-error'
                                                ? t('webgl_error')
                                                : t('error')}
                                        </p>
                                        {frameStatus === 'webgl-error' && (
                                            <p className="mb-4 text-xs leading-relaxed text-stone-300">
                                                {t('webgl_error_description')}
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={retryLoading}
                                            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                                        >
                                            {t('retry')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                <section
                    role="status"
                    className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center"
                >
                    <MapIcon
                        aria-hidden="true"
                        className="mb-4 h-12 w-12 text-amber-500"
                    />
                    <h2 className="mb-2 text-xl font-bold text-amber-100">
                        {t('developing')}
                    </h2>
                    <p className="max-w-md text-sm text-stone-300">
                        {t('developing_description')}
                    </p>
                </section>
            )}
        </main>
    );
}
