import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Also handle implicit flow if the tokens are in the hash fragment.
  // Actually, Supabase redirect by default uses PKCE when initiated by the server.
  // But if the client initiates it, the tokens might be in the hash, and the JS client handles it automatically.
  // We'll redirect to the main page with a query param to show the success message.

  if (code) {
      // Exchange code for session using the backend client.
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseAnonKey)

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
          return NextResponse.redirect(new URL('/?verified=true', request.url))
      }
  }

  // Redirect to main page, the client JS will pick up any hash fragments.
  // We append `?verified=true` anyway, the client script will check if auth is valid.
  return NextResponse.redirect(new URL('/?verified=true', request.url))
}
