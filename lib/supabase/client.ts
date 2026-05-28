import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rdhpdxoyyyyqjqkiauhj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkaHBkeG95eXl5cWpxa2lhdWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjM1MTUsImV4cCI6MjA5NTUzOTUxNX0.7HGbdXCVxqf_EX9bclNtCzA61Xnw7h6r-j1Xj2fP1kg'

const isValidHttpUrl = (str: string) => {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

const safeUrl = isValidHttpUrl(supabaseUrl) ? supabaseUrl : 'https://dummy-placeholder-project.supabase.co'
const safeKey = supabaseAnonKey || 'dummy-anon-key'

export const supabase = createClient(safeUrl, safeKey)
