import type { SkillTreeTab } from '../types/skills'

const BIRTHDAY = new Date(1999, 2, 26)
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000

/**
 * Level is based on how many years old I am.
 */
export function getLevel(): number {
  const now = new Date()
  return Math.floor((now.getTime() - BIRTHDAY.getTime()) / MS_PER_YEAR)
}

export function getSkillPoints(trees: SkillTreeTab[]): number {
  return trees.reduce(
    (total, tab) =>
      total +
      tab.islands.reduce(
        (islandTotal, island) => islandTotal + island.nodes.length,
        0,
      ),
    0,
  )
}
