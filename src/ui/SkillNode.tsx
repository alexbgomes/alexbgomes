import { useMemo } from 'react'

import type { SkillNode } from '../types/skills'

import { useGameState } from '../state/useGameState'

const SIZE: Record<SkillNode['type'], number> = {
  root: 28,
  category: 22,
  skill: 16,
  keystone: 24,
}

const FILL: Record<SkillNode['type'], string> = {
  root: '#d4a54a',
  category: '#7a6aaa',
  skill: '#5a9a5a',
  keystone: '#c45a5a',
}

const STROKE: Record<SkillNode['type'], string> = {
  root: '#f0d078',
  category: '#9a8acc',
  skill: '#7aba7a',
  keystone: '#e87a7a',
}

interface Props {
  node: SkillNode
  x: number
  y: number
  /** Stagger index for mount animation */
  index: number
}

export default function SkillNode({ node, x, y, index }: Props) {
  const setHoveredSkill = useGameState((s) => s.setHoveredSkill)
  const r = SIZE[node.type]
  const fill = FILL[node.type]
  const stroke = STROKE[node.type]

  // Diamond points for keystone
  const diamondPoints = useMemo(
    () =>
      `${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}`,
    [x, y, r],
  )

  const animDelay = `${index * 0.04}s`

  return (
    <g
      className="skill-node"
      style={{ animationDelay: animDelay, '--node-color': fill } as React.CSSProperties}
      onMouseEnter={() => setHoveredSkill(node)}
      onMouseLeave={() => setHoveredSkill(null)}
    >
      {/* Glow aura (root & keystone only) */}
      {(node.type === 'root' || node.type === 'keystone') && (
        <circle
          cx={x}
          cy={y}
          r={r + 8}
          fill="none"
          stroke={fill}
          strokeWidth={1}
          opacity={0.25}
          className="node-aura"
        />
      )}

      {/* Main shape */}
      {node.type === 'keystone' ? (
        <polygon
          points={diamondPoints}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          className="node-shape"
        />
      ) : (
        <circle
          cx={x}
          cy={y}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={node.type === 'root' ? 3 : 2}
          className="node-shape"
        />
      )}

      {/* Emoji or Image icon */}
      {node.icon.startsWith('/') || node.icon.match(/\\.(png|jpg|jpeg|svg|webp|gif)$/i) ? (
        <g filter="url(#iconShadow)" style={{ pointerEvents: 'none' }}>
          <image
            href={node.icon}
            x={x - r * 0.65}
            y={y - r * 0.65}
            width={r * 1.3}
            height={r * 1.3}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      ) : (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={r * 0.85}
          style={{
            pointerEvents: 'none',
            textShadow: '0px 2px 6px rgba(0, 0, 0, 0.7)'
          }}
        >
          {node.icon}
        </text>
      )}

      {/* Small label below the node */}
      <text
        x={x}
        y={y + r + (node.type === 'root' || node.type === 'keystone' ? 24 : 14)}
        textAnchor="middle"
        fill="#a09888"
        fontSize={9}
        fontFamily="var(--font-body)"
        style={{ pointerEvents: 'none' }}
      >
        {node.label}
      </text>

      {/* Invisible hit area to prevent hover flickering between shape and aura */}
      <circle
        cx={x}
        cy={y}
        r={node.type === 'root' || node.type === 'keystone' ? r + 8 : r}
        fill="transparent"
      />
    </g>
  )
}
