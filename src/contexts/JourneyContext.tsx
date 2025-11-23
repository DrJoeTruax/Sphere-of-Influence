'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type JourneyState = 'LANDING' | 'ENTERING' | 'TRAVERSING' | 'ARRIVED'

interface JourneyContextType {
  state: JourneyState
  setState: (state: JourneyState) => void
  progress: number
  setProgress: (progress: number) => void
  startJourney: () => void
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>('LANDING')
  const [progress, setProgress] = useState(0)

  const startJourney = () => {
    setState('ENTERING')
  }

  return (
    <JourneyContext.Provider value={{ state, setState, progress, setProgress, startJourney }}>
      {children}
    </JourneyContext.Provider>
  )
}

export function useJourney() {
  const context = useContext(JourneyContext)
  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider')
  }
  return context
}
