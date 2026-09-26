import { useLanguage, Language } from '@/context/LanguageContext';
import viTranslations from './vi.json';
import enTranslations from './en.json';
import signTranslations from './sign.json';

const translations = {
  vi: viTranslations,
  en: enTranslations,
  sign: signTranslations,
};

type TranslationKey = keyof typeof viTranslations;
type NestedTranslationKey<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${NestedTranslationKey<T[K]>}` : never }[keyof T]
  : never;

type AllTranslationKeys = NestedTranslationKey<typeof viTranslations>;

/**
 * Type-safe translation hook
 * Usage: const t = useTranslation('landing');
 * Access: t('hero_title_1') or t.hero_title_1
 */
export function useTranslation(namespace: TranslationKey) {
  const { language } = useLanguage();
  const currentLang = (language || 'vi') as Language;

  const getTranslation = (key: string): string => {
    const namespaceData = translations[currentLang][namespace] as Record<string, string>;
    return namespaceData[key] || key;
  };

  // Return both function and object for flexible access
  const translationFunction = (key: string) => getTranslation(key);
  const translationObject = translations[currentLang][namespace] as Record<string, string>;

  return Object.assign(translationFunction, translationObject);
}

/**
 * Direct translation access without namespace
 * Usage: const t = useT(); t('landing.hero_title_1')
 */
export function useT() {
  const { language } = useLanguage();
  const currentLang = (language || 'vi') as Language;

  return (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[currentLang];

    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return path;
    }

    return typeof result === 'string' ? result : path;
  };
}
