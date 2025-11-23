export interface Language {
  code: string
  name: string
  nativeName: string
  region: string
}

export const LANGUAGES: Language[] = [
  // Major world languages
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', region: 'East Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'East Asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'South Asia' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Global' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Global' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'South Asia' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Eastern Europe' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'East Asia' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'South Asia' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Europe' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', region: 'Southeast Asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'East Asia' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'Global' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'South Asia' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'South Asia' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Middle East' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'South Asia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Southeast Asia' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'South Asia' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Europe' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Southeast Asia' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'South Asia' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Europe' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', region: 'Eastern Europe' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'South Asia' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'South Asia' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'South Asia' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ', region: 'Southeast Asia' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', region: 'Middle East' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Europe' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Southeast Asia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', region: 'Southeast Asia' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', region: 'Southeast Asia' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', region: 'Europe' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', region: 'Europe' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', region: 'Europe' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', region: 'Europe' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', region: 'Europe' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', region: 'Eastern Europe' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', region: 'Europe' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', region: 'Europe' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', region: 'Europe' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', region: 'Europe' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', region: 'Europe' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', region: 'Europe' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: 'Africa' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: 'Africa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', region: 'Africa' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', region: 'Africa' },
]

export interface Translation {
  [key: string]: {
    [key: string]: string
  }
}

export const TRANSLATIONS: Translation = {
  en: {
    heroTitle: '12 of us. 8 billion voices. One choice.',
    heroSubtitle: 'Map your values. Shape AGI.',
    heroDescription: 'You\'re not watching. You\'re deciding. Thousands of people like you are mapping what matters. That shapes how AI learns to care.',
    enterPlatform: 'Map Your Values',
    whyMatters: 'Why This Matters',
    builtOn7Laws: 'Built on 7 Immutable Laws',
    regionalHubs: 'Regional Hubs',
    autonomyScore: 'Autonomy Score',
    concurrentUsers: 'Concurrent Users',
    platformBuiltForScale: 'A Platform Built for Scale',
  },
  es: {
    heroTitle: 'Avance',
    heroSubtitle: 'Una plataforma de coordinación global para el desarrollo de AGI',
    heroDescription: 'Únete a 7 mil millones de personas para construir inteligencia artificial general que respete la autonomía humana.',
    enterPlatform: 'Entrar a la Plataforma',
    whyMatters: 'Por Qué Importa',
    builtOn7Laws: 'Construido sobre 7 Leyes Inmutables',
    regionalHubs: 'Centros Regionales',
    autonomyScore: 'Puntuación de Autonomía',
    concurrentUsers: 'Usuarios Concurrentes',
    platformBuiltForScale: 'Una Plataforma Construida para Escalar',
  },
  zh: {
    heroTitle: '突破',
    heroSubtitle: '全球AGI开发协调平台',
    heroDescription: '与70亿人一起构建尊重人类自主权的通用人工智能。',
    enterPlatform: '进入平台',
    whyMatters: '为什么重要',
    builtOn7Laws: '建立在7条不可变定律之上',
    regionalHubs: '区域中心',
    autonomyScore: '自主性评分',
    concurrentUsers: '并发用户',
    platformBuiltForScale: '为规模而构建的平台',
  },
  hi: {
    heroTitle: 'सफलता',
    heroSubtitle: 'AGI विकास के लिए एक वैश्विक समन्वय मंच',
    heroDescription: '70 अरब लोगों के साथ मानव स्वायत्तता का सम्मान करने वाली कृत्रिम सामान्य बुद्धिमत्ता बनाने में शामिल हों।',
    enterPlatform: 'प्लेटफ़ॉर्म में प्रवेश करें',
    whyMatters: 'यह क्यों मायने रखता है',
    builtOn7Laws: '7 अपरिवर्तनीय नियमों पर निर्मित',
    regionalHubs: 'क्षेत्रीय केंद्र',
    autonomyScore: 'स्वायत्तता स्कोर',
    concurrentUsers: 'समवर्ती उपयोगकर्ता',
    platformBuiltForScale: 'पैमाने के लिए बनाया गया मंच',
  },
  ar: {
    heroTitle: 'اختراق',
    heroSubtitle: 'منصة تنسيق عالمية لتطوير الذكاء الاصطناعي العام',
    heroDescription: 'انضم إلى 7 مليارات شخص في بناء ذكاء اصطناعي عام يحترم استقلالية الإنسان.',
    enterPlatform: 'ادخل المنصة',
    whyMatters: 'لماذا هذا مهم',
    builtOn7Laws: 'مبني على 7 قوانين ثابتة',
    regionalHubs: 'المراكز الإقليمية',
    autonomyScore: 'درجة الاستقلالية',
    concurrentUsers: 'المستخدمون المتزامنون',
    platformBuiltForScale: 'منصة مبنية للتوسع',
  },
  pt: {
    heroTitle: 'Avanço',
    heroSubtitle: 'Uma plataforma de coordenação global para desenvolvimento de AGI',
    heroDescription: 'Junte-se a 7 bilhões de pessoas na construção de inteligência artificial geral que respeita a autonomia humana.',
    enterPlatform: 'Entrar na Plataforma',
    whyMatters: 'Por Que Importa',
    builtOn7Laws: 'Construído em 7 Leis Imutáveis',
    regionalHubs: 'Centros Regionais',
    autonomyScore: 'Pontuação de Autonomia',
    concurrentUsers: 'Usuários Simultâneos',
    platformBuiltForScale: 'Uma Plataforma Construída para Escalar',
  },
  fr: {
    heroTitle: 'Percée',
    heroSubtitle: 'Une plateforme de coordination mondiale pour le développement de l\'AGI',
    heroDescription: 'Rejoignez 7 milliards de personnes pour construire une intelligence artificielle générale qui respecte l\'autonomie humaine.',
    enterPlatform: 'Entrer dans la Plateforme',
    whyMatters: 'Pourquoi C\'est Important',
    builtOn7Laws: 'Construit sur 7 Lois Immuables',
    regionalHubs: 'Centres Régionaux',
    autonomyScore: 'Score d\'Autonomie',
    concurrentUsers: 'Utilisateurs Simultanés',
    platformBuiltForScale: 'Une Plateforme Construite pour l\'Échelle',
  },
  de: {
    heroTitle: 'Durchbruch',
    heroSubtitle: 'Eine globale Koordinationsplattform für AGI-Entwicklung',
    heroDescription: 'Schließen Sie sich 7 Milliarden Menschen an, um künstliche allgemeine Intelligenz zu entwickeln, die die menschliche Autonomie respektiert.',
    enterPlatform: 'Plattform Betreten',
    whyMatters: 'Warum Es Wichtig Ist',
    builtOn7Laws: 'Aufgebaut auf 7 Unveränderlichen Gesetzen',
    regionalHubs: 'Regionale Zentren',
    autonomyScore: 'Autonomie-Score',
    concurrentUsers: 'Gleichzeitige Benutzer',
    platformBuiltForScale: 'Eine Plattform für Skalierung',
  },
  ja: {
    heroTitle: 'ブレークスルー',
    heroSubtitle: 'AGI開発のためのグローバル調整プラットフォーム',
    heroDescription: '人間の自律性を尊重する汎用人工知能の構築に70億人と共に参加しましょう。',
    enterPlatform: 'プラットフォームに入る',
    whyMatters: 'なぜ重要か',
    builtOn7Laws: '7つの不変の法則の上に構築',
    regionalHubs: '地域ハブ',
    autonomyScore: '自律性スコア',
    concurrentUsers: '同時ユーザー',
    platformBuiltForScale: 'スケールのために構築されたプラットフォーム',
  },
  ru: {
    heroTitle: 'Прорыв',
    heroSubtitle: 'Глобальная платформа координации для разработки AGI',
    heroDescription: 'Присоединяйтесь к 7 миллиардам людей в создании общего искусственного интеллекта, уважающего человеческую автономию.',
    enterPlatform: 'Войти на Платформу',
    whyMatters: 'Почему Это Важно',
    builtOn7Laws: 'Построено на 7 Неизменных Законах',
    regionalHubs: 'Региональные Центры',
    autonomyScore: 'Оценка Автономии',
    concurrentUsers: 'Одновременные Пользователи',
    platformBuiltForScale: 'Платформа, Построенная для Масштабирования',
  },
  ko: {
    heroTitle: '돌파구',
    heroSubtitle: 'AGI 개발을 위한 글로벌 조정 플랫폼',
    heroDescription: '인간 자율성을 존중하는 범용 인공지능 구축에 70억 명과 함께 참여하세요.',
    enterPlatform: '플랫폼 입장',
    whyMatters: '왜 중요한가',
    builtOn7Laws: '7가지 불변의 법칙 위에 구축',
    regionalHubs: '지역 허브',
    autonomyScore: '자율성 점수',
    concurrentUsers: '동시 사용자',
    platformBuiltForScale: '확장을 위해 구축된 플랫폼',
  },
}

/**
 * Detects the user's preferred language based on browser settings
 * Falls back to English if detection fails or language not supported
 */
export function detectUserLanguage(): string {
  if (typeof window === 'undefined') return 'en'

  // Try to get language from localStorage first
  const stored = localStorage.getItem('breakthrough_language')
  if (stored && LANGUAGES.some(lang => lang.code === stored)) {
    return stored
  }

  // Get browser language
  const browserLang = navigator.language || (navigator as any).userLanguage || 'en'

  // Try exact match first
  if (LANGUAGES.some(lang => lang.code === browserLang)) {
    return browserLang
  }

  // Try matching just the language code (e.g., 'en' from 'en-US')
  const langCode = browserLang.split('-')[0]
  const match = LANGUAGES.find(lang => lang.code === langCode)

  return match ? match.code : 'en'
}

/**
 * Gets translation for a key in the specified language
 * Falls back to English if translation not found
 */
export function translate(key: string, lang: string): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key
}
