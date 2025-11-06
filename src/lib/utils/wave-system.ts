import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

export interface WaveApplication {
  id: string
  user_id: string
  hub_id: string
  motivation_answer: string
  contribution_answer: string
  commitment_answer: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
}

export interface WaveGrant {
  id: string
  user_id: string
  hub_id: string
  wave_number: number
  granted_by: string
  granted_at: string
}

export interface SubmitApplicationParams {
  userId: string
  hubId: string
  answers: {
    motivation: string
    contribution: string
    commitment: string
  }
}

export interface ReviewApplicationParams {
  applicationId: string
  reviewerId: string
  decision: 'approved' | 'rejected'
}

/**
 * Submit a Wave application
 */
export async function submitWaveApplication(params: SubmitApplicationParams): Promise<WaveApplication | null> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Wave application submitted (mock):', params)
    // Return mock application for demo
    return {
      id: `app-${Date.now()}`,
      user_id: params.userId,
      hub_id: params.hubId,
      motivation_answer: params.answers.motivation,
      contribution_answer: params.answers.contribution,
      commitment_answer: params.answers.commitment,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('wave_applications')
    .insert({
      user_id: params.userId,
      hub_id: params.hubId,
      motivation_answer: params.answers.motivation,
      contribution_answer: params.answers.contribution,
      commitment_answer: params.answers.commitment,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Error submitting wave application:', error)
    throw new Error('Failed to submit application')
  }

  return data
}

/**
 * Get pending applications for review
 */
export async function getPendingApplications(hubId: string): Promise<WaveApplication[]> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Fetching pending applications (mock)')
    return []
  }

  const { data, error } = await supabase
    .from('wave_applications')
    .select('*')
    .eq('hub_id', hubId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

/**
 * Get all applications (for admin view)
 */
export async function getAllApplications(hubId: string): Promise<WaveApplication[]> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Fetching all applications (mock)')
    // Return mock data for demo
    return [
      {
        id: 'app-1',
        user_id: 'user-123',
        hub_id: hubId,
        motivation_answer: 'I want to contribute to AGI safety because...',
        contribution_answer: 'My background in AI research allows me to...',
        commitment_answer: 'I embody the 7 Laws through...',
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'app-2',
        user_id: 'user-456',
        hub_id: hubId,
        motivation_answer: 'As a developer, I believe...',
        contribution_answer: 'I have experience building...',
        commitment_answer: 'Truth and empathy guide my work by...',
        status: 'pending',
        created_at: new Date(Date.now() - 43200000).toISOString(),
      },
    ]
  }

  const { data, error } = await supabase
    .from('wave_applications')
    .select('*')
    .eq('hub_id', hubId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

/**
 * Review a Wave application
 */
export async function reviewApplication(params: ReviewApplicationParams): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Application reviewed (mock):', params)
    return true
  }

  const { error: updateError } = await supabase
    .from('wave_applications')
    .update({
      status: params.decision,
      reviewed_by: params.reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', params.applicationId)

  if (updateError) {
    console.error('Error updating application:', updateError)
    return false
  }

  // If approved, create a Wave grant
  if (params.decision === 'approved') {
    const { data: application } = await supabase
      .from('wave_applications')
      .select('user_id, hub_id')
      .eq('id', params.applicationId)
      .single()

    if (application) {
      await grantWaveAccess({
        userId: application.user_id,
        hubId: application.hub_id,
        grantedBy: params.reviewerId,
      })
    }
  }

  return true
}

/**
 * Grant Wave access to a user
 */
export async function grantWaveAccess(params: {
  userId: string
  hubId: string
  grantedBy: string
}): Promise<WaveGrant | null> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Wave access granted (mock):', params)
    return {
      id: `grant-${Date.now()}`,
      user_id: params.userId,
      hub_id: params.hubId,
      wave_number: 1,
      granted_by: params.grantedBy,
      granted_at: new Date().toISOString(),
    }
  }

  const { data, error } = await supabase
    .from('wave_grants')
    .insert({
      user_id: params.userId,
      hub_id: params.hubId,
      wave_number: 1, // Start with Wave 1
      granted_by: params.grantedBy,
    })
    .select()
    .single()

  if (error) {
    console.error('Error granting wave access:', error)
    return null
  }

  return data
}

/**
 * Check if a user has Wave access for a hub
 */
export async function hasWaveAccess(userId: string, hubId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Checking wave access (mock) - returning true for demo')
    return true // Allow access in demo mode
  }

  const { data, error } = await supabase
    .from('wave_grants')
    .select('id')
    .eq('user_id', userId)
    .eq('hub_id', hubId)
    .maybeSingle()

  if (error) {
    console.error('Error checking wave access:', error)
    return false
  }

  return !!data
}

/**
 * Get user's Wave grant info
 */
export async function getUserWaveGrant(userId: string, hubId: string): Promise<WaveGrant | null> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Fetching wave grant (mock)')
    return null
  }

  const { data, error } = await supabase
    .from('wave_grants')
    .select('*')
    .eq('user_id', userId)
    .eq('hub_id', hubId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching wave grant:', error)
    return null
  }

  return data
}

/**
 * Check if user has a pending application
 */
export async function hasPendingApplication(userId: string, hubId: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Checking pending application (mock)')
    return false
  }

  const { data, error } = await supabase
    .from('wave_applications')
    .select('id')
    .eq('user_id', userId)
    .eq('hub_id', hubId)
    .eq('status', 'pending')
    .maybeSingle()

  if (error) {
    console.error('Error checking pending application:', error)
    return false
  }

  return !!data
}

/**
 * Get application statistics for a hub
 */
export async function getApplicationStats(hubId: string): Promise<{
  pending: number
  approved: number
  rejected: number
  total: number
}> {
  if (!isSupabaseConfigured) {
    console.log('[Demo Mode] Fetching application stats (mock)')
    return {
      pending: 2,
      approved: 15,
      rejected: 3,
      total: 20,
    }
  }

  const { data, error } = await supabase
    .from('wave_applications')
    .select('status')
    .eq('hub_id', hubId)

  if (error) {
    console.error('Error fetching application stats:', error)
    return { pending: 0, approved: 0, rejected: 0, total: 0 }
  }

  const stats = {
    pending: 0,
    approved: 0,
    rejected: 0,
    total: data?.length || 0,
  }

  data?.forEach(app => {
    if (app.status === 'pending') stats.pending++
    else if (app.status === 'approved') stats.approved++
    else if (app.status === 'rejected') stats.rejected++
  })

  return stats
}
