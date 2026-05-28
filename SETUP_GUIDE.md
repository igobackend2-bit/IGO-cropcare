# Complete Setup Guide for CropCare Platform

## Step 1: Supabase Configuration

### Create Supabase Project
1. Visit https://supabase.com
2. Click "New Project"
3. Fill in project details:
   - Name: `cropcare` (or your preferred name)
   - Password: (strong password)
   - Region: Choose closest to your users (India recommended: Singapore)
4. Wait for project to initialize (~2 minutes)

### Get Credentials
1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Keep service_role_key safe, use only on server)

## Step 2: Database Schema

### Run in Supabase SQL Editor
1. Go to SQL Editor → New Query
2. Copy and paste entire schema below
3. Click "Run"

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  detailed_description TEXT,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2),
  image_url TEXT,
  additional_images TEXT[], -- Array of image URLs
  rating DECIMAL(3, 1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  stock INT DEFAULT 0,
  brand VARCHAR(100),
  manufacturer VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  specifications JSONB,
  usage_instructions TEXT,
  benefits TEXT,
  best_for_crops TEXT[], -- Array of crops
  pest_disease_control TEXT[], -- Array of pests/diseases
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
  payment_method VARCHAR(50), -- card, upi, netbanking, etc
  shipping_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name VARCHAR(255),
  product_brand VARCHAR(100),
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount_per_unit DECIMAL(10, 2),
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  helpful_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist/Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Cart sessions (temporary)
CREATE TABLE cart_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- OTP storage for authentication
CREATE TABLE otp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 minutes',
  is_used BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_cart_user_id ON cart_sessions(user_id);
CREATE INDEX idx_otp_phone ON otp_logs(phone);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users FOR UPDATE
  USING (auth.uid() = id);

-- Orders - users can only see their own
CREATE POLICY "Users can see own orders" ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Reviews - users can read all, write their own
CREATE POLICY "Everyone can read reviews" ON reviews FOR SELECT
  USING (TRUE);

-- Favorites - users can manage their own
CREATE POLICY "Users manage own favorites" ON favorites
  USING (auth.uid() = user_id);
```

## Step 3: Enable Authentication

1. Go to Authentication → Providers
2. Enable "Email" provider
3. Configure email templates if needed
4. Generate dummy data (optional) for testing

## Step 4: Sample Data (Optional)

```sql
-- Insert sample products
INSERT INTO products (name, description, category, price, discount, image_url, rating, reviews_count, stock, brand) VALUES
('Premium Tomato Seeds F1 Hybrid', 'High-yield hybrid tomato seeds suitable for all seasons', 'seeds', 1200, 200, 'https://images.unsplash.com/photo-1590789033100-9f60a05a613d?w=400', 4.5, 245, 50, 'Syngenta'),
('NPK 19:19:19 Water Soluble Fertilizer', 'Balanced nutrition for fast crop growth', 'fertilizers', 450, 75, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 4.8, 389, 120, 'Katyayani'),
('Roundup Herbicide Glyphosate 41%', 'Non-selective weed control for effective results', 'herbicides', 225, 50, 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e58?w=400', 4.6, 156, 80, 'Bayer'),
('Neem Oil Bio Insecticide', 'Natural pest control with 10000 PPM Azadirachtin', 'insecticides', 1150, 300, 'https://images.unsplash.com/photo-1584308666744-24d5f400f828?w=400', 4.7, 423, 60, 'Greenpeace');
```

## Step 5: Environment Configuration

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Email (optional - for production)
SENDGRID_API_KEY=SG.your_sendgrid_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@cropcare.app
```

## Step 6: Install Dependencies

```bash
npm install
```

## Step 7: Run Development

```bash
npm run dev
```

Visit http://localhost:3000

## Step 8: Test Authentication

1. Click "Login"
2. Enter 10-digit phone number: `9876543210`
3. Received OTP displayed in demo mode
4. Enter OTP to verify
5. Account created successfully

## Troubleshooting

### Supabase Connection Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Ensure project is running
- Check network connectivity

### Database Tables Not Visible
- Run SQL in Supabase SQL Editor
- Verify schema is created
- Check table permissions

### OTP Not Working
- In production: Configure SendGrid
- For development: OTP shown in modal (check console)
- Verify table `otp_logs` exists

## Next Steps

1. ✅ Set up Supabase
2. ✅ Configure environment
3. ✅ Run development server
4. ✅ Test authentication
5. ➡️ Add payment gateway (Razorpay/Stripe)
6. ➡️ Configure email service
7. ➡️ Deploy to Vercel
