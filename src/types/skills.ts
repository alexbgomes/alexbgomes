export type SkillNodeType = 'root' | 'category' | 'skill' | 'keystone'

export interface SkillNode {
  id: string
  special?: string | null // custom html tag for special effects
  label: string
  description: string
  icon: string // can be emoji or path to icon
  image?: string
  type: SkillNodeType
  children: string[]
}

export interface SkillIsland {
  id: string
  label: string
  nodes: SkillNode[]
  position: { x: number; y: number }
  layout?: 'radial' | 'linear-h'
}

export interface SkillTreeTab {
  id: 'professional' | 'personal'
  label: string
  islands: SkillIsland[]
}
