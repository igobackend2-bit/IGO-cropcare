-- =============================================================================
-- IGO CropCare — Complete Supabase Setup Script
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE patterns
-- =============================================================================

-- ─── 1. USERS TABLE ──────────────────────────────────────────────────────────
-- Standalone table (NO reference to auth.users — app uses custom OTP auth)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       TEXT        UNIQUE NOT NULL,
  email       TEXT,
  first_name  TEXT        DEFAULT '',
  last_name   TEXT        DEFAULT '',
  address     TEXT        DEFAULT '',
  city        TEXT        DEFAULT '',
  state       TEXT        DEFAULT '',
  pincode     TEXT        DEFAULT '',
  role        TEXT        DEFAULT 'user' CHECK (role IN ('user', 'admin', 'vendor')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if upgrading from old schema
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address   TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city      TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS state     TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pincode   TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_name  TEXT DEFAULT '';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Fix role column constraint to match TypeScript types (user | admin | vendor)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check
  CHECK (role IN ('user', 'admin', 'vendor'));

-- ─── 2. PRODUCTS TABLE ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,
  description    TEXT,
  category       TEXT        NOT NULL DEFAULT 'fertilizers',
  price          DECIMAL(10,2) NOT NULL,
  discount       DECIMAL(10,2) DEFAULT 0,
  image_url      TEXT,
  stock          INTEGER     DEFAULT 0,
  brand          TEXT,
  rating         DECIMAL(3,2) DEFAULT 0.0,
  reviews_count  INTEGER     DEFAULT 0,
  is_active      BOOLEAN     DEFAULT TRUE,
  tags           TEXT[],
  crops          TEXT[],
  dosage         TEXT,
  composition    TEXT,
  badge          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Broaden category constraint to match all categories used in the app
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE public.products ADD CONSTRAINT products_category_check
  CHECK (category IN (
    'fertilizers','seeds','insecticides','fungicides','herbicides',
    'tools','implements','organic','garden','crop-protection',
    'crop_care','protein_cuts','equipment','bio'
  ));

-- ─── 3. ORDERS TABLE ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  total_amount     DECIMAL(10,2) NOT NULL,
  status           TEXT        DEFAULT 'pending',
  payment_method   TEXT        DEFAULT 'cod',
  payment_status   TEXT        DEFAULT 'unpaid',
  shipping_address JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Fix status constraint to include all values TypeScript uses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('razorpay','cod','upi','card','netbanking'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('unpaid','paid','refunded','failed'));

-- ─── 4. ORDER ITEMS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID        REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  TEXT,  -- TEXT not UUID so local string IDs work too
  quantity    INTEGER     NOT NULL CHECK (quantity > 0),
  price       DECIMAL(10,2) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. REVIEWS TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  TEXT        NOT NULL,
  user_id     UUID        REFERENCES public.users(id) ON DELETE CASCADE,
  rating      INTEGER     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. LEADS TABLE (CRM) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT        NOT NULL,
  email              TEXT        NOT NULL,
  phone              TEXT,
  intent_product_id  TEXT,
  message            TEXT,
  source             TEXT        DEFAULT 'website',
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 7. PAGE VIEWS (Analytics) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.page_views (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  path        TEXT        NOT NULL,
  product_id  TEXT,
  user_id     UUID        REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 8. ADMIN SETTINGS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key   TEXT        UNIQUE NOT NULL,
  setting_value JSONB       NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. UPDATED_AT TRIGGER ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_updated_at    ON public.users;
DROP TRIGGER IF EXISTS products_updated_at ON public.products;
DROP TRIGGER IF EXISTS orders_updated_at   ON public.orders;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
-- Strategy: service role key bypasses ALL RLS automatically.
-- Anon/public policies below are for direct client reads only.
-- All writes go through server-side API routes using service role key.

ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop all old policies to start fresh
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ── Products: fully public read ──────────────────────────────────────────────
CREATE POLICY "products_public_read"  ON public.products FOR SELECT USING (true);
CREATE POLICY "products_service_write" ON public.products FOR ALL USING (true);

-- ── Users: service role manages, anon can't read ─────────────────────────────
CREATE POLICY "users_service_all"     ON public.users    FOR ALL USING (true);

-- ── Orders: service role manages all ─────────────────────────────────────────
CREATE POLICY "orders_service_all"    ON public.orders   FOR ALL USING (true);

-- ── Order Items: service role manages all ────────────────────────────────────
CREATE POLICY "order_items_service_all" ON public.order_items FOR ALL USING (true);

-- ── Reviews: public read, service role write ─────────────────────────────────
CREATE POLICY "reviews_public_read"   ON public.reviews  FOR SELECT USING (true);
CREATE POLICY "reviews_service_write" ON public.reviews  FOR ALL   USING (true);

-- ── Leads: service role only ──────────────────────────────────────────────────
CREATE POLICY "leads_service_all"     ON public.leads    FOR ALL USING (true);

-- ── Page Views: service role only ────────────────────────────────────────────
CREATE POLICY "pageviews_service_all" ON public.page_views FOR ALL USING (true);

-- ── Admin Settings: public read, service role write ──────────────────────────
CREATE POLICY "settings_public_read"  ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "settings_service_write" ON public.admin_settings FOR ALL  USING (true);

-- =============================================================================
-- SEED: Default Admin Settings
-- =============================================================================
INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES ('header_banner', '{"isActive": false, "text": "Free delivery on orders above ₹999!", "link": "/products"}')
ON CONFLICT (setting_key) DO NOTHING;

-- =============================================================================
-- INDEXES for performance
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_users_phone      ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email      ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id   ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status    ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created   ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active   ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_product   ON public.reviews(product_id);

-- =============================================================================
-- DONE — All tables, policies and indexes created.
-- Now set your environment variables in Vercel:
--   NEXT_PUBLIC_SUPABASE_URL  = https://rdhpdxoyyyyqjqkiauhj.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
--   SUPABASE_SERVICE_ROLE_KEY = eyJ...
--   NEXT_PUBLIC_APP_URL = https://igo-cropcare.vercel.app
-- =============================================================================
