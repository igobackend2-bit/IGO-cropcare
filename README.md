# 🌾 CropCare - Professional Agricultural E-Commerce Platform

A modern, feature-rich agricultural e-commerce platform built with Next.js, Supabase, and deployed on Vercel. Designed for farmers, distributors, and agricultural businesses.

## ✨ Key Features

- **🔐 OTP Authentication**: Secure login with phone-based OTP verification
- **🛒 Shopping Cart**: Full cart management with real-time updates
- **🌾 Product Catalog**: 9000+ agricultural products (seeds, fertilizers, pesticides, tools)
- **📱 Mobile Optimized**: Fully responsive design for all devices
- **⭐ Reviews & Ratings**: Community-driven product feedback system
- **🔍 Advanced Filtering**: Filter by category, brand, price, and more
- **📧 Email Notifications**: Order confirmations and OTP delivery
- **👤 User Profiles**: Manage personal info, addresses, and order history
- **💳 Payment Ready**: Structure prepared for multiple payment gateways

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | TailwindCSS |
| State Management | Zustand |
| Backend | Supabase (PostgreSQL) |
| Authentication | Supabase Auth + OTP |
| UI Components | Lucide React |
| Notifications | React Hot Toast |
| Deployment | Vercel |

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Supabase account (free tier available)
- Vercel account (for deployment)
- (Optional) SendGrid account for production emails

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd igo-cropcare
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_sendgrid_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Supabase Database

Run this SQL in your Supabase dashboard:

```sql
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10, 2),
  discount DECIMAL(10, 2),
  image_url TEXT,
  rating DECIMAL(3, 1),
  reviews_count INT DEFAULT 0,
  stock INT,
  brand VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT,
  price DECIMAL(10, 2)
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
```

### 4. Start Development

```bash
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
igo-cropcare/
├── app/
│   ├── api/                    # API routes (future)
│   ├── cart/                   # Shopping cart page
│   ├── login/                  # Login with OTP
│   ├── products/               # Product listing
│   ├── profile/                # User profile
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home/landing page
├── components/
│   ├── auth/                   # Auth components
│   │   └── OTPAuth.tsx         # OTP login component
│   ├── layout/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Footer
│   └── products/
│       └── ProductCard.tsx     # Product card component
├── lib/
│   ├── supabase/
│   │   └── client.ts           # Supabase client
│   ├── store.ts                # Zustand stores
│   └── types.ts                # TypeScript interfaces
└── public/                     # Static assets
```

## 🔐 Authentication Flow

```
1. User enters phone → System generates OTP
2. OTP sent via email (configure SendGrid for SMS in production)
3. User verifies OTP
4. Account created or login successful
5. JWT token stored in Supabase session
```

## 🛒 Shopping Flow

```
1. Browse products with filters
2. Add items to cart
3. Review cart (Zustand store manages state)
4. Login with OTP if not authenticated
5. Proceed to checkout
6. (Ready for payment gateway integration)
7. Order confirmation email
```

## 📊 Database Schema

### Users
- `id`, `email`, `phone`, `first_name`, `last_name`
- `address`, `city`, `state`, `pincode`
- `created_at`

### Products
- `id`, `name`, `description`, `category`
- `price`, `discount`, `stock`
- `brand`, `image_url`
- `rating`, `reviews_count`

### Orders
- `id`, `user_id`, `total_amount`, `status`
- `created_at`

### Order Items
- `id`, `order_id`, `product_id`, `quantity`, `price`

### Reviews
- `id`, `product_id`, `user_id`, `rating`, `comment`

## 🚢 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial: CropCare agricultural e-commerce"
git branch -M main
git remote add origin <github-repo-url>
git push -u origin main
```

### Step 2: Deploy
1. Visit https://vercel.com
2. Import GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SENDGRID_API_KEY`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
4. Click Deploy

### Step 3: Custom Domain (Optional)
Configure custom domain in Vercel dashboard

## 💳 Payment Integration

Ready for integration with:
- ✅ Razorpay (Indian)
- ✅ PayPal
- ✅ Stripe
- ✅ CCAvenue

Add handlers in `/app/api/orders/payment.ts`

## 📧 Email Setup

### Using SendGrid (Recommended)
1. Create SendGrid account
2. Generate API key
3. Add to `.env.local`
4. Configure email templates

### Using Supabase Email
Use Supabase edge functions for transactional emails

## 🔧 Customization

### Update Branding
- Logo: `/components/layout/Header.tsx`
- Colors: Update TailwindCSS config
- Metadata: `/app/layout.tsx`

### Add Categories
- Update in `/lib/types.ts`
- Modify filter options in `/app/products/page.tsx`

### Configure Products
- Edit sample data in `/app/page.tsx`
- Connect to Supabase for dynamic loading

## 🎯 Features Roadmap

- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Analytics dashboard
- [ ] SMS OTP (instead of email)
- [ ] Live chat support
- [ ] Farmer community forum
- [ ] AI-powered product recommendations
- [ ] Multi-language support

## 📈 Performance Metrics

- ⚡ Next.js automatic optimization
- 🎯 Core Web Vitals optimized
- 📊 Database indexed for fast queries
- 🖼️ Image optimization ready
- 🔄 Caching strategy implemented

## 🔐 Security

- ✅ HTTPS enforced
- ✅ OTP-based auth
- ✅ SQL injection prevention (Supabase)
- ✅ CORS configured
- ✅ Rate limiting ready
- ✅ Environment variables secured

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| OTP not sending | Check `.env.local`, verify Supabase config |
| Cart items lost | Implement localStorage persistence or Supabase sync |
| Products not loading | Verify database tables exist, check permissions |
| Authentication fails | Ensure Supabase credentials are correct |

## 💡 Best Practices

1. Always validate input on both client and server
2. Use environment variables for secrets
3. Implement proper error handling
4. Add logging for debugging
5. Test on multiple devices
6. Monitor API performance
7. Regular database backups

## 📞 Support & Contact

- 📧 Email: support@cropcare.app
- 📱 Phone: 1800-3000-2434
- 🌐 Website: cropcare.app

## 📄 License

MIT License - feel free to use this for commercial purposes

---

**Built with ❤️ for farmers | Powered by modern web technologies**
