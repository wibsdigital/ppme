# Vercel Deployment Guide

## Prerequisites
- Vercel account created
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js installed locally

## Step 1: Set Up Vercel Postgres Database

1. Go to your Vercel dashboard
2. Click "Add New" → "Database"
3. Choose "Postgres" (Neon)
4. Follow the setup wizard
5. Copy the `DATABASE_URL` from your database settings

## Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
DATABASE_URL=your_postgres_connection_string
NODE_ENV=production
```

## Step 3: Initialize Database

1. After deployment, run the schema initialization:
   - Access your deployed app
   - Navigate to `/api/init-db` (create this endpoint if needed)
   - Or use Vercel's database dashboard to run the schema.sql

## Step 4: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel
```

### Option B: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository in Vercel
3. Vercel will automatically deploy on push

## Step 5: Post-Deployment Setup

1. **Add Initial Admin User**:
   - Connect to your database
   - Run: `INSERT INTO users (id, username, password_hash, name, role) VALUES ('admin_1', 'admin', 'ppme2024', 'Administrator', 'Admin');`
   - Add treasurer: `INSERT INTO users (id, username, password_hash, name, role) VALUES ('treasurer_1', 'penningmeester', 'ppme2024', 'Penningmeester', 'Treasurer');`

2. **Add Default Settings**:
   ```sql
   INSERT INTO settings (id, organization_name, contribution_married, contribution_single, currency, default_payment_method, language)
   VALUES ('default', 'PPME Al Ikhlash Amsterdam', 20.00, 10.00, 'EUR', 'Bank Transfer', 'nl');
   ```

## Step 6: Test Your Application

1. Visit your deployed Vercel URL
2. Login with:
   - Username: `admin` or `penningmeester`
   - Password: `ppme2024`
3. Test member management and payment tracking

## Important Notes

- The current authentication uses simple password checking for demo purposes
- In production, implement proper password hashing with bcrypt
- Consider adding rate limiting and security headers
- Set up custom domain in Vercel settings if needed
- Monitor your database usage and costs

## Troubleshooting

- **Build Errors**: Check that all dependencies are in package.json
- **Database Connection**: Verify DATABASE_URL is correctly set
- **API Errors**: Check Vercel function logs in dashboard
- **CORS Issues**: API routes should work without CORS on same domain

## Custom Domain Setup

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned
