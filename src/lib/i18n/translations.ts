/**
 * Translation system for the Breakthrough Platform
 * Supports 12 languages: EN, ES, ZH, HI, AR, FR, RU, PT, DE, JA, KO, IT
 */

export type LanguageCode = 'en' | 'es' | 'zh' | 'hi' | 'ar' | 'fr' | 'ru' | 'pt' | 'de' | 'ja' | 'ko' | 'it'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr' },
]

export type TranslationKey =
  | 'common.welcome'
  | 'common.loading'
  | 'common.error'
  | 'common.submit'
  | 'common.cancel'
  | 'common.continue'
  | 'common.back'
  | 'nav.home'
  | 'nav.forum'
  | 'nav.proposals'
  | 'entry.title'
  | 'entry.message'
  | 'forum.title'
  | 'forum.vote'
  | 'forum.votedFor'
  | 'forum.votedAgainst'
  | 'forum.votedAbstain'
  | 'proposal.category'
  | 'proposal.status'
  | 'proposal.consensus'
  | 'celebration.consensusReached'
  | 'celebration.communitySpoken'

type Translations = Record<LanguageCode, Record<TranslationKey, string>>

export const translations: Translations = {
  en: {
    'common.welcome': 'Welcome',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'nav.home': 'Home',
    'nav.forum': 'Forum',
    'nav.proposals': 'Proposals',
    'entry.title': 'This is not a game.',
    'entry.message': 'This is a human collaboration experiment. The largest ever.',
    'forum.title': 'Builder Forum',
    'forum.vote': 'Vote',
    'forum.votedFor': 'You voted: FOR',
    'forum.votedAgainst': 'You voted: AGAINST',
    'forum.votedAbstain': 'You voted: ABSTAIN',
    'proposal.category': 'Category',
    'proposal.status': 'Status',
    'proposal.consensus': 'Consensus',
    'celebration.consensusReached': 'Consensus Reached!',
    'celebration.communitySpoken': 'The community has spoken',
  },
  es: {
    'common.welcome': 'Bienvenido',
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.submit': 'Enviar',
    'common.cancel': 'Cancelar',
    'common.continue': 'Continuar',
    'common.back': 'Volver',
    'nav.home': 'Inicio',
    'nav.forum': 'Foro',
    'nav.proposals': 'Propuestas',
    'entry.title': 'Esto no es un juego.',
    'entry.message': 'Este es un experimento de colaboración humana. El más grande jamás.',
    'forum.title': 'Foro de Constructores',
    'forum.vote': 'Votar',
    'forum.votedFor': 'Votaste: A FAVOR',
    'forum.votedAgainst': 'Votaste: EN CONTRA',
    'forum.votedAbstain': 'Votaste: ABSTENCIÓN',
    'proposal.category': 'Categoría',
    'proposal.status': 'Estado',
    'proposal.consensus': 'Consenso',
    'celebration.consensusReached': '¡Consenso Alcanzado!',
    'celebration.communitySpoken': 'La comunidad ha hablado',
  },
  zh: {
    'common.welcome': '欢迎',
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.submit': '提交',
    'common.cancel': '取消',
    'common.continue': '继续',
    'common.back': '返回',
    'nav.home': '首页',
    'nav.forum': '论坛',
    'nav.proposals': '提案',
    'entry.title': '这不是游戏。',
    'entry.message': '这是人类协作实验。史上最大规模。',
    'forum.title': '建设者论坛',
    'forum.vote': '投票',
    'forum.votedFor': '您投票：赞成',
    'forum.votedAgainst': '您投票：反对',
    'forum.votedAbstain': '您投票：弃权',
    'proposal.category': '类别',
    'proposal.status': '状态',
    'proposal.consensus': '共识',
    'celebration.consensusReached': '达成共识！',
    'celebration.communitySpoken': '社区已表态',
  },
  hi: {
    'common.welcome': 'स्वागत है',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'एक त्रुटि हुई',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.continue': 'जारी रखें',
    'common.back': 'वापस',
    'nav.home': 'होम',
    'nav.forum': 'मंच',
    'nav.proposals': 'प्रस्ताव',
    'entry.title': 'यह कोई खेल नहीं है।',
    'entry.message': 'यह एक मानव सहयोग प्रयोग है। अब तक का सबसे बड़ा।',
    'forum.title': 'बिल्डर मंच',
    'forum.vote': 'मतदान',
    'forum.votedFor': 'आपने मतदान किया: पक्ष में',
    'forum.votedAgainst': 'आपने मतदान किया: विपक्ष में',
    'forum.votedAbstain': 'आपने मतदान किया: अनुपस्थित',
    'proposal.category': 'श्रेणी',
    'proposal.status': 'स्थिति',
    'proposal.consensus': 'सहमति',
    'celebration.consensusReached': 'सहमति प्राप्त!',
    'celebration.communitySpoken': 'समुदाय ने बोला है',
  },
  ar: {
    'common.welcome': 'مرحباً',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.submit': 'إرسال',
    'common.cancel': 'إلغاء',
    'common.continue': 'متابعة',
    'common.back': 'رجوع',
    'nav.home': 'الرئيسية',
    'nav.forum': 'المنتدى',
    'nav.proposals': 'المقترحات',
    'entry.title': 'هذه ليست لعبة.',
    'entry.message': 'هذه تجربة تعاون بشري. الأكبر على الإطلاق.',
    'forum.title': 'منتدى البناة',
    'forum.vote': 'تصويت',
    'forum.votedFor': 'صوتت: مع',
    'forum.votedAgainst': 'صوتت: ضد',
    'forum.votedAbstain': 'صوتت: امتناع',
    'proposal.category': 'الفئة',
    'proposal.status': 'الحالة',
    'proposal.consensus': 'الإجماع',
    'celebration.consensusReached': 'تم التوصل إلى إجماع!',
    'celebration.communitySpoken': 'المجتمع قد تكلم',
  },
  fr: {
    'common.welcome': 'Bienvenue',
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.submit': 'Soumettre',
    'common.cancel': 'Annuler',
    'common.continue': 'Continuer',
    'common.back': 'Retour',
    'nav.home': 'Accueil',
    'nav.forum': 'Forum',
    'nav.proposals': 'Propositions',
    'entry.title': 'Ce n\'est pas un jeu.',
    'entry.message': 'C\'est une expérience de collaboration humaine. La plus grande jamais réalisée.',
    'forum.title': 'Forum des Bâtisseurs',
    'forum.vote': 'Voter',
    'forum.votedFor': 'Vous avez voté: POUR',
    'forum.votedAgainst': 'Vous avez voté: CONTRE',
    'forum.votedAbstain': 'Vous avez voté: ABSTENTION',
    'proposal.category': 'Catégorie',
    'proposal.status': 'Statut',
    'proposal.consensus': 'Consensus',
    'celebration.consensusReached': 'Consensus Atteint!',
    'celebration.communitySpoken': 'La communauté s\'est exprimée',
  },
  ru: {
    'common.welcome': 'Добро пожаловать',
    'common.loading': 'Загрузка...',
    'common.error': 'Произошла ошибка',
    'common.submit': 'Отправить',
    'common.cancel': 'Отмена',
    'common.continue': 'Продолжить',
    'common.back': 'Назад',
    'nav.home': 'Главная',
    'nav.forum': 'Форум',
    'nav.proposals': 'Предложения',
    'entry.title': 'Это не игра.',
    'entry.message': 'Это эксперимент человеческого сотрудничества. Самый большой за всё время.',
    'forum.title': 'Форум Строителей',
    'forum.vote': 'Голосовать',
    'forum.votedFor': 'Вы проголосовали: ЗА',
    'forum.votedAgainst': 'Вы проголосовали: ПРОТИВ',
    'forum.votedAbstain': 'Вы проголосовали: ВОЗДЕРЖАЛСЯ',
    'proposal.category': 'Категория',
    'proposal.status': 'Статус',
    'proposal.consensus': 'Консенсус',
    'celebration.consensusReached': 'Консенсус Достигнут!',
    'celebration.communitySpoken': 'Сообщество высказалось',
  },
  pt: {
    'common.welcome': 'Bem-vindo',
    'common.loading': 'Carregando...',
    'common.error': 'Ocorreu um erro',
    'common.submit': 'Enviar',
    'common.cancel': 'Cancelar',
    'common.continue': 'Continuar',
    'common.back': 'Voltar',
    'nav.home': 'Início',
    'nav.forum': 'Fórum',
    'nav.proposals': 'Propostas',
    'entry.title': 'Isto não é um jogo.',
    'entry.message': 'Esta é uma experiência de colaboração humana. A maior de sempre.',
    'forum.title': 'Fórum de Construtores',
    'forum.vote': 'Votar',
    'forum.votedFor': 'Você votou: A FAVOR',
    'forum.votedAgainst': 'Você votou: CONTRA',
    'forum.votedAbstain': 'Você votou: ABSTENÇÃO',
    'proposal.category': 'Categoria',
    'proposal.status': 'Status',
    'proposal.consensus': 'Consenso',
    'celebration.consensusReached': 'Consenso Alcançado!',
    'celebration.communitySpoken': 'A comunidade falou',
  },
  de: {
    'common.welcome': 'Willkommen',
    'common.loading': 'Wird geladen...',
    'common.error': 'Ein Fehler ist aufgetreten',
    'common.submit': 'Absenden',
    'common.cancel': 'Abbrechen',
    'common.continue': 'Weiter',
    'common.back': 'Zurück',
    'nav.home': 'Startseite',
    'nav.forum': 'Forum',
    'nav.proposals': 'Vorschläge',
    'entry.title': 'Dies ist kein Spiel.',
    'entry.message': 'Dies ist ein menschliches Zusammenarbeitsexperiment. Das größte aller Zeiten.',
    'forum.title': 'Erbauer-Forum',
    'forum.vote': 'Abstimmen',
    'forum.votedFor': 'Sie haben abgestimmt: DAFÜR',
    'forum.votedAgainst': 'Sie haben abgestimmt: DAGEGEN',
    'forum.votedAbstain': 'Sie haben abgestimmt: ENTHALTUNG',
    'proposal.category': 'Kategorie',
    'proposal.status': 'Status',
    'proposal.consensus': 'Konsens',
    'celebration.consensusReached': 'Konsens Erreicht!',
    'celebration.communitySpoken': 'Die Gemeinschaft hat gesprochen',
  },
  ja: {
    'common.welcome': 'ようこそ',
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.submit': '送信',
    'common.cancel': 'キャンセル',
    'common.continue': '続ける',
    'common.back': '戻る',
    'nav.home': 'ホーム',
    'nav.forum': 'フォーラム',
    'nav.proposals': '提案',
    'entry.title': 'これはゲームではありません。',
    'entry.message': 'これは人類協力実験です。史上最大の。',
    'forum.title': 'ビルダーフォーラム',
    'forum.vote': '投票',
    'forum.votedFor': '投票しました: 賛成',
    'forum.votedAgainst': '投票しました: 反対',
    'forum.votedAbstain': '投票しました: 棄権',
    'proposal.category': 'カテゴリー',
    'proposal.status': 'ステータス',
    'proposal.consensus': 'コンセンサス',
    'celebration.consensusReached': 'コンセンサス達成！',
    'celebration.communitySpoken': 'コミュニティが語りました',
  },
  ko: {
    'common.welcome': '환영합니다',
    'common.loading': '로딩 중...',
    'common.error': '오류가 발생했습니다',
    'common.submit': '제출',
    'common.cancel': '취소',
    'common.continue': '계속',
    'common.back': '뒤로',
    'nav.home': '홈',
    'nav.forum': '포럼',
    'nav.proposals': '제안',
    'entry.title': '이것은 게임이 아닙니다.',
    'entry.message': '이것은 인류 협력 실험입니다. 역대 최대 규모입니다.',
    'forum.title': '빌더 포럼',
    'forum.vote': '투표',
    'forum.votedFor': '투표했습니다: 찬성',
    'forum.votedAgainst': '투표했습니다: 반대',
    'forum.votedAbstain': '투표했습니다: 기권',
    'proposal.category': '카테고리',
    'proposal.status': '상태',
    'proposal.consensus': '합의',
    'celebration.consensusReached': '합의 도달!',
    'celebration.communitySpoken': '커뮤니티가 말했습니다',
  },
  it: {
    'common.welcome': 'Benvenuto',
    'common.loading': 'Caricamento...',
    'common.error': 'Si è verificato un errore',
    'common.submit': 'Invia',
    'common.cancel': 'Annulla',
    'common.continue': 'Continua',
    'common.back': 'Indietro',
    'nav.home': 'Home',
    'nav.forum': 'Forum',
    'nav.proposals': 'Proposte',
    'entry.title': 'Questo non è un gioco.',
    'entry.message': 'Questo è un esperimento di collaborazione umana. Il più grande mai realizzato.',
    'forum.title': 'Forum dei Costruttori',
    'forum.vote': 'Vota',
    'forum.votedFor': 'Hai votato: A FAVORE',
    'forum.votedAgainst': 'Hai votato: CONTRO',
    'forum.votedAbstain': 'Hai votato: ASTENUTO',
    'proposal.category': 'Categoria',
    'proposal.status': 'Stato',
    'proposal.consensus': 'Consenso',
    'celebration.consensusReached': 'Consenso Raggiunto!',
    'celebration.communitySpoken': 'La comunità ha parlato',
  },
}

/**
 * Get translation for a key in a specific language
 */
export function t(key: TranslationKey, lang: LanguageCode = 'en'): string {
  return translations[lang]?.[key] || translations['en'][key] || key
}

/**
 * Get language by code
 */
export function getLanguage(code: LanguageCode): Language | undefined {
  return LANGUAGES.find(lang => lang.code === code)
}

/**
 * Detect user's browser language
 */
export function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return 'en'

  const browserLang = navigator.language.split('-')[0] as string
  const supportedLang = LANGUAGES.find(lang => lang.code === browserLang)

  return supportedLang ? supportedLang.code : 'en'
}
