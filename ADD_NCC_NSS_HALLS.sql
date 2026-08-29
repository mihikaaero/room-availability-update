-- Adds lecture halls L1, L2, L3, L8, L9 as bookable venues for ALL organisations.
-- Run once in Supabase Dashboard -> SQL Editor (only the database owner can add venues;
-- the app's database role is read-only for the venues table by design).
INSERT INTO public.venues (code, label, sort_order) VALUES
  ('L1', 'Lecture Hall L1', 1),
  ('L2', 'Lecture Hall L2', 2),
  ('L3', 'Lecture Hall L3', 3),
  ('L8', 'Lecture Hall L8', 8),
  ('L9', 'Lecture Hall L9', 9)
ON CONFLICT (code) DO NOTHING;
