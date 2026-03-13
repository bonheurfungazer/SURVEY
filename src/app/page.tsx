import { createClient } from '@supabase/supabase-js';
import HomePage from './HomePage';
import { getFlagEmoji } from '../lib/utils';

export const revalidate = 0; // Ensures it always fetches the latest count if not using server actions

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  let initialTotalVotes = 0;
  let initialLatestVotes: any[] = [];

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { count, error: countErr } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('is_real_user', true);

    if (!countErr && count !== null) {
      initialTotalVotes = count;
    }

    const { data: recentData, error: recentErr } = await supabase
        .from('votes')
        .select('id, country_code, model_choice, is_real_user, created_at, country')
        .eq('is_real_user', true)
        .order('created_at', { ascending: false })
        .limit(10);

    if (!recentErr && recentData) {
        initialLatestVotes = recentData.map(v => ({
            user: 'usr_' + v.id.substring(0, 5),
            flag: getFlagEmoji(v.country_code),
            model: v.model_choice,
            time: new Date(v.created_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}),
            real: v.is_real_user
        }));
    }
  }

  return <HomePage initialTotalVotes={initialTotalVotes} initialLatestVotes={initialLatestVotes} />;
}
