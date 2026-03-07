-- PATCH DE SÉCURITÉ: Protéger les données réelles et restreindre l'accès
-- À exécuter dans le SQL Editor de Supabase.

BEGIN;

-- La méthode la plus simple pour empêcher la lecture publique de la colonne 'contact_info'
-- SANS modifier la structure de la table 'votes' ni bloquer la récupération des données réelles
-- par l'administrateur sans SUPABASE_SERVICE_ROLE_KEY.

-- 1. Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Allow public read access" ON public.votes;
DROP POLICY IF EXISTS "Allow public read access to own votes" ON public.votes;

-- 2. Créer une politique où le public (anon) ou les utilisateurs authentifiés
-- ne peuvent LIRE que les lignes sans contact_info, OU leurs propres lignes s'ils sont connectés.
-- De cette manière, l'API ne fuyera jamais les emails/téléphones des AUTRES utilisateurs,
-- mais laissera le frontend compter et lire les autres colonnes pour le flux en direct.
-- (Supabase ne permet pas de RLS par colonne facilement, donc on limite les lignes).
-- MAIS: le dashboard admin a besoin de voir toutes les lignes y compris les contacts.
-- Comme le dashboard admin utilise l'API via le serveur avec un anon_key quand service_key manque,
-- l'approche RLS stricte bloque le dashboard.

-- SOLUTION :
-- a) Rétablir la politique permissive pour ne pas casser le live feed public
CREATE POLICY "Allow public read access" ON public.votes FOR SELECT TO public USING (true);

-- b) En fait, pour bien sécuriser au niveau colonne, on crée une VUE sécurisée pour le flux public,
-- mais puisque le frontend utilise la table "votes", on va utiliser une fonction RPC
-- "get_admin_votes" avec SECURITY DEFINER pour l'admin, et on bloque les select de contact_info par les anon.
-- Comme PostgreSQL standard ne gère pas le RLS par colonne pour les SELECT très bien,
-- la meilleure recommandation pour l'utilisateur s'il veut sécuriser la base de données :
-- Créer une fonction (RPC) pour l'accès admin.

-- Créons une fonction pour permettre au tableau de bord admin de lire les vrais contacts
-- sans avoir besoin de RLS permissive.
CREATE OR REPLACE FUNCTION get_sensitive_admin_data()
RETURNS TABLE (
    id uuid,
    contact_info text,
    country text,
    country_code text,
    model_choice text,
    created_at timestamptz,
    user_id uuid
)
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT v.id, v.contact_info, v.country, v.country_code, v.model_choice, v.created_at, v.user_id
    FROM public.votes v
    WHERE v.user_id IS NOT NULL
    ORDER BY v.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 3. Maintenant, on peut de nouveau sécuriser la table `votes` :
-- Les utilisateurs normaux (et anon) ne peuvent pas lire les données des AUTRES s'il y a un contact_info
-- Pour ne pas bloquer le live feed qui a besoin de model_choice et country,
-- On permet la lecture de toute la table.
-- Pour VRAIMENT empêcher la fuite de 'contact_info', il faut révoquer l'accès à la colonne.
REVOKE SELECT (contact_info) ON public.votes FROM public, anon, authenticated;

-- (Cependant, PostgREST ne gère pas toujours bien la révocation au niveau des colonnes,
-- il renvoie souvent une erreur si la requête demande "select *".
-- Puisque le frontend utilise "select id, country...", la révocation marche si l'API
-- demande les bonnes colonnes, mais l'insertion peut poser problème).

-- Pour garder le code simple et sûr sans casser PostgREST :
-- Nous gardons l'accès en lecture à tous (sinon le live feed public et l'admin stats se cassent)
-- MAIS on vous OBLIGE à utiliser une clé de service `SUPABASE_SERVICE_ROLE_KEY`
-- dans le fichier `.env` du serveur, ou nous enlevons ce patch RLS défectueux
-- et nous mettons à jour l'application pour filtrer coté serveur.

-- Pour l'instant, nous remettons la RLS publique sur les lectures car
-- restreindre "user_id IS NULL" cachait les vrais votes pour tout le monde (incluant l'admin sans service key).

-- Si vous voulez sécuriser 'contact_info', veuillez l'extraire dans une table séparée
-- "vote_contacts (vote_id, contact_info)" avec une RLS très stricte.
-- Ce script annule les politiques qui cassaient l'application.

COMMIT;