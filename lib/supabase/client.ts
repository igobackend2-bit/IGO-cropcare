import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

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
