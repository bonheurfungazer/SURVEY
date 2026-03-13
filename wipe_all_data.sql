BEGIN;

-- 1. Nettoyer les votes (table public)
TRUNCATE TABLE public.votes;

-- 2. Nettoyer les utilisateurs authentifiés (table auth.users)
-- Ceci entraînera la suppression en cascade de toutes les autres tables liées à cet ID d'utilisateur.
DELETE FROM auth.users;

COMMIT;
