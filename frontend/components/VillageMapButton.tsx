'use client';

import Link from 'next/link';
import { Map as MapIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/locales';
import { canAccessVillageMap, villageMaps } from '@/data/villageMaps';

interface VillageMapButtonProps {
    villageId: string;
    villageName: string;
}

const buttonClassName =
    'flex min-h-11 flex-1 min-w-[45%] xl:min-w-0 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-center text-[11px] sm:text-xs font-bold transition-colors';

export default function VillageMapButton({
    villageId,
    villageName,
}: VillageMapButtonProps) {
    const { language } = useLanguage();
    const t = useTranslation('map');
    const isAvailable = canAccessVillageMap(villageMaps[villageId]);

    if (!isAvailable) {
        return (
            <button
                type="button"
                disabled
                title={t('coming_soon')}
                aria-label={`${t('coming_soon')}: ${villageName}`}
                className={`${buttonClassName} cursor-not-allowed border-white/10 bg-stone-900/60 text-stone-500`}
            >
                <MapIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="leading-tight">
                    {language === 'en'
                        ? `${t('button')} · ${t('coming_soon')}`
                        : language === 'sign'
                          ? t('coming_soon_sign')
                          : `${t('button')} · ${t('coming_soon')}`}
                </span>
            </button>
        );
    }

    return (
        <Link
            href={`/map/${villageId}`}
            title={`${t('button')}: ${villageName}`}
            aria-label={`${t('button')}: ${villageName}`}
            className={`${buttonClassName} cursor-pointer border-amber-500/50 bg-stone-900 text-amber-300 shadow-lg hover:bg-stone-800 hover:text-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400`}
        >
            <MapIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span>{t('button')}</span>
        </Link>
    );
}
