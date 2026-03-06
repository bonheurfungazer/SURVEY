-- Create the votes table
CREATE TABLE public.votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) UNIQUE, -- Un seul vote par utilisateur
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    model_choice VARCHAR(100) NOT NULL,
    intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
    use_case TEXT,
    contact_info VARCHAR(255),
    is_real_user BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Activer le temps réel pour la table votes
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.votes;
COMMIT;

-- Vue SQL pour les statistiques Admin (Performances optimisées)
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
    (SELECT count(*) FROM public.votes) as total_votes,
    (SELECT count(DISTINCT user_id) FROM public.votes WHERE created_at > now() - interval '24 hours') as active_users_24h,
    (SELECT count(*) FROM public.votes WHERE is_real_user = true)::float / NULLIF((SELECT count(*) FROM public.votes), 0) * 100 as real_users_percent;

-- Fonction RPC pour obtenir le top 4 des pays avec pourcentages
CREATE OR REPLACE FUNCTION public.get_top_countries()
RETURNS TABLE (
    country_name VARCHAR,
    country_code VARCHAR,
    vote_count BIGINT,
    percentage NUMERIC
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    total_votes BIGINT;
BEGIN
    SELECT count(*) INTO total_votes FROM public.votes;

    RETURN QUERY
    SELECT
        v.country as country_name,
        v.country_code,
        count(v.id) as vote_count,
        ROUND((count(v.id)::numeric / NULLIF(total_votes, 0) * 100), 1) as percentage
    FROM public.votes v
    GROUP BY v.country, v.country_code
    ORDER BY vote_count DESC
    LIMIT 4;
END;
$$;

-- Allow authenticated inserts only (Google Auth required)
CREATE POLICY "Allow authenticated insert access"
ON public.votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow public read access (for admin stats)
CREATE POLICY "Allow public read access"
ON public.votes FOR SELECT
TO public
USING (true);

-- Insert 70 dummy records (majority Central Africa)
INSERT INTO public.votes (country, country_code, model_choice, intensity, is_real_user, created_at) VALUES
-- Cameroun (CM) - 20 votes
('Cameroun', 'CM', 'Claude 3.5 Sonnet', 8, true, now() - interval '2 days'),
('Cameroun', 'CM', 'GPT-4o', 9, true, now() - interval '1 day'),
('Cameroun', 'CM', 'Claude 3 Opus', 7, true, now() - interval '12 hours'),
('Cameroun', 'CM', 'Gemini 1.5 Pro', 6, true, now() - interval '5 hours'),
('Cameroun', 'CM', 'GPT-4o', 8, true, now() - interval '4 hours'),
('Cameroun', 'CM', 'Claude 3.5 Sonnet', 10, true, now() - interval '3 hours'),
('Cameroun', 'CM', 'Claude 3.5 Sonnet', 9, true, now() - interval '2 hours'),
('Cameroun', 'CM', 'GPT-4o', 8, true, now() - interval '1 hour'),
('Cameroun', 'CM', 'Gemini 1.5 Pro', 7, true, now() - interval '45 minutes'),
('Cameroun', 'CM', 'Claude 3 Opus', 9, true, now() - interval '30 minutes'),
('Cameroun', 'CM', 'GPT-4o', 10, true, now() - interval '20 minutes'),
('Cameroun', 'CM', 'Claude 3.5 Sonnet', 8, true, now() - interval '15 minutes'),
('Cameroun', 'CM', 'Claude 3 Opus', 7, true, now() - interval '10 minutes'),
('Cameroun', 'CM', 'GPT-4o', 9, true, now() - interval '8 minutes'),
('Cameroun', 'CM', 'Gemini 1.5 Pro', 8, true, now() - interval '5 minutes'),
('Cameroun', 'CM', 'Claude 3.5 Sonnet', 9, true, now() - interval '4 minutes'),
('Cameroun', 'CM', 'Claude 3.5 Sonnet', 10, true, now() - interval '3 minutes'),
('Cameroun', 'CM', 'GPT-4o', 7, true, now() - interval '2 minutes'),
('Cameroun', 'CM', 'Claude 3 Opus', 8, true, now() - interval '1 minute'),
('Cameroun', 'CM', 'Claude 3.5 Sonnet', 9, true, now()),

-- Gabon (GA) - 15 votes
('Gabon', 'GA', 'Claude 3.5 Sonnet', 8, true, now() - interval '1 day'),
('Gabon', 'GA', 'GPT-4o', 7, true, now() - interval '10 hours'),
('Gabon', 'GA', 'Gemini 1.5 Pro', 9, true, now() - interval '8 hours'),
('Gabon', 'GA', 'Claude 3.5 Sonnet', 8, true, now() - interval '6 hours'),
('Gabon', 'GA', 'GPT-4o', 10, true, now() - interval '5 hours'),
('Gabon', 'GA', 'Claude 3 Opus', 7, true, now() - interval '3 hours'),
('Gabon', 'GA', 'Claude 3.5 Sonnet', 9, true, now() - interval '2 hours'),
('Gabon', 'GA', 'GPT-4o', 8, true, now() - interval '1 hour'),
('Gabon', 'GA', 'Gemini 1.5 Pro', 7, true, now() - interval '50 minutes'),
('Gabon', 'GA', 'Claude 3.5 Sonnet', 9, true, now() - interval '40 minutes'),
('Gabon', 'GA', 'GPT-4o', 10, true, now() - interval '25 minutes'),
('Gabon', 'GA', 'Claude 3 Opus', 8, true, now() - interval '15 minutes'),
('Gabon', 'GA', 'Claude 3.5 Sonnet', 9, true, now() - interval '10 minutes'),
('Gabon', 'GA', 'GPT-4o', 7, true, now() - interval '5 minutes'),
('Gabon', 'GA', 'Claude 3.5 Sonnet', 8, true, now() - interval '2 minutes'),

-- République Démocratique du Congo (CD) - 15 votes
('RDC', 'CD', 'GPT-4o', 9, true, now() - interval '2 days'),
('RDC', 'CD', 'Claude 3.5 Sonnet', 8, true, now() - interval '1 day'),
('RDC', 'CD', 'Claude 3 Opus', 7, true, now() - interval '12 hours'),
('RDC', 'CD', 'Gemini 1.5 Pro', 8, true, now() - interval '8 hours'),
('RDC', 'CD', 'GPT-4o', 10, true, now() - interval '6 hours'),
('RDC', 'CD', 'Claude 3.5 Sonnet', 9, true, now() - interval '4 hours'),
('RDC', 'CD', 'Claude 3.5 Sonnet', 8, true, now() - interval '3 hours'),
('RDC', 'CD', 'GPT-4o', 9, true, now() - interval '2 hours'),
('RDC', 'CD', 'Gemini 1.5 Pro', 7, true, now() - interval '1 hour'),
('RDC', 'CD', 'Claude 3 Opus', 8, true, now() - interval '45 minutes'),
('RDC', 'CD', 'GPT-4o', 10, true, now() - interval '30 minutes'),
('RDC', 'CD', 'Claude 3.5 Sonnet', 9, true, now() - interval '20 minutes'),
('RDC', 'CD', 'Claude 3.5 Sonnet', 8, true, now() - interval '10 minutes'),
('RDC', 'CD', 'GPT-4o', 7, true, now() - interval '5 minutes'),
('RDC', 'CD', 'Gemini 1.5 Pro', 9, true, now() - interval '1 minute'),

-- Congo Brazzaville (CG) - 10 votes
('Congo', 'CG', 'Claude 3.5 Sonnet', 8, true, now() - interval '1 day'),
('Congo', 'CG', 'GPT-4o', 9, true, now() - interval '15 hours'),
('Congo', 'CG', 'Claude 3 Opus', 7, true, now() - interval '10 hours'),
('Congo', 'CG', 'Claude 3.5 Sonnet', 8, true, now() - interval '5 hours'),
('Congo', 'CG', 'GPT-4o', 10, true, now() - interval '3 hours'),
('Congo', 'CG', 'Gemini 1.5 Pro', 7, true, now() - interval '2 hours'),
('Congo', 'CG', 'Claude 3.5 Sonnet', 9, true, now() - interval '1 hour'),
('Congo', 'CG', 'GPT-4o', 8, true, now() - interval '30 minutes'),
('Congo', 'CG', 'Claude 3 Opus', 9, true, now() - interval '15 minutes'),
('Congo', 'CG', 'Claude 3.5 Sonnet', 8, true, now() - interval '5 minutes'),

-- Autres pays d'Afrique (Tchad, RCA, etc.) - 5 votes
('Tchad', 'TD', 'GPT-4o', 8, true, now() - interval '1 day'),
('RCA', 'CF', 'Claude 3.5 Sonnet', 7, true, now() - interval '12 hours'),
('Guinée Équat.', 'GQ', 'GPT-4o', 9, true, now() - interval '6 hours'),
('Tchad', 'TD', 'Claude 3 Opus', 8, true, now() - interval '2 hours'),
('RCA', 'CF', 'Claude 3.5 Sonnet', 9, true, now() - interval '30 minutes'),

-- Reste du monde (France, USA, etc.) - 5 votes (pour le comparatif)
('France', 'FR', 'Claude 3.5 Sonnet', 8, false, now() - interval '2 days'),
('États-Unis', 'US', 'GPT-4o', 9, false, now() - interval '1 day'),
('Japon', 'JP', 'Gemini 1.5 Pro', 7, false, now() - interval '12 hours'),
('France', 'FR', 'GPT-4o', 10, false, now() - interval '5 hours'),
('États-Unis', 'US', 'Claude 3 Opus', 8, false, now() - interval '1 hour');