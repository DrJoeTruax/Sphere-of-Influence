// Types for the user experience flow

export type EntryState = 'loading' | 'opening' | 'entering' | 'hub_selection' | 'role_selection' | 'complete'

export type Language = {
  code: string
  name: string
  nativeName: string
  direction?: 'ltr' | 'rtl' // For Arabic, Hebrew support
}

export type Hub = {
  id: string
  slug: string
  name: string
  description: string | null
  language_codes: string[]
  position_3d: { x: number; y: number; z: number } | null
  active_contributors: number
  created_at: string
}

export type UserRole = 'spectator' | 'builder'

export type UserPreferences = {
  language: string
  selectedHub?: string
  role?: UserRole
  audio_enabled?: boolean
}

// Constants
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr' },
]

export const CORE_MESSAGE = {
  en: [
    'This is not a game.',
    'This is a human collaboration experiment.',
    'The largest ever.',
    'This is HOPE.',
  ],
  es: [
    'Esto no es un juego.',
    'Este es un experimento de colaboración humana.',
    'El más grande jamás.',
    'Esto es ESPERANZA.',
  ],
  // Add more translations as needed
}
