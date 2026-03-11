# 🔐 Authentication Quick Fix Guide

## ⚠️ Current Issue
The app's sign-in and sign-up features require Clerk authentication to be configured. Without a valid Clerk publishable key, users cannot log in.

## ✅ Quick Fix (5 Minutes)

### Step 1: Get Your Clerk Publishable Key

1. **Create a free Clerk account** (if you don't have one):
   - Visit [https://clerk.com/](https://clerk.com/)
   - Click "Start building for free"
   - Sign up with GitHub or email

2. **Create a new application**:
   - In the Clerk Dashboard, click "Create Application"
   - Name it "TT Travels" (or any name you prefer)
   - Select your authentication methods:
     - ✅ Email (always enabled by default)
     - ✅ Google OAuth (recommended - check the box)
     - ✅ GitHub OAuth (recommended - check the box)
   - Click "Create Application"

3. **Get your Publishable Key**:
   - You'll be redirected to the API Keys page
   - Look for **"Publishable key"** (starts with `pk_test_`)
   - Click the **copy** button next to it

### Step 2: Add the Key to Your Project

1. **Open `.env.local` file** in the project root (already created for you)

2. **Replace the placeholder** with your actual key:
   ```bash
   # Change this:
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_placeholder
   
   # To this (with YOUR actual key):
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_abc123def456...
   ```

3. **Save the file**

### Step 3: Restart the Development Server

**CRITICAL:** Environment variables only load when the server starts!

```bash
# Stop the current server (press Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 4: Test Authentication

1. **Refresh your browser** (or open http://localhost:5173)
2. **The yellow setup banner should disappear** (if it doesn't, check the console)
3. **Click "Sign Up"** in the navigation
4. **You should see the Clerk modal** with options:
   - Continue with Google
   - Continue with GitHub
   - Continue with email
5. **Try signing up** with any method
6. **After successful sign-up**, you'll be redirected to `/setup`

## ✅ Success Indicators

You'll know it's working when:
- ✅ No yellow "Authentication Setup Required" banner
- ✅ "Sign In" and "Sign Up" buttons work
- ✅ Clerk modal appears when clicking auth buttons
- ✅ You can complete sign-up/sign-in flow
- ✅ Your profile avatar appears in the navigation after login
- ✅ No console errors about Clerk

## 🔧 Troubleshooting

### ❌ "Invalid publishable key" error
- Check you copied the **Publishable Key** (not Secret Key)
- Publishable key should start with `pk_test_` for development
- Ensure there are no extra spaces or quotes in `.env.local`

### ❌ Modal doesn't open when clicking Sign In/Sign Up
- Check browser console (F12) for errors
- Verify `.env.local` is in the project root (not in `/src`)
- Make sure you restarted the dev server after adding the key
- Clear browser cache (Ctrl+Shift+R)

### ❌ Google/GitHub login options not showing
- Go to Clerk Dashboard → User & Authentication → Social Connections
- Toggle Google and GitHub to **ON** (green)
- Click "Save" or "Apply changes"
- Wait 30-60 seconds, then refresh your app

### ❌ Still seeing the yellow setup banner
- Open browser console (F12)
- Look for the Clerk key warning message
- Verify the key in `.env.local` is not `pk_test_placeholder`
- Restart the dev server completely

## 📚 More Help

For detailed setup instructions, see **CLERK_SETUP.md**

For OAuth provider configuration, visit:
- Google OAuth: https://console.cloud.google.com/
- GitHub OAuth: https://github.com/settings/developers
- Clerk Dashboard: https://dashboard.clerk.com/

## 🎯 What Gets Fixed

Once Clerk is configured, these features will work:
- ✅ User sign-up and sign-in
- ✅ OAuth login (Google, GitHub)
- ✅ User profile management
- ✅ Session persistence across page refreshes
- ✅ Automatic data sync across devices
- ✅ Secure user authentication
- ✅ Password reset and account recovery

## 💡 Development vs Production

- **Development** (localhost): Use `pk_test_` keys
- **Production** (deployed): Switch to `pk_live_` keys (get from Clerk Dashboard)

Make sure to update your environment variables in your deployment platform (Vercel, Netlify, etc.) when deploying to production.
