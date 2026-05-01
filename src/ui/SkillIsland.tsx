import { useMemo } from 'react'

import type { SkillIsland as IslandData } from '../types/skills'

import SkillNode from './SkillNode'

/** Radius of each concentric ring around the island root */
const RING_RADIUS = [0, 110, 190, 260, 320]

interface NodePosition {
  id: string
  x: number
  y: number
}

/**
 * Compute radial positions for every node in an island,
 * starting from the root outward via BFS.
 */
function computeLayout(island: IslandData): NodePosition[] {
  const cx = island.position.x
  const cy = island.position.y
  const nodeMap = new Map(island.nodes.map((n) => [n.id, n]))
  const root = island.nodes.find((n) => n.type === 'root')
  if (!root) return []

  const positions: NodePosition[] = [{ id: root.id, x: cx, y: cy }]

  interface QueueItem {
    id: string
    depth: number
    angleStart: number
    angleEnd: number
  }

  const queue: QueueItem[] = [
    { id: root.id, depth: 0, angleStart: 0, angleEnd: Math.PI * 2 },
  ]

  while (queue.length > 0) {
    const item = queue.shift()!
    const node = nodeMap.get(item.id)
    if (!node) continue

    const children = node.children.filter((cid) => nodeMap.has(cid))
    if (children.length === 0) continue

    const nextDepth = item.depth + 1
    const radius =
      nextDepth < RING_RADIUS.length
        ? RING_RADIUS[nextDepth]
        : RING_RADIUS[RING_RADIUS.length - 1] + 60 * (nextDepth - RING_RADIUS.length + 1)

    const angleStep = (item.angleEnd - item.angleStart) / children.length

    children.forEach((childId, i) => {
      const angle = item.angleStart + angleStep * (i + 0.5)
      const x = cx + radius * Math.cos(angle - Math.PI / 2)
      const y = cy + radius * Math.sin(angle - Math.PI / 2)

      positions.push({ id: childId, x, y })

      const spread = angleStep * 0.85
      queue.push({
        id: childId,
        depth: nextDepth,
        angleStart: angle - spread / 2,
        angleEnd: angle + spread / 2,
      })
    })
  }

  return positions
}

/**
 * Compute positions for a linear horizontal chain:
 * root → child → grandchild → ... evenly spaced left-to-right,
 * centered on island.position.x.
 */
const LINEAR_H_STEP = 130

function computeLinearHLayout(island: IslandData): NodePosition[] {
  const cx = island.position.x
  const cy = island.position.y
  const nodeMap = new Map(island.nodes.map((n) => [n.id, n]))
  const root = island.nodes.find((n) => n.type === 'root')
  if (!root) return []

  // Walk the chain following the first child each time
  const chain: string[] = [root.id]
  let current = root
  while (current.children.length > 0) {
    const nextId = current.children[0]
    const next = nodeMap.get(nextId)
    if (!next) break
    chain.push(nextId)
    current = next
  }

  const totalWidth = (chain.length - 1) * LINEAR_H_STEP
  const startX = cx - totalWidth / 2

  return chain.map((id, i) => ({
    id,
    x: startX + i * LINEAR_H_STEP,
    y: cy,
  }))
}

interface Props {
  island: IslandData
  /** Starting index for stagger animation across all islands */
  indexOffset: number
}

/**
 * Renders a single skill island - a radial cluster of nodes with
 * connection lines between parent and child.
 */
export default function SkillIsland({ island, indexOffset }: Props) {
  const layout = useMemo(
    () =>
      island.layout === 'linear-h'
        ? computeLinearHLayout(island)
        : computeLayout(island),
    [island],
  )
  const posMap = useMemo(
    () => new Map(layout.map((p) => [p.id, p])),
    [layout],
  )

  // Build connection lines (parent -> child)
  const lines = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; key: string }[] = []
    for (const node of island.nodes) {
      const from = posMap.get(node.id)
      if (!from) continue
      for (const childId of node.children) {
        const to = posMap.get(childId)
        if (!to) continue
        result.push({
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          key: `${node.id}-${childId}`,
        })
      }
    }
    return result
  }, [island.nodes, posMap])

  return (
    <g className="skill-island">
      {/* Connection lines */}
      {lines.map((l) => (
        <line
          key={l.key}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#d4a54a"
          strokeWidth={1.5}
          strokeOpacity={0.35}
          filter="url(#lineGlow)"
        />
      ))}

      {/* Nodes */}
      {layout.map((pos, i) => {
        const node = island.nodes.find((n) => n.id === pos.id)
        if (!node) return null
        return (
          <SkillNode
            key={node.id}
            node={node}
            x={pos.x}
            y={pos.y}
            index={indexOffset + i}
          />
        )
      })}
    </g>
  )
}
