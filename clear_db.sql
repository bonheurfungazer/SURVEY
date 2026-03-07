-- SCRIPT DE NETTOYAGE DES DONNÉES DE TEST
-- À exécuter dans le SQL Editor de Supabase pour supprimer toutes les données de simulation.

BEGIN;

-- 1. Supprimer toutes les entrées de la table `votes`
TRUNCATE TABLE public.votes;

-- Fin du script
COMMIT;
