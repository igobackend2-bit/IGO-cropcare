import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-placeholder-project.supabase.co'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'

/**
 * Server-side Supabase admin client.
 * Uses the service role key — bypasses ALL Row Level Security.
 * NEVER expose this client to the browser / client components.
 * Use only in:
 *   - API route handlers (app/api/**)
 *   - Server actions
 *   - Server components that read sensitive data
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
