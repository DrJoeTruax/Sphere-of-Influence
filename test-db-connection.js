// Quick test to verify Supabase connection and hubs data
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://giddqwmuqtefygjxmbzv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZGRxd211cXRlZnlnanhtYnp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODEwNzgsImV4cCI6MjA3ODA1NzA3OH0.BkRco1ZMK_xBbiQwmOwNxVYffvLw2RjkQ_6sahcfYv0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...\n')

  try {
    // Test 1: Check if hubs table exists and has data
    console.log('1. Checking hubs table...')
    const { data: hubs, error: hubsError } = await supabase
      .from('hubs')
      .select('*')
      .order('name')

    if (hubsError) {
      console.error('❌ Error fetching hubs:', hubsError.message)
      console.error('   This likely means migrations have not been run yet.')
      return
    }

    if (!hubs || hubs.length === 0) {
      console.log('⚠️  Hubs table exists but is empty!')
      console.log('   You need to run the migrations to seed the data.')
      return
    }

    console.log(`✅ Found ${hubs.length} hubs:`)
    hubs.forEach(hub => {
      console.log(`   - ${hub.name} (${hub.slug})`)
    })

    // Test 2: Check problem_categories
    console.log('\n2. Checking problem_categories table...')
    const { data: categories, error: categoriesError } = await supabase
      .from('problem_categories')
      .select('id')

    if (categoriesError) {
      console.error('❌ Error fetching categories:', categoriesError.message)
      return
    }

    console.log(`✅ Found ${categories?.length || 0} problem categories`)

    // Test 3: Check trust_scores table (from new migration)
    console.log('\n3. Checking trust_scores table (from new migration)...')
    const { error: trustError } = await supabase
      .from('trust_scores')
      .select('user_id')
      .limit(1)

    if (trustError) {
      console.error('❌ Error accessing trust_scores:', trustError.message)
      console.log('   This means the new launch_blockers migration has NOT been run yet.')
      return
    }

    console.log('✅ Trust scores table exists (new migration is applied)')

    console.log('\n🎉 All checks passed! Database is ready.')
    console.log('\nNext step: Start the dev server with `npm run dev`')

  } catch (err) {
    console.error('❌ Connection error:', err.message)
  }
}

testConnection()
