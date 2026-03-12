/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Secret key for hashing/signing the cookie
const ADMIN_COOKIE_NAME = 'admin_session'
const ADMIN_SECRET_TOKEN = process.env.ADMIN_SECRET_TOKEN as string

if (!ADMIN_SECRET_TOKEN) {
  throw new Error('ADMIN_SECRET_TOKEN environment variable is not set')
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  let isAuthenticated = false;

  // L'utilisateur a explicitement demandé de configurer cet utilisateur avec ce mot de passe.
  if (username === 'Bonheurfung' && password === 'arcen4444') {
    isAuthenticated = true;
  }

  // Tentative de validation via RPC si configuré par l'utilisateur
  if (!isAuthenticated) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        try {
            const { data, error } = await supabase.rpc('verify_admin', {
              p_username: username,
              p_password: password
            });
            if (!error && data === true) {
                isAuthenticated = true;
            }
        } catch(e) {
            // Ignorer l'erreur, utiliser le fallback
        }
    }
  }

  // Si l'authentification réussit, nous créons un cookie HTTP-Only sécurisé
  if (isAuthenticated) {
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN, {
      httpOnly: true, // Empêche l'accès via JavaScript côté client (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Uniquement HTTPS en prod
      sameSite: 'strict', // Protection CSRF
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
      path: '/'
    })
    return true
  }

  return false
}

export async function checkAdminAuthStatus(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)
  return token?.value === ADMIN_SECRET_TOKEN
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}

export async function fetchSensitiveAdminData() {
  // 1. Vérification sécurisée du cookie CÔTÉ SERVEUR.
  // L'argument côté client n'est plus utilisé pour empêcher toute falsification.
  const isAdmin = await checkAdminAuthStatus()

  if (!isAdmin) {
    throw new Error("Unauthorized access. Admin cookie missing or invalid.")
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  // REQUIRED: Service Role Key is strictly required to fetch sensitive data securely bypassing RLS
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Ensure the database RLS allows the query or add the key to fetch sensitive contacts.");
      // Fallback for demonstration if the user hasn't locked the DB yet:
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!anonKey) return { contacts: [], stats: null };
  }

  const validKey = supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!validKey || !supabaseUrl) return { contacts: [], stats: null };
  const supabase = createClient(supabaseUrl, validKey as string)

  try {
      // Fetch only real votes for contacts list
      // Real votes are those that have a user_id (Google Auth). Fake votes have user_id = null.
      // Wait, in this particular mocked db all user_ids are null, but 65 are marked as real_user = true.
      // We will fallback to using is_real_user = true since the mock data relies on this.
      // The user wants to filter fake data. Fake data is is_real_user = false.
      const { data: recentData } = await supabase
        .from('votes')
        .select('id, contact_info, use_case, country, model_choice, intensity, created_at')
        .eq('is_real_user', true)
        .order('created_at', { ascending: false })
        .limit(100)

      // Additionally, fetch the true admin stats (only real users) to replace the public mixed stats
      // We do the aggregations manually here since the `admin_stats` view mixes both
      const { data: realVotesData, error: countErr } = await supabase
        .from('votes')
        .select('id, country, country_code, model_choice, created_at')
        .eq('is_real_user', true)
        .order('created_at', { ascending: false })

      if (countErr) throw countErr;

      const realVotesCount = realVotesData?.length || 0;

      // Calculate active users (last 24h)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const activeUsers24h = realVotesData?.filter(v => new Date(v.created_at) > oneDayAgo).length || 0;

      // Calculate top countries
      const countryCounts: Record<string, {name: string, code: string, count: number}> = {};
      realVotesData?.forEach(v => {
          if (!countryCounts[v.country_code]) {
              countryCounts[v.country_code] = { name: v.country, code: v.country_code, count: 0 };
          }
          countryCounts[v.country_code].count++;
      });

      const topCountries = Object.values(countryCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)
        .map(c => ({
            name: c.name,
            code: c.code,
            count: c.count,
            percent: realVotesCount > 0 ? parseFloat(((c.count / realVotesCount) * 100).toFixed(1)) : 0
        }));

      // Calculate new graph paths for real data dynamically based on time of day (24h)
      const width = 300;
      const height = 90;

      // Group votes by hour (0-23)
      const votesByHour: Record<number, number> = {};
      for (let i = 0; i < 24; i++) votesByHour[i] = 0;

      realVotesData?.forEach((v: any) => {
          const hour = new Date(v.created_at).getHours();
          votesByHour[hour]++;
      });

      const maxVotesPerHour = Math.max(...Object.values(votesByHour), 1); // Avoid division by zero

      const realPoints: {x: number, y: number}[] = [];
      const genPoints: {x: number, y: number}[] = [{x: 0, y: height}, {x: width, y: height}]; // Flat line for fake

      for (let i = 0; i <= 24; i++) {
          const x = Math.round((i / 24) * width);
          // If i=24, map to hour 0 to close the day loop visually, or just use hour 23
          const hourData = i === 24 ? votesByHour[23] : votesByHour[i];
          // y goes from 90 (bottom) to 10 (top)
          const y = height - Math.round((hourData / maxVotesPerHour) * 80);
          realPoints.push({x, y});
      }

      const generatePath = (points: {x: number, y: number}[]) => {
          if (points.length === 0) return "M0,90";
          if (points.length === 1) return `M${points[0].x},${points[0].y}`;
          if (points.length === 2) return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;

          let path = `M${points[0].x},${points[0].y}`;
          for (let i = 1; i < points.length - 1; i++) {
              const xc = (points[i].x + points[i + 1].x) / 2;
              const yc = (points[i].y + points[i + 1].y) / 2;
              path += ` Q${points[i].x},${points[i].y} ${xc},${yc}`;
          }
          path += ` T${points[points.length - 1].x},${points[points.length - 1].y}`;
          return path;
      };

      return {
          stats: {
              totalVotes: realVotesCount,
              activeUsers: activeUsers24h,
              reelsPercentage: 100, // By definition, in admin view it's 100% real
              generatedPercentage: 0,
              countries: topCountries,
              latestVotes: realVotesData?.slice(0, 3).map((v: any) => ({
                  id: v.id,
                  user: 'usr_' + v.id.substring(0, 5),
                  country_code: v.country_code, // fallback
                  model: v.model_choice,
                  time: "A l'instant",
                  real: true
              })) || [],
              chartData: {
                  realLine: generatePath(realPoints),
                  genLine: "M0,90 L300,90" // Ligne plate car 0% généré dans la vue admin réelle
              }
          },
          contacts: recentData?.map((v: any) => ({
              id: v.id,
              contact: v.contact_info || '',
              useCase: v.use_case || '',
              country: v.country || '',
              model: v.model_choice || '',
              intensity: v.intensity !== undefined ? v.intensity : null,
              date: new Date(v.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          })) || []
      }

  } catch(e) {
      console.error(e)
  }

  return { contacts: [], stats: null }
}
