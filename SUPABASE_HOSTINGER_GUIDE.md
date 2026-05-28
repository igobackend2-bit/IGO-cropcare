# IGO CropCare — Complete Setup & Deployment Guide
# Supabase Database + Hostinger Deployment

---

## PART 1: CONNECT SUPABASE DATABASE

### Step 1 — Create Your Supabase Project

1. Go to https://supabase.com and click **Start your project** (it's free)
2. Sign up with your email (igobackend3@gmail.com) or Google account
3. Click **New Project**
4. Fill in:
   - **Project Name:** `igo-cropcare`
   - **Database Password:** Create a strong password (SAVE this — you'll need it later)
   - **Region:** `Asia Pacific (Mumbai)` — closest to India
5. Click **Create new project** — wait 2–3 minutes for it to set up

---

### Step 2 — Get Your API Keys

1. In your Supabase dashboard, click **Project Settings** (gear icon, bottom left)
2. Click **API**
3. You will see two values:
   - **Project URL** — looks like: `https://abcdefghij.supabase.co`
   - **anon / public key** — a long JWT token starting with `eyJ...`
4. Copy both of these

---

### Step 3 — Set Up .env.local in Your Project

Open the file `D:\Igo-websites\Igo- Crop Care\.env.local` and update it:

```env
# Supabase — Replace with YOUR actual values from Step 2
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJYOUR_ACTUAL_ANON_KEY_HERE

# App URL — change to your Hostinger domain when deployed
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: AI API keys (add when ready)
# GEMINI_API_KEY=your_google_gemini_key
# OPENAI_API_KEY=your_openai_key

# Optional: Email
# SENDGRID_API_KEY=your_sendgrid_key
```

**IMPORTANT:** Never share your `.env.local` file. It's already in `.gitignore`.

---

### Step 4 — Create Database Tables (Run this SQL)

1. In Supabase dashboard, click **SQL Editor** (left menu)
2. Click **New query**
3. Copy and paste the SQL below and click **Run**:

```sql
-- ============================================================
-- IGO CropCare — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────
-- PRODUCTS TABLE
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL CHECK (category IN ('seeds','fertilizers','insecticides','fungicides','herbicides','organic','implements','tools','garden')),
  sub_category  TEXT,
  crop_type     TEXT,                    -- e.g. tomato, paddy, cotton
  price         DECIMAL(10,2) NOT NULL,
  discount      DECIMAL(10,2) DEFAULT 0,
  image_url     TEXT,
  rating        DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock         INTEGER DEFAULT 0,
  brand         TEXT,
  molecule      TEXT,                    -- active ingredient e.g. Mancozeb 75%
  dosage        TEXT,                    -- e.g. 2.5g per liter
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- USERS TABLE (extends Supabase Auth)
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  phone         TEXT,
  first_name    TEXT,
  last_name     TEXT,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  pincode       TEXT,
  farmer_type   TEXT,                    -- retail / dealer / farmer
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- ORDERS TABLE
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  total_amount  DECIMAL(10,2) NOT NULL,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','out_for_delivery','delivered','cancelled','refunded')),
  payment_mode  TEXT DEFAULT 'cod' CHECK (payment_mode IN ('cod','upi','card','netbanking','emi')),
  shipping_address TEXT,
  tracking_id   TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- ORDER ITEMS TABLE
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity      INTEGER NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- REVIEWS TABLE
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  is_verified   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- DIAGNOSES TABLE (AI crop diagnosis history)
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diagnoses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  input_type      TEXT NOT NULL CHECK (input_type IN ('text','image')),
  input_text      TEXT,
  image_url       TEXT,
  disease_name    TEXT,
  confidence      DECIMAL(5,4),
  severity        TEXT,
  result_json     JSONB,               -- full diagnosis result
  crop_type       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- WISHLIST TABLE
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ────────────────────────────────────────────────
-- B2B INQUIRIES TABLE
-- ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS b2b_inquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  business_name TEXT,
  city          TEXT,
  state         TEXT,
  crop_types    TEXT,
  quantity      TEXT,
  message       TEXT,
  status        TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','converted','closed')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────
-- INDEXES for performance
-- ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_crop_type  ON products(crop_type);
CREATE INDEX IF NOT EXISTS idx_products_brand      ON products(brand);
CREATE INDEX IF NOT EXISTS idx_orders_user_id      ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id  ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_user_id   ON diagnoses(user_id);

-- ────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — security policies
-- ────────────────────────────────────────────────
ALTER TABLE products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists     ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_inquiries ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read, only admins can write
CREATE POLICY "products_read_all"  ON products FOR SELECT USING (true);

-- Users: only the user themselves can read/update their row
CREATE POLICY "users_own_data"     ON users    FOR ALL USING (auth.uid() = id);

-- Orders: users see only their own orders
CREATE POLICY "orders_own_data"    ON orders   FOR ALL USING (auth.uid() = user_id);

-- Order items: accessible via order ownership
CREATE POLICY "order_items_via_order" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- Reviews: anyone can read; logged-in users can insert
CREATE POLICY "reviews_read_all"   ON reviews  FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON reviews  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Diagnoses: user sees their own; anonymous diagnoses visible to user
CREATE POLICY "diagnoses_own"      ON diagnoses FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Wishlists: users manage their own
CREATE POLICY "wishlists_own"      ON wishlists FOR ALL USING (auth.uid() = user_id);

-- B2B inquiries: anyone can insert (no auth required)
CREATE POLICY "b2b_insert_public"  ON b2b_inquiries FOR INSERT WITH CHECK (true);


-- ────────────────────────────────────────────────
-- SEED INITIAL PRODUCTS (optional — remove if you add products manually)
-- ────────────────────────────────────────────────
INSERT INTO products (name, description, category, price, discount, image_url, rating, reviews_count, stock, brand, molecule, dosage) VALUES
  ('NPK 19:19:19 Water Soluble Fertilizer', 'Balanced water-soluble NPK with micronutrients. For foliar spray and drip fertigation.', 'fertilizers', 450, 75, 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500', 4.9, 2389, 200, 'Katyayani', 'NPK 19-19-19', '3g per liter water'),
  ('Mancozeb Fungicide 75% WP', 'Broad-spectrum contact fungicide against blight, leaf spot, and downy mildew.', 'fungicides', 299, 45, 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=500', 4.6, 978, 180, 'UPL', 'Mancozeb 75% WP', '2-2.5g per liter'),
  ('Organic Neem Oil 10000 PPM', 'Cold-pressed neem oil with 10000 PPM Azadirachtin. Controls sucking pests organically.', 'organic', 850, 300, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', 4.7, 423, 60, 'Greenpeace', 'Azadirachtin 10000 PPM', '5ml per liter'),
  ('Hybrid Tomato F1 Seeds (10g)', 'High-yield, disease-resistant F1 hybrid tomato. 95%+ germination rate.', 'seeds', 999, 200, 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500', 4.8, 1245, 150, 'Syngenta', 'F1 Hybrid', '2.5kg per acre'),
  ('Glyphosate 41% SL Herbicide (1L)', 'Non-selective systemic herbicide for annual and perennial weeds.', 'herbicides', 175, 50, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', 4.6, 156, 80, 'Bayer', 'Glyphosate 41% SL', '1.5-2L per acre'),
  ('Imidacloprid 17.8% SL Insecticide', 'Systemic insecticide for sucking pests — aphids, whitefly, thrips, jassids.', 'insecticides', 285, 65, 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e58?w=500', 4.5, 310, 120, 'Bayer', 'Imidacloprid 17.8%', '0.3-0.5ml per liter')
ON CONFLICT DO NOTHING;
```

4. Click **RUN** — you should see "Success. No rows returned."

---

### Step 5 — Enable Authentication in Supabase

1. Go to **Authentication → Providers** in Supabase
2. Enable **Email** provider (already on by default)
3. Optionally enable **Phone** (OTP via SMS) — your app already supports this
4. Under **Auth → Settings**, set:
   - Site URL: `http://localhost:3000` (change to your Hostinger URL after deployment)
   - Redirect URLs: Add `http://localhost:3000/**` and `https://yourdomain.com/**`

---

### Step 6 — Test the Connection

1. In your project folder, run:
```bash
npm run dev
```
2. Open http://localhost:3000
3. The website should load and connect to Supabase automatically
4. Products will be seeded from your Supabase database

---

## PART 2: ADD REAL AI (OPTIONAL — Upgrade Crop Doctor)

### Option A: Google Gemini (Recommended — Free tier available)

1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API key**
3. Add to `.env.local`:
```env
GEMINI_API_KEY=your_key_here
```
4. Install:
```bash
npm install @google/generative-ai
```
5. In `app/api/ai/chat/route.ts` and `app/api/ai/vision/route.ts`, uncomment the Gemini code block (instructions are in comments at the top of each file)

### Option B: OpenAI GPT-4 Vision
1. Go to https://platform.openai.com/api-keys
2. Get API key and add to `.env.local`:
```env
OPENAI_API_KEY=your_key_here
```
3. Install: `npm install openai`
4. Follow the OpenAI instructions in the API file comments

---

## PART 3: DEPLOY TO HOSTINGER

### Step 1 — Build Your Project

In the project folder, run:
```bash
npm run build
```
If the build succeeds, you'll see a `.next` folder.

---

### Step 2 — Choose the Right Hostinger Plan

You need **Node.js hosting** (not basic shared hosting). Options:
- **Hostinger VPS** (recommended) — choose the smallest VPS plan
- **Hostinger Cloud Hosting** — also works with Node.js

> ⚠️ Basic shared hosting on Hostinger does NOT support Next.js. You need a plan that supports Node.js.

---

### Step 3 — Deploy on Hostinger VPS

#### 3a. SSH into your VPS
```bash
ssh root@YOUR_VPS_IP
```

#### 3b. Install Node.js (v18 or v20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version   # Should show v20.x.x
npm --version
```

#### 3c. Install PM2 (process manager — keeps app running)
```bash
npm install -g pm2
```

#### 3d. Install Git
```bash
sudo apt-get install -y git
```

#### 3e. Clone / Upload your project
**Option A — Git (recommended):**
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/igo-cropcare.git
cd igo-cropcare
```

**Option B — File upload:**
- Compress your project folder (excluding `node_modules` and `.next`)
- Upload via Hostinger's File Manager or via SCP
- Uncompress it in `/var/www/igo-cropcare`

#### 3f. Install dependencies and build
```bash
cd /var/www/igo-cropcare
npm install
```

Create the `.env.local` file on the server:
```bash
nano .env.local
```
Paste your environment variables (same as your local `.env.local`), change:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```
Press `Ctrl+X`, then `Y`, then `Enter` to save.

Build the project:
```bash
npm run build
```

#### 3g. Start with PM2
```bash
pm2 start npm --name "igo-cropcare" -- start
pm2 startup    # Auto-start on server reboot
pm2 save
```

Your app is now running on port `3000`.

---

### Step 4 — Set Up Nginx (Domain → App)

Install Nginx:
```bash
sudo apt-get install -y nginx
```

Create a site config:
```bash
sudo nano /etc/nginx/sites-available/igo-cropcare
```

Paste this (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/igo-cropcare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Step 5 — Point Your Domain to Hostinger VPS

1. Log in to your domain registrar (or Hostinger Domains)
2. Go to **DNS Management**
3. Add/update the **A record**:
   - Type: `A`
   - Name: `@` (and also `www`)
   - Value: `YOUR_VPS_IP_ADDRESS`
   - TTL: 3600
4. DNS propagation takes 15 minutes to 24 hours

---

### Step 6 — Add Free SSL (HTTPS)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the prompts. Certbot will auto-renew your SSL certificate.

---

### Step 7 — Update Supabase Settings for Production

1. Go to Supabase → **Authentication → Settings**
2. Change Site URL to: `https://yourdomain.com`
3. Add `https://yourdomain.com/**` to Redirect URLs
4. Update `.env.local` on the server:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```
5. Rebuild:
```bash
pm2 stop igo-cropcare
npm run build
pm2 start igo-cropcare
```

---

## PART 4: QUICK COMMANDS REFERENCE

```bash
# Check if app is running
pm2 status

# View app logs
pm2 logs igo-cropcare

# Restart app
pm2 restart igo-cropcare

# Deploy new code update
git pull
npm install
npm run build
pm2 restart igo-cropcare

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t
```

---

## PART 5: CHECKLIST BEFORE GOING LIVE

- [ ] `.env.local` has real Supabase URL and anon key
- [ ] All Supabase tables created (ran the SQL above)
- [ ] `npm run build` completes without errors locally
- [ ] Domain DNS pointed to VPS
- [ ] SSL certificate installed (HTTPS)
- [ ] WhatsApp number updated in the website (search for `91XXXXXXXXXX` and replace)
- [ ] Test: visit homepage, run AI diagnosis, add product to cart
- [ ] Update Supabase Site URL to production domain
- [ ] Test: register as new user, place test order

---

## NEED HELP?

- Supabase Docs: https://supabase.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- PM2 Docs: https://pm2.keymetrics.io/docs

Contact: igobackend3@gmail.com
