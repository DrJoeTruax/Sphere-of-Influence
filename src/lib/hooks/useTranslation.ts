import { useState, useEffect } from 'react'
import { t, type LanguageCode, type TranslationKey, detectBrowserLanguage, getLanguage } from '@/lib/i18n/translations'

const STORAGE_KEY = 'breakthrough-language'

/**
 * Hook for using translations in components
 */
export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en')

  useEffect(() => {
    // Load saved language or detect from browser
    const savedLang = localStorage.getItem(STORAGE_KEY) as LanguageCode | null
    const lang = savedLang || detectBrowserLanguage()
    setCurrentLanguage(lang)
  }, [])

  const changeLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang)
    localStorage.setItem(STORAGE_KEY, lang)

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
      const language = getLanguage(lang)
      if (language) {
        document.documentElement.dir = language.direction
      }
    }
  }

  const translate = (key: TranslationKey) => {
    return t(key, currentLanguage)
  }

  return {
    currentLanguage,
    changeLanguage,
    t: translate,
  }
}
