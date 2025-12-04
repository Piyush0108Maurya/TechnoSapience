# TechnoSapiens - Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- Node.js (v14 or higher)
- npm or yarn
- A Netlify account
- Firebase project credentials

## Local Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment variables:**
```bash
cp .env.example .env.local
```

3. **Add your Firebase credentials to `.env.local`:**
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Run locally:**
```bash
npm start
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Deploying to Netlify

### Option 1: Using Netlify CLI

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Deploy:**
```bash
netlify deploy --prod
```

### Option 2: Using Netlify Web Dashboard

1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `build`
6. Add environment variables in Site Settings → Build & Deploy → Environment
7. Deploy

## Environment Variables on Netlify

In your Netlify dashboard:
1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Add all variables from `.env.example`
3. Redeploy the site

## Important Security Notes

⚠️ **NEVER commit `.env` files to Git**
- `.env` files are already in `.gitignore`
- Always use Netlify's environment variable settings for production

⚠️ **Firebase Credentials**
- Your Firebase credentials are sensitive
- Use environment variables, never hardcode them
- Restrict Firebase rules in your console

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Run `npm run build` locally to test
- Check build logs in Netlify dashboard

### Routing Issues
- Ensure `_redirects` file exists in `public/` folder
- Ensure `netlify.toml` is in the root directory
- Both files handle client-side routing

### Firebase Connection Issues
- Verify all environment variables are correct
- Check Firebase console for CORS issues
- Ensure Firebase rules allow your domain

## File Structure

```
techno-sapience/
├── public/
│   ├── _redirects          # Netlify routing config
│   ├── index.html
│   └── ...
├── src/
│   ├── firebase.js         # Uses environment variables
│   ├── App.js
│   └── ...
├── .env.example            # Template for environment variables
├── .gitignore              # Prevents committing sensitive files
├── netlify.toml            # Netlify configuration
└── package.json
```

## Next Steps

1. Update your Firebase credentials in environment variables
2. Test locally with `npm start`
3. Build with `npm run build`
4. Deploy to Netlify
5. Monitor deployment in Netlify dashboard
