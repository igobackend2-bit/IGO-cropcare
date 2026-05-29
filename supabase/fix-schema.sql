-- =================================================================================
-- IGO CropCare — Schema Fix & Enhancement Migration
-- Run this in Supabase SQL Editor to fix all known issues
-- =================================================================================

-- ---------------------------------------------------------------------------------
-- FIX 1: Update products.category constraint to include all app categories
-- The original constraint was missing: organic, garden, implements, crop-protection
-- ---------------------------------------------------------------------------------

-- Drop the old constraint
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the corrected constraint covering ALL categories used in the app
ALTER TABLE public.products
  ADD CONSTRAINT products_category_check
  CHECK (category IN (
    'fertilizers',
    'seeds',
    'crop_care',
    'protein_cuts',
    'equipment',
    'herbicides',
    'insecticides',
    'fungicides',
    'tools',
    'organic',
    'garden',
    'implements',
    'crop-protection',
    'bio',
    'micronutrients'
  ));

-- ---------------------------------------------------------------------------------
-- FIX 2: Add missing columns to users table (needed by checkout page)
-- ---------------------------------------------------------------------------------

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS address     TEXT,
  ADD COLUMN IF NOT EXISTS city        TEXT,
  ADD COLUMN IF NOT EXISTS state       TEXT,
  ADD COLUMN IF NOT EXISTS pincode     TEXT,
  ADD COLUMN IF NOT EXISTS farm_size   DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS crop_types  TEXT[],
  ADD COLUMN IF NOT EXISTS avatar_url  TEXT;

-- ---------------------------------------------------------------------------------
-- FIX 3: Add payment_method and shipping_address to orders (if missing)
-- ---------------------------------------------------------------------------------

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_address JSONB,
  ADD COLUMN IF NOT EXISTS payment_method   TEXT DEFAULT 'cod'
    CHECK (payment_method IN ('razorpay', 'cod')),
  ADD COLUMN IF NOT EXISTS payment_status   TEXT DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  ADD COLUMN IF NOT EXISTS tracking_number  TEXT,
  ADD COLUMN IF NOT EXISTS courier          TEXT;

-- ---------------------------------------------------------------------------------
-- FIX 4: Create LEADS table (CRM — B2B form submissions)
-- ---------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.leads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  company             TEXT,
  city                TEXT,
  state               TEXT,
  business_type       TEXT,
  monthly_volume      TEXT,
  intent_product_id   UUID REFERENCES public.products(id) ON DELETE SET NULL,
  source              TEXT DEFAULT 'b2b_form',
  status              TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a lead (B2B form submission)
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Only admins can view leads
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------------
-- FIX 5: Create PAGE_VIEWS table (Analytics)
-- ---------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.page_views (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path        TEXT NOT NULL,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  referrer    TEXT,
  device_type TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view page views" ON public.page_views;
CREATE POLICY "Admins can view page views"
  ON public.page_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------------
-- FIX 6: Create ADMIN_SETTINGS table (Banners, Feature Flags, etc.)
-- ---------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key   TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read admin settings" ON public.admin_settings;
CREATE POLICY "Everyone can read admin settings"
  ON public.admin_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.admin_settings;
CREATE POLICY "Admins can manage settings"
  ON public.admin_settings
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------------
-- FIX 7: Create WISHLISTS table (persistent wishlist for logged-in users)
-- ---------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.wishlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their wishlist" ON public.wishlists;
CREATE POLICY "Users can manage their wishlist"
  ON public.wishlists
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------------
-- FIX 8: Create USER_CROPS table (Crop Calendar / seasonal planner)
-- ---------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_crops (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES public.users(id) ON DELETE CASCADE,
  crop_type             TEXT NOT NULL,
  sowing_date           DATE NOT NULL,
  expected_harvest_date DATE,
  area_acres            DECIMAL(10, 2),
  location              TEXT,
  variety               TEXT,
  status                TEXT DEFAULT 'growing'
    CHECK (status IN ('planned', 'growing', 'harvested', 'failed')),
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_crops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their crops" ON public.user_crops;
CREATE POLICY "Users can manage their crops"
  ON public.user_crops
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------------
-- FIX 9: Create B2B_APPLICATIONS table (dealer applications from B2B form)
-- ---------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.b2b_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    TEXT NOT NULL,
  contact_person  TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  city            TEXT,
  state           TEXT,
  business_type   TEXT,
  monthly_volume  TEXT,
  status          TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.b2b_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit b2b application" ON public.b2b_applications;
CREATE POLICY "Anyone can submit b2b application"
  ON public.b2b_applications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view b2b applications" ON public.b2b_applications;
CREATE POLICY "Admins can view b2b applications"
  ON public.b2b_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------------
-- FIX 10: Users RLS — allow users to read and update their own profile
-- ---------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---------------------------------------------------------------------------------
-- FIX 11: Admin can view all users and orders
-- ---------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
CREATE POLICY "Admin can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u2
      WHERE u2.id = auth.uid() AND u2.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
CREATE POLICY "Admin can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
CREATE POLICY "Admin can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------------
-- FIX 12: Products — admin can insert/update/delete
-- ---------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
CREATE POLICY "Admin can manage products"
  ON public.products
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------------
-- SEED: Insert default admin_settings entries
-- ---------------------------------------------------------------------------------

INSERT INTO public.admin_settings (setting_key, setting_value)
VALUES
  ('site_banner', '{"enabled": false, "message": "", "type": "info"}'),
  ('flash_sale_active', '{"enabled": false, "ends_at": null}'),
  ('free_delivery_threshold', '{"amount": 999}'),
  ('cod_available', '{"enabled": true}'),
  ('razorpay_enabled', '{"enabled": true}')
ON CONFLICT (setting_key) DO NOTHING;

-- =================================================================================
-- END OF MIGRATION
-- =================================================================================
