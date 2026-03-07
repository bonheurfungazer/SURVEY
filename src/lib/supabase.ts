import { createClient } from '@supabase/supabase-js'

// Ensure we always pass a valid URL structure so the Supabase client doesn't crash during build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://VOTRE_URL_SUPABASE.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'VOTRE_CLE_PUBLIQUE_SUPABASE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
