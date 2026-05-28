# 🚀 Deployment Guide - CropCare on Vercel

## Prerequisites

- GitHub account with repository
- Vercel account (free)
- Supabase credentials configured
- (Optional) Custom domain

## Step 1: Push to GitHub

### Initialize Git Repository

```bash
cd igo-cropcare
git init
git add .
git commit -m "Initial commit: CropCare agricultural e-commerce platform"
git branch -M main
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `igo-cropcare`
3. Copy HTTPS URL

### Push Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/igo-cropcare.git
git push -u origin main
```

## Step 2: Deploy on Vercel

### Option A: GitHub Integration (Recommended)

1. Visit https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Select your GitHub account
5. Find and select `igo-cropcare` repository
6. Click "Import"

### Option B: Manual Upload

1. Visit https://vercel.com
2. Upload project folder
3. Configure settings

## Step 3: Configure Environment Variables

### In Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Add the following:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SENDGRID_API_KEY = your_sendgrid_api_key (optional)
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
NODE_ENV = production
```

3. Save and redeploy

### Test Environment Variables

Ensure variables are set for:
- Production
- Preview
- Development (if needed)

## Step 4: Deploy

### Automatic Deployment

Once configured, Vercel automatically deploys:
- On every push to `main` branch
- On pull requests (preview deployment)

### Manual Deployment

1. In Vercel Dashboard
2. Click "Deployments"
3. Click "Create Deployment"

### Check Deployment Status

```
✅ Analysis Complete
✅ Build Started
✅ Build Complete
✅ Deployment Complete
```

Visit the provided URL to test

## Step 5: Configure Custom Domain (Optional)

### Add Domain

1. Go to Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain: `cropcare.app`
4. Click "Add"

### Configure DNS

Follow Vercel's DNS configuration steps:
- Add CNAME record pointing to Vercel
- Or use Vercel Nameservers (recommended)

**DNS Setup (Example):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

Wait 24-48 hours for DNS propagation

## Step 6: HTTPS & Security

Vercel automatically provides:
- ✅ Free HTTPS/SSL certificate
- ✅ Auto-renewal
- ✅ Security headers configured
- ✅ DDoS protection

No additional configuration needed!

## Step 7: Post-Deployment Checklist

### Functionality Testing

- [ ] Home page loads
- [ ] Products display correctly
- [ ] Search and filters work
- [ ] Login with OTP works
- [ ] Cart functionality works
- [ ] Mobile responsive
- [ ] Performance acceptable

### Security Verification

- [ ] HTTPS enabled
- [ ] Environment variables hidden
- [ ] Database credentials secure
- [ ] No console errors

### Analytics Setup (Optional)

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Monitoring & Maintenance

### View Logs

1. Vercel Dashboard → Project
2. Click "Deployments"
3. View deployment logs
4. Check Function logs for errors

### Update Application

```bash
# Make changes locally
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# Vercel automatically redeploys
```

### Rollback Deployment

1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Database Backups

### Supabase Backup

1. Visit Supabase dashboard
2. Project → Settings → Database
3. Configure automated backups
4. Set retention period (7+ days)

### Manual Export

```sql
-- Export database schema
```

## Environment-Specific Configuration

### Production URLs

- **Main**: `https://cropcare.app`
- **Preview**: `https://cropcare-[hash].vercel.app`
- **Local Dev**: `http://localhost:3000`

### Environment Variable Overrides

```
# Production
NEXT_PUBLIC_APP_URL=https://cropcare.app

# Preview
NEXT_PUBLIC_APP_URL=https://preview.cropcare.app

# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Performance Optimization

### Vercel Analytics

Monitor:
- Page load times
- Core Web Vitals
- API response times

Dashboard: https://vercel.com/insights

### Optimization Tips

1. **Enable Image Optimization**
   - Use Next.js Image component
   - Auto-optimization on Vercel

2. **Code Splitting**
   - Already configured in Next.js
   - Lazy load components

3. **Database Optimization**
   - Use Supabase indexes
   - Monitor query performance

4. **Caching Strategy**
   - Configure cache headers
   - Use ISR (Incremental Static Regeneration)

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- Solution: Run `npm install` locally, push changes

**Error**: `Build timeout`
- Solution: Optimize build, check for large dependencies

### Runtime Errors

**Error**: `Supabase connection failed`
- Solution: Verify environment variables are set
- Check Supabase project status

**Error**: `Function execution timeout`
- Solution: Optimize database queries
- Implement caching

### Deployment Issues

**Issue**: Deployment stuck
- Solution: Cancel and retry from Vercel dashboard

**Issue**: Old code still showing
- Solution: 
  1. Clear browser cache
  2. Hard refresh (Ctrl+Shift+R)
  3. Check deployment status

## Advanced Configuration

### Custom Build Command

In `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev"
}
```

### Custom Routes

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

### Caching Headers

```javascript
// next.config.js
module.exports = {
  headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60' }
        ]
      }
    ]
  }
}
```

## Scaling & Growth

### Handle Increased Traffic

1. **Database**: Supabase auto-scales
2. **CDN**: Vercel provides global CDN
3. **Serverless**: Auto-scaling functions
4. **Monitoring**: Set up alerts

### Performance at Scale

- ✅ Built-in caching
- ✅ Edge Functions (if needed)
- ✅ Global CDN distribution
- ✅ Automatic scaling

## Cost Management

### Estimated Costs (Monthly)

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | ✅ | 100GB bandwidth free |
| Supabase | ✅ | 500MB storage free |
| SendGrid | ✅ | 100 emails/day free |
| Total | **FREE** | Perfect for MVP |

### Production Tier

- Vercel: $20/month (pro plan)
- Supabase: $25/month (starter)
- SendGrid: $9.95/month (1000 emails)
- **Total**: ~$55/month

## Going Live Checklist

- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Email service configured
- [ ] Database backups enabled
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] CDN enabled
- [ ] Performance optimized
- [ ] Security headers set
- [ ] Monitoring active
- [ ] Support email configured
- [ ] Terms & Privacy pages added

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.io/docs
- Next.js Docs: https://nextjs.org/docs

---

**Deployment successful! Your CropCare platform is live! 🚀**
