import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xweavxfjmumoyuonnmpx.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function setupDb() {
  // Test connection
  const { data, error } = await supabase.from('projects').select('id').limit(1)

  if (error && error.code === '42P01') {
    console.log('Tables do not exist yet. Please run supabase-schema.sql in the Supabase SQL Editor.')
    console.log('Go to: https://supabase.com/dashboard/project/xweavxfjmumoyuonnmpx/sql/new')
    console.log('Copy and paste the contents of supabase-schema.sql')
    process.exit(1)
  } else if (error) {
    console.log('Connection error:', error.message)
    process.exit(1)
  } else {
    console.log('Database connected! Tables exist.')
    console.log('Projects found:', data?.length ?? 0)
  }
}

setupDb()
