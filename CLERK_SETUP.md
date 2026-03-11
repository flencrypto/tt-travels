# Clerk Authentication Setup

This application uses [Clerk](https://clerk.com/) for user authentication and management.

## 🚀 Quick Start (10 Minutes)

### Step 1: Create a Free Clerk Account

1. Visit [https://clerk.com/](https://clerk.com/) and sign up for a free account
2. Click **"Create Application"** in the Clerk Dashboard
3. Name your application (e.g., "TT Travels")
4. Choose your preferred authentication methods during initial setup:
   - ✅ **Email** (recommended - always enabled by default)
   - ✅ **Google OAuth** (optional - popular choice, see Step 1A below)
   - ✅ **GitHub OAuth** (optional - great for developers, see Step 1B below)
   - You can add or modify these later!

### Step 1A: Enable Google OAuth (Highly Recommended)

**Why?** Google OAuth provides a seamless one-click sign-in experience for most users.

1. In your Clerk Dashboard, go to **"User & Authentication"** → **"Social Connections"**
2. Click **"Add connection"** or find **Google** in the list
3. Toggle **Google** to **ON**
4. Choose configuration:
   - **Use Clerk's Development Keys** (Quick Start - perfect for testing)
   - OR **Use Custom Credentials** (Production - requires Google Cloud Console setup)
5. Click **"Save"** or **"Apply"**

**For Custom Google OAuth (Production):**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URIs from Clerk Dashboard
- Copy Client ID and Client Secret to Clerk

### Step 1B: Enable GitHub OAuth (Recommended for Developers)

**Why?** GitHub OAuth is perfect for developer-focused apps and tech-savvy users.

1. In your Clerk Dashboard, go to **"User & Authentication"** → **"Social Connections"**
2. Click **"Add connection"** or find **GitHub** in the list
3. Toggle **GitHub** to **ON**
4. Choose configuration:
   - **Use Clerk's Development Keys** (Quick Start - perfect for testing)
   - OR **Use Custom Credentials** (Production - requires GitHub OAuth App)
5. Click **"Save"** or **"Apply"**

**For Custom GitHub OAuth (Production):**
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Click **"New OAuth App"**
- Fill in application details
- Add callback URL from Clerk Dashboard
- Copy Client ID and Client Secret to Clerk

### Step 2: Configure Additional OAuth Providers (After Initial Setup)

If you didn't enable OAuth providers during initial setup, you can add them anytime:

1. In Clerk Dashboard, navigate to **"Configure"** → **"User & Authentication"** → **"Social Connections"**
2. You'll see a list of available OAuth providers (Google, GitHub, Microsoft, Facebook, Twitter, etc.)
3. Click on any provider to configure:
   - **Google**: Toggle ON → Choose "Use Clerk's development keys" for testing
   - **GitHub**: Toggle ON → Choose "Use Clerk's development keys" for testing
   - **Microsoft**: Toggle ON if targeting enterprise users
   - **Apple**: Toggle ON if targeting iOS users
4. Click **"Save"** or **"Apply changes"**
5. Test the provider by clicking "Test" or trying to sign in

**Important Notes:**
- Clerk provides **development OAuth keys** for quick testing (perfect for development!)
- For production, you'll want to set up **custom OAuth credentials** with your own apps
- You can enable/disable providers at any time without breaking existing users
- Users who signed up with one provider can later link additional accounts

### Step 3: Get Your Publishable Key

1. After creating your application, navigate to **"API Keys"** in the left sidebar
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_` for development)
   - **Secret Key** (starts with `sk_test_` - keep this secure!)
3. Click **Copy** next to the **Publishable Key**

> 💡 **Tip**: Only the Publishable Key is needed for this frontend app!

### Step 4: Add Your Key to Environment Variables

1. Open the `.env.local` file in the project root directory
2. Replace the placeholder with your actual Clerk Publishable Key:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

**⚠️ Important Notes:**
- The `VITE_` prefix is **required** for Vite to expose this variable to the browser
- Do NOT add quotes around the key
- Make sure there are no extra spaces
- This file is already in `.gitignore` - your key won't be committed to git

**Example:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuaW5zcGlyZWQud2Vic2l0ZS00Mi4kJA
```

### Step 5: Restart the Development Server

**CRITICAL:** You MUST restart the dev server for environment variables to load:

```bash
# Press Ctrl+C to stop the current server, then:
npm run dev
```

> ⚠️ **Common Mistake:** Changing `.env.local` while the server is running won't work! Always restart.

### Step 6: Test Authentication ✨

1. Open your app in the browser (usually `http://localhost:5173`)
2. Click **"Sign Up"** or **"Sign In"** in the navigation
3. You should see the Clerk authentication modal with multiple options:
   - **Continue with Google** (if enabled)
   - **Continue with GitHub** (if enabled)
   - **Continue with email** (always available)
4. Try each authentication method:
   - **OAuth (Google/GitHub)**: Click button → redirect to provider → authorize → redirect back to app
   - **Email**: Enter email → verify → create password → complete
5. After successful authentication, you should be redirected to the Dashboard!

## ✅ Verification Checklist

Your authentication is working correctly if:

- ✅ Sign Up/Sign In buttons appear in the navigation for unauthenticated users
- ✅ Clicking them opens a beautiful Clerk modal (not redirecting to a broken page)
- ✅ The modal shows your configured OAuth providers (Google, GitHub, etc.)
- ✅ OAuth buttons work and redirect to the correct provider
- ✅ Email authentication flow works from start to finish
- ✅ After signing in, you see your profile picture/avatar in the navigation
- ✅ Clicking your avatar shows account management options
- ✅ You can sign out and be redirected to the landing page
- ✅ Sign in persists across page refreshes

## 🎨 What's Already Configured

This app comes with Clerk **fully integrated** out of the box:

✅ **Sign In/Sign Up Buttons** - Modal-based authentication in navigation (all pages)
✅ **User Button** - Profile avatar with account management dropdown  
✅ **Sign Out** - Redirects to landing page (`/`) after logout  
✅ **Auto Redirects** - New users → `/setup` page, returning users → `/dashboard`  
✅ **Data Sync** - User data automatically syncs with Clerk metadata via `useClerkSync` hook
✅ **Responsive Design** - Works perfectly on desktop and mobile  
✅ **Theme Integration** - Clerk modals respect your app's color scheme
✅ **Session Persistence** - Stay signed in across browser sessions

## 🎯 Authentication Flow

### For New Users (Sign Up):
1. Click "Sign Up" anywhere on the site
2. Choose authentication method (Google, GitHub, or Email)
3. Complete the provider's flow
4. Auto-redirect to `/setup` page
5. Complete onboarding with your preferences
6. Start using the app!

### For Returning Users (Sign In):
1. Click "Sign In" anywhere on the site
2. Enter credentials or use OAuth
3. Auto-redirect to `/dashboard`
4. Your data is automatically synced from Clerk metadata
5. Start planning!

### User Profile Management:
- Click your avatar in the top-right navigation
- Access account settings, security, and connected accounts
- Add/remove additional authentication methods
- Update profile information
- Manage sessions and devices
- Sign out when finished

## 🔧 Advanced Customization (Optional)

### Match Your Brand Colors

Edit `src/main.tsx` to customize Clerk's appearance:

```typescript
<ClerkProvider 
  publishableKey={publishableKey}
  afterSignOutUrl="/"
  signInFallbackRedirectUrl="/dashboard"
  signUpFallbackRedirectUrl="/setup"
  appearance={{
    variables: {
      colorPrimary: "oklch(0.45 0.15 250)", // Your primary color
      colorBackground: "oklch(0.98 0.01 240)", // Your background
      fontFamily: "'Space Grotesk', sans-serif", // Your heading font
      borderRadius: "0.75rem" // Match your app's radius
    }
  }}
>
```

### Configure Sign-In Methods

In your Clerk Dashboard:
1. Go to **User & Authentication**
2. Navigate to **Email, Phone, Username**
3. Enable/disable authentication strategies
4. Go to **Social Connections** to add OAuth providers

## 📚 Resources

- [Clerk React Quickstart](https://clerk.com/docs/quickstarts/react)
- [Clerk Components Reference](https://clerk.com/docs/components/overview)
- [Clerk React Hooks](https://clerk.com/docs/references/react/overview)
- [Customization Guide](https://clerk.com/docs/customization/overview)

## 🐛 Troubleshooting Common Issues

### ❌ "Missing Clerk Publishable Key" Error
**Symptoms:** White screen with error message, app won't load

**Solutions:**
1. Verify `.env.local` file exists in project root (not in `/src`)
2. Check the key starts with `pk_test_` or `pk_live_`
3. Ensure variable name is exactly `VITE_CLERK_PUBLISHABLE_KEY` (with `VITE_` prefix)
4. No quotes around the key value
5. **Restart dev server** with Ctrl+C then `npm run dev`
6. Clear browser cache and hard refresh (Ctrl+Shift+R)

### ❌ Sign In Modal Not Appearing / Clicking Sign In Does Nothing
**Symptoms:** Buttons don't open modal, or modal flashes and closes

**Solutions:**
1. Check browser console (F12) for errors
2. Verify Publishable Key is correct in Clerk Dashboard → API Keys
3. Make sure you copied the **Publishable Key** (not Secret Key)
4. Check for browser extensions blocking modals/popups
5. Try in incognito mode to rule out extensions
6. Verify Clerk application is not paused/disabled in dashboard

### ❌ OAuth Providers Not Showing (No Google/GitHub buttons)
**Symptoms:** Only see email option, OAuth buttons missing

**Solutions:**
1. Go to Clerk Dashboard → User & Authentication → Social Connections
2. Verify Google/GitHub are toggled **ON** (green)
3. Click "Save" or "Apply changes" after enabling
4. Wait 30-60 seconds for changes to propagate
5. Hard refresh your app (Ctrl+Shift+R)
6. Check "Sign-in Options" settings - ensure providers are enabled for sign-in (not just sign-up)

### ❌ OAuth Login Fails / Redirect Error
**Symptoms:** Click Google/GitHub → redirected but error occurs

**Solutions:**
1. In Clerk Dashboard → Social Connections, verify:
   - Provider is enabled
   - Redirect URLs are configured (Clerk handles this automatically)
2. For custom OAuth credentials:
   - Verify Client ID and Secret are correct
   - Check authorized redirect URIs in Google/GitHub console match Clerk's requirements
3. Clear browser cookies for both your app and the OAuth provider
4. Try different browser or incognito mode

### ❌ "Invalid Redirect URI" from Google/GitHub
**Symptoms:** OAuth provider shows error about redirect URI

**Solutions:**
1. In Clerk Dashboard → Social Connections → [Provider] → View details
2. Copy the exact Redirect URI shown by Clerk
3. Go to your OAuth provider's console:
   - **Google**: Cloud Console → Credentials → OAuth 2.0 Client IDs
   - **GitHub**: Settings → Developer Settings → OAuth Apps
4. Add the Clerk redirect URI to authorized redirects
5. Save changes and wait a few minutes for propagation

### ❌ Environment Variable Not Loading
**Symptoms:** Key is in `.env.local` but still getting "Missing Key" error

**Solutions:**
1. Verify filename is exactly `.env.local` (not `.env` or `.env.development`)
2. File must be in project root (same level as `package.json`)
3. Variable must start with `VITE_` prefix
4. **CRITICAL:** Restart dev server completely:
   ```bash
   # Kill the server (Ctrl+C)
   npm run dev
   ```
5. Check for typos in variable name
6. Ensure no spaces around `=` sign
7. Try logging it: add `console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)` in `main.tsx`

### ❌ User Button Not Showing After Login
**Symptoms:** Logged in but no avatar/profile button appears

**Solutions:**
1. Check browser console for errors
2. Verify `<UserButton />` component is rendered in Navigation.tsx
3. Check if you're wrapped in `<Show when="signed-in">` component
4. Clear browser cache and reload
5. Sign out and sign back in
6. Check Clerk Dashboard → Users to verify user was created

### ❌ Stuck on Loading / Infinite Loading State
**Symptoms:** Authentication seems to work but app stays in loading state

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify redirect URLs in Clerk Dashboard → Paths:
   - Sign-in fallback redirect: `/dashboard`
   - Sign-up fallback redirect: `/setup`
   - After sign-out: `/`
3. Check network tab (F12) for failed API calls
4. Verify `useClerkSync` hook isn't causing infinite loops
5. Check if routes exist in your router configuration

### ❌ Data Not Syncing Between Devices
**Symptoms:** Changes on one device don't appear on another

**Solutions:**
1. Verify user is actually signed in (check UserButton)
2. Check browser console for sync errors from `useClerkSync`
3. Sign out and sign back in to force a sync
4. Check Clerk Dashboard → Users → [Your User] → Metadata tab
5. Verify `unsafeMetadata` is being updated
6. Allow a few seconds for sync to complete after changes

### ❌ Development vs Production Key Issues
**Symptoms:** Works locally but not in production (or vice versa)

**Important:**
- **Development keys** start with `pk_test_` - only work on localhost
- **Production keys** start with `pk_live_` - work on your deployed domain

**Solutions:**
1. In Clerk Dashboard, check which instance you're viewing (Test/Production toggle)
2. For local development: use `pk_test_` key
3. For deployed production: use `pk_live_` key
4. Set correct key in your environment variables for each environment
5. Verify deployment platform (Vercel, Netlify, etc.) has correct production key

### ❌ "Clerk: Unexpected error" Messages
**Symptoms:** Generic error messages in console or UI

**Solutions:**
1. Check Clerk Status page: https://status.clerk.com/
2. Verify your Clerk plan hasn't exceeded limits
3. Check browser console for specific error details
4. Try in incognito mode to rule out cache issues
5. Verify your application isn't paused in Clerk Dashboard
6. Check Clerk Dashboard → Logs for detailed error information

## 🔍 Debugging Tips

### How to Check If Clerk Is Working:
```typescript
// Add to your component temporarily:
import { useUser } from '@clerk/react'

function DebugClerk() {
  const { user, isLoaded, isSignedIn } = useUser()
  
  console.log('Clerk Debug:', {
    isLoaded,
    isSignedIn,
    userId: user?.id,
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  })
  
  return null
}
```

### Check Environment Variables:
```bash
# In your terminal (while dev server is running):
# The key should be visible in your app
```

```typescript
// In main.tsx or any component:
console.log('Clerk Key:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
// Should log: pk_test_... (NOT undefined!)
```

### Verify OAuth Configuration:
1. Go to Clerk Dashboard
2. Navigate to: Configure → User & Authentication → Social Connections
3. Check each provider:
   - Green toggle = enabled ✅
   - Gray toggle = disabled ❌
4. Test directly in Clerk Dashboard using the "Test" button

## 💡 Need More Help?

- Check [Clerk's Support Center](https://clerk.com/support)
- Visit [Clerk's Discord Community](https://clerk.com/discord)
- Read the [full documentation](https://clerk.com/docs)
