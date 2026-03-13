import { createClient } from '@supabase/supabase-js';
import HomePage from './HomePage';

export const revalidate = 0; // Ensures it always fetches the latest count if not using server actions

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  let initialTotalVotes = 0;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { count, error } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('is_real_user', true);

    if (!error && count !== null) {
      initialTotalVotes = count;
    }
  }

  return <HomePage initialTotalVotes={initialTotalVotes} />;
}
