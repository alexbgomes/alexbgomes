import { create } from 'zustand'

type ViewState = 'character' | 'contact'

interface GameState {
  view: ViewState
  setView: (view: ViewState) => void
}

export const useGameState = create<GameState>((set) => ({
  view: 'character',
  setView: (view) => set({ view }),
}))