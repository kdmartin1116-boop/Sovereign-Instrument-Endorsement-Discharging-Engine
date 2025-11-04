# 🚀 Deployment Guide - Sovereign Instrument Engine

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account with repository access
- Vercel account (free tier available)
- Gemini API key

### Deployment Steps

#### 1. **Vercel Dashboard Setup**
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your repository: `kdmartin1116-boop/Sovereign-Instrument-Endorsement-Discharging-Engine`
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### 2. **Environment Variables**
In Vercel Dashboard → Project Settings → Environment Variables, add:
```
GEMINI_API_KEY = your_actual_gemini_api_key_here
```

#### 3. **Deploy**
- Click "Deploy"
- Vercel will automatically build and deploy your app
- You'll get a production URL like: `https://sovereign-instrument-engine.vercel.app`

### Alternative: Netlify Deployment

#### 1. **Netlify Setup**
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect to GitHub and select your repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### 2. **Environment Variables**
In Netlify Dashboard → Site Settings → Environment Variables:
```
GEMINI_API_KEY = your_actual_gemini_api_key_here
```

### Custom Domain (Optional)
1. Purchase domain from registrar (GoDaddy, Namecheap, etc.)
2. In Vercel/Netlify dashboard, add custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

### Production Checklist
- [ ] Repository pushed to GitHub
- [ ] Environment variables configured
- [ ] Build completes successfully
- [ ] All features working in production
- [ ] Custom domain configured (optional)
- [ ] Analytics setup (optional)

### Monitoring & Maintenance
- Monitor deployment logs in Vercel/Netlify dashboard
- Set up error tracking with Sentry (optional)
- Regular dependency updates
- Performance monitoring with Web Vitals

### Cost Considerations
- **Vercel Free Tier**: 100GB bandwidth, unlimited personal projects
- **Netlify Free Tier**: 100GB bandwidth, 300 build minutes
- **Gemini API**: Pay-per-use (very affordable for typical usage)

---

## 🎯 **Quick Deploy Commands**

```bash
# Build locally to test
npm run build

# Preview production build
npm run preview

# Type check before deployment
npm run type-check
```

Your Sovereign Instrument Engine will be live and accessible worldwide! 🌍