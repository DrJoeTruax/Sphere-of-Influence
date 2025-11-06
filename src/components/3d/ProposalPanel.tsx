'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Proposal } from './Forum3D'

interface ProposalPanelProps {
  proposal: Proposal
  position: { x: number; y: number; z: number }
  onClick: () => void
  isSelected: boolean
}

export default function ProposalPanel({
  proposal,
  position,
  onClick,
  isSelected,
}: ProposalPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Calculate consensus percentage
  const totalVotes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
  const consensusPercentage = totalVotes > 0
    ? Math.round((proposal.votes_for / totalVotes) * 100)
    : 0

  // Status colors
  const statusColors = {
    draft: '#6B7280',      // Gray
    active: '#3B82F6',     // Blue
    passed: '#10B981',     // Green
    rejected: '#EF4444',   // Red
  }

  const color = statusColors[proposal.status] || statusColors.active

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime + position.x) * 0.1

      // Rotate slightly when hovered or selected
      if (isHovered || isSelected) {
        meshRef.current.rotation.y += 0.01
      }
    }
  })

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Main panel */}
      <RoundedBox
        ref={meshRef}
        args={[2, 2.5, 0.1]}
        radius={0.05}
        onClick={onClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.9 : isHovered ? 0.8 : 0.6}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : isHovered ? 0.3 : 0.1}
        />
      </RoundedBox>

      {/* Glow effect */}
      {(isHovered || isSelected) && (
        <RoundedBox args={[2.2, 2.7, 0.15]} radius={0.05}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </RoundedBox>
      )}

      {/* Label */}
      <Html
        position={[0, 0, 0.1]}
        center
        distanceFactor={4}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="bg-black/90 text-white p-3 rounded-lg w-48 text-center backdrop-blur-sm border border-white/20">
          <div className="text-xs text-gray-400 mb-1 uppercase">
            {proposal.category}
          </div>
          <div className="font-bold text-sm mb-2 line-clamp-2">
            {proposal.title}
          </div>
          <div className="text-xs text-gray-400 mb-2">
            by {proposal.author}
          </div>

          {/* Vote counts */}
          <div className="flex justify-between text-xs mb-2">
            <span className="text-green-400">👍 {proposal.votes_for}</span>
            <span className="text-red-400">👎 {proposal.votes_against}</span>
            <span className="text-gray-400">⚪ {proposal.votes_abstain}</span>
          </div>

          {/* Consensus bar */}
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all"
              style={{ width: `${consensusPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-400">
            {consensusPercentage}% consensus
          </div>

          {/* Status badge */}
          <div className="mt-2">
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: color + '40',
                color: color,
              }}
            >
              {proposal.status}
            </span>
          </div>
        </div>
      </Html>
    </group>
  )
}
