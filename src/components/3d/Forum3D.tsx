'use client'

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import ProposalPanel from './ProposalPanel'

export interface Proposal {
  id: string
  title: string
  author: string
  category: string
  status: 'draft' | 'active' | 'passed' | 'rejected'
  votes_for: number
  votes_against: number
  votes_abstain: number
  created_at: string
  voting_ends_at: string
  content?: string
  position?: { x: number; y: number; z: number }
}

interface Forum3DProps {
  proposals: Proposal[]
  onProposalClick: (proposal: Proposal) => void
  selectedProposalId?: string
}

// Generate spiral arrangement for proposals
function generatePositions(count: number): Array<{ x: number; y: number; z: number }> {
  const positions = []
  const radius = 8
  const heightSpacing = 3
  const spiralTurns = 2

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 * spiralTurns
    const heightOffset = (i / count) * heightSpacing - heightSpacing / 2

    positions.push({
      x: Math.cos(angle) * radius,
      y: heightOffset,
      z: Math.sin(angle) * radius,
    })
  }

  return positions
}

export default function Forum3D({
  proposals,
  onProposalClick,
  selectedProposalId,
}: Forum3DProps) {
  const positions = generatePositions(proposals.length)

  return (
    <div className="w-full h-full">
      <Canvas>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
          target={[0, 0, 0]}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Proposals */}
        {proposals.map((proposal, index) => (
          <ProposalPanel
            key={proposal.id}
            proposal={proposal}
            position={positions[index] || { x: 0, y: 0, z: 0 }}
            onClick={() => onProposalClick(proposal)}
            isSelected={proposal.id === selectedProposalId}
          />
        ))}

        {/* Center indicator */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.5} />
        </mesh>

        {/* Grid helper */}
        <gridHelper args={[30, 30, '#333333', '#1a1a1a']} position={[0, -5, 0]} />
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-300 max-w-xs">
        <div className="font-bold mb-2">Controls:</div>
        <div>🖱️ Click + drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>🎯 Click panel to view details</div>
      </div>
    </div>
  )
}
