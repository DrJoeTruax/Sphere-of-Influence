import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

/**
 * Proof Station One API
 * Utilities for interacting with The Nader Institute orbital platform
 */

export interface ProofField {
  id: string
  slug: string
  name: string
  description: string
  color_code: string
  created_at: string
}

export interface Proof {
  id: string
  author_id: string | null
  name: string
  field_id: string | null
  proof_links: string[]
  description: string
  hash: string | null
  polygon_timestamp: string | null
  verified_at: string | null
  impact_score: number
  endorsement_count: number
  view_count: number
  created_at: string
  updated_at: string
  pillar_position: { x: number; y: number; z: number; rotation: number } | null

  // Joined fields
  author_username?: string
  author_name?: string
  field_name?: string
  field_color?: string
}

export interface Endorsement {
  id: string
  proof_id: string
  endorser_id: string
  comment: string
  credibility_score: number
  signature: string | null
  created_at: string

  // Joined fields
  endorser_username?: string
  endorser_name?: string
}

export interface DefenseSession {
  id: string
  proof_id: string
  title: string
  description: string
  defense_date: string | null
  recording_url: string | null
  transcript_url: string | null
  defenders: string[]
  reviewers: string[]
  created_at: string
}

export interface StationActivity {
  id: string
  user_id: string | null
  activity_type: 'proof_submitted' | 'proof_endorsed' | 'defense_scheduled' | 'proof_verified' | 'station_visited'
  target_id: string | null
  details: Record<string, unknown>
  created_at: string
}

// =============================================================================
// PROOF FIELDS
// =============================================================================

export async function getProofFields(): Promise<ProofField[]> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Returning mock proof fields')
    return mockProofFields
  }

  const { data, error } = await supabase
    .from('proof_fields')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching proof fields:', error)
    return []
  }

  return data || []
}

// =============================================================================
// PROOFS
// =============================================================================

export async function getAllProofs(): Promise<Proof[]> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Returning mock proofs')
    return mockProofs
  }

  const { data, error } = await supabase
    .from('active_proofs_view')
    .select('*')

  if (error) {
    console.error('Error fetching proofs:', error)
    return []
  }

  return data || []
}

