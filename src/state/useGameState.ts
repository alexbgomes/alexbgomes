import type { Mesh } from 'three'
import { create } from 'zustand'

import type { SkillNode } from '../types/skills'

export type ViewState = 'room' | 'skills' | 'contact' | 'about'

interface GameState {
  view: ViewState
  isLoaded: boolean
  loadingProgress: number
  activeSkillTab: 'professional' | 'personal'
  hoveredSkill: SkillNode | null
  cameraTarget: [number, number, number]
  cameraLookAt: [number, number, number]
  doorPosition: [number, number, number]
  isMuted: boolean
  isMobile: boolean
  outlineMeshes: Mesh[]

  setView: (view: ViewState) => void
  setLoaded: (loaded: boolean) => void
  setLoadingProgress: (progress: number) => void
  setActiveSkillTab: (tab: 'professional' | 'personal') => void
  setHoveredSkill: (skill: SkillNode | null) => void
  setCameraTarget: (target: [number, number, number]) => void
  setCameraLookAt: (lookAt: [number, number, number]) => void
  setIsMuted: (isMuted: boolean) => void
  setIsMobile: (isMobile: boolean) => void
  addOutlineMesh: (mesh: Mesh) => void
  removeOutlineMesh: (mesh: Mesh) => void
}

const isInitialMobile = typeof window !== 'undefined' && window.innerWidth < window.innerHeight

export const useGameState = create<GameState>((set) => ({
  view: 'room',
  isLoaded: false,
  loadingProgress: 0,
  activeSkillTab: 'professional',
  hoveredSkill: null,
  cameraTarget: [0, 2, 6],
  cameraLookAt: [0, 1, 0],
  doorPosition: [0, 2, -5],
  outlineMeshes: [],

  isMuted: true,
  isMobile: isInitialMobile,

  setView: (view) => set({ view }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  setActiveSkillTab: (activeSkillTab) => set({ activeSkillTab }),
  setHoveredSkill: (hoveredSkill) => set({ hoveredSkill }),
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),
  setCameraLookAt: (cameraLookAt) => set({ cameraLookAt }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setIsMobile: (isMobile) => set({ isMobile }),
  addOutlineMesh: (mesh) => set((s) => ({ outlineMeshes: [...s.outlineMeshes, mesh] })),
  removeOutlineMesh: (mesh) => set((s) => ({ outlineMeshes: s.outlineMeshes.filter((m) => m !== mesh) })),
}))