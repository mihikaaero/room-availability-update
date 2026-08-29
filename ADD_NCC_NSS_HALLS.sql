-- Run this once in your Supabase Dashboard → SQL Editor to add the NCC/NSS halls.
-- The app UI already restricts these rooms to NCC and NSS; this just creates the venue rows.
INSERT INTO public.venues (code, label, sort_order) VALUES
  ('L1', 'Lecture Hall L1', 1),
  ('L2', 'Lecture Hall L2', 2),
  ('L3', 'Lecture Hall L3', 3),
  ('L8', 'Lecture Hall L8', 8),
  ('L9', 'Lecture Hall L9', 9)
ON CONFLICT (code) DO NOTHING;
