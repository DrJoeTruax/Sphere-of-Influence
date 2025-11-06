// User preferences management
import type { UserPreferences } from '@/lib/types/experience'

const STORAGE_KEY = 'breakthrough_preferences'

export function savePreferences(preferences: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return

  try {
    const existing = loadPreferences()
    const updated = { ...existing, ...preferences }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save preferences:', error)
  }
}

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return { language: 'en', audio_enabled: false }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load preferences:', error)
  }

  // Default preferences
  return {
    language: 'en',
    audio_enabled: false,
  }
}

export function clearPreferences(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