export async function getProofById(id: string): Promise<Proof | null> {
  if (!isSupabaseConfigured) {
    return mockProofs.find(p => p.id === id) || null
  }

  const { data, error } = await supabase
    .from('proofs')
    .select(`
      *,
      author:profiles(username, display_name),
      field:proof_fields(name, color_code)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching proof:', error)
    return null
  }

  return data
}

export async function createProof(proof: {
  name: string
  field_id: string
  proof_links: string[]
  description: string
}): Promise<Proof | null> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Proof created (mock)', proof)
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Must be authenticated to create proof')
  }

  const { data, error } = await supabase
    .from('proofs')
    .insert({
      ...proof,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating proof:', error)
    throw new Error('Failed to create proof')
  }

  return data
}

export async function incrementProofViews(proofId: string): Promise<void> {
  if (!isSupabaseConfigured) return

  const { error } = await supabase.rpc('increment_proof_views', {
    proof_id: proofId
  })

  if (error) {
    console.error('Error incrementing proof views:', error)
  }
}

// =============================================================================
// ENDORSEMENTS
// =============================================================================

export async function getProofEndorsements(proofId: string): Promise<Endorsement[]> {
  if (!isSupabaseConfigured) {
    return []
  }

  const { data, error } = await supabase
    .from('endorsements')
    .select(`
      *,
      endorser:profiles(username, display_name)
    `)
    .eq('proof_id', proofId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching endorsements:', error)
    return []
  }

  return data || []
}

export async function endorseProof(params: {
  proof_id: string
  comment: string
  credibility_score: number
}): Promise<Endorsement | null> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Proof endorsed (mock)', params)
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Must be authenticated to endorse')
  }

  const { data, error } = await supabase
    .from('endorsements')
    .insert({
      ...params,
      endorser_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error endorsing proof:', error)
    throw new Error('Failed to endorse proof')
  }

  return data
}

// =============================================================================
// DEFENSE SESSIONS
// =============================================================================

export async function getDefenseSessions(proofId: string): Promise<DefenseSession[]> {
  if (!isSupabaseConfigured) {
    return []
  }

  const { data, error } = await supabase
    .from('defense_sessions')
    .select('*')
    .eq('proof_id', proofId)
    .order('defense_date', { ascending: false })

  if (error) {
    console.error('Error fetching defense sessions:', error)
    return []
  }

  return data || []
}

// =============================================================================
// STATION ACTIVITY
// =============================================================================

export async function logStationVisit(): Promise<void> {
  if (!isSupabaseConfigured) return

  const { data: { user } } = await supabase.auth.getUser()

  await supabase
    .from('station_activity')
    .insert({
      user_id: user?.id || null,
      activity_type: 'station_visited',
      details: { timestamp: new Date().toISOString() }
    })
}

export async function getRecentActivity(limit: number = 20): Promise<StationActivity[]> {
  if (!isSupabaseConfigured) {
    return []
  }

  const { data, error } = await supabase
    .from('station_activity')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching station activity:', error)
    return []
  }

  return data || []
}

// =============================================================================
// POLYGON INTEGRATION
// =============================================================================

/**
 * Generate hash for proof verification
 */
export function generateProofHash(proof: {
  name: string
  description: string
  proof_links: string[]
}): string {
  const content = JSON.stringify({
    name: proof.name,
    description: proof.description,
    links: proof.proof_links.sort(),
    timestamp: Date.now()
  })

  // Simple hash for demonstration
  // In production, use Web3.js or similar for actual blockchain interaction
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  return '0x' + Math.abs(hash).toString(16).padStart(64, '0')
}

/**
 * Verify proof on Polygon network
 * Placeholder for actual Polygon integration
 */
export async function verifyProofOnPolygon(hash: string): Promise<{
  success: boolean
  timestamp?: string
  transactionHash?: string
}> {
  // TODO: Implement actual Polygon verification
  // This would use Web3.js to interact with Polygon smart contract

  console.log('[Mock] Verifying hash on Polygon:', hash)

  return {
    success: true,
    timestamp: new Date().toISOString(),
    transactionHash: '0x' + Math.random().toString(16).substring(2, 66)
  }
}

// =============================================================================
// MOCK DATA (for demo mode)
// =============================================================================

const mockProofFields: ProofField[] = [
  { id: '1', slug: 'ethics', name: 'Ethics', description: 'Moral philosophy', color_code: '#8B5CF6', created_at: new Date().toISOString() },
  { id: '2', slug: 'ai-safety', name: 'AI Safety', description: 'AI alignment', color_code: '#3B82F6', created_at: new Date().toISOString() },
  { id: '3', slug: 'empathy', name: 'Empathy Studies', description: 'Emotional intelligence', color_code: '#EC4899', created_at: new Date().toISOString() },
]

const mockProofs: Proof[] = [
  {
    id: '1',
    author_id: 'demo-user',
    name: 'The Ethics of Autonomous Systems',
    field_id: '1',
    proof_links: ['https://example.com/paper1.pdf', 'https://example.com/paper2.pdf'],
    description: 'A comprehensive framework for evaluating moral decisions in autonomous AI systems.',
    hash: '0x123abc...',
    polygon_timestamp: new Date().toISOString(),
    verified_at: new Date().toISOString(),
    impact_score: 156,
    endorsement_count: 23,
    view_count: 1203,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
    pillar_position: { x: 2, y: 0, z: -3, rotation: 0.5 },
    author_username: 'dr_truax',
    author_name: 'Dr. Joe Truax',
    field_name: 'Ethics',
    field_color: '#8B5CF6'
  },
  {
    id: '2',
    author_id: 'demo-user-2',
    name: 'Empathy-Driven AI Alignment',
    field_id: '3',
    proof_links: ['https://example.com/research.pdf'],
    description: 'Research demonstrating how empathy metrics can improve AI safety outcomes.',
    hash: '0x456def...',
    polygon_timestamp: new Date().toISOString(),
    verified_at: new Date().toISOString(),
    impact_score: 89,
    endorsement_count: 15,
    view_count: 847,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
    pillar_position: { x: -2, y: 1, z: 3, rotation: 1.2 },
    author_username: 'researcher_ai',
    author_name: 'Dr. Sarah Chen',
    field_name: 'Empathy Studies',
    field_color: '#EC4899'
  }
]
