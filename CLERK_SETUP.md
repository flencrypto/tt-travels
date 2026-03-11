# Clerk Authentication Setup

This application uses [Clerk](https://clerk.com/) for user authentication and management.

## 🚀 Quick Start (5 Minutes)

### Step 1: Create a Free Clerk Account

1. Visit [https://clerk.com/](https://clerk.com/) and sign up for a free account
2. Click **"Create Application"** in the Clerk Dashboard
3. Name your application (e.g., "TT Travels")
4. Choose your preferred authentication methods:
   - ✅ **Email** (recommended - always enabled)
   - ✅ **Google** (optional - popular choice)
   - ✅ **GitHub** (optional - great for developers)
   - You can add more later!

### Step 2: Get Your Publishable Key

1. After creating your application, you'll see the **API Keys** page
2. Look for **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Click **Copy** to copy it to your clipboard

> 💡 **Tip**: Keep this page open - you'll need the key in the next step!

### Step 3: Add Your Key to Environment Variables

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

### Step 4: Restart the Development Server

If your dev server is already running, **restart it** for the environment variable to load:

```bash
# Press Ctrl+C to stop the current server, then:
npm run dev
```

### Step 5: Test Authentication ✨

1. Open your app in the browser (usually `http://localhost:5173`)
2. Click **"Sign Up"** or **"Sign In"** in the navigation
3. Complete the authentication flow
4. You should be redirected to the Dashboard!

## ✅ Verification

Your authentication is working correctly if:
- Sign Up/Sign In buttons appear in the navigation for unauthenticated users
- Clicking them opens a beautiful Clerk modal
- After signing in, you see your profile picture/avatar in the navigation
- Clicking your avatar shows account management options
- You can sign out and be redirected to the landing page

## 🎨 What's Already Configured

This app comes with Clerk **fully integrated** out of the box:

✅ **Sign In/Sign Up Buttons** - Modal-based authentication in navigation  
✅ **User Button** - Profile avatar with account management dropdown  
✅ **Sign Out** - Redirects to landing page after logout  
✅ **Auto Redirects** - New users → Setup page, returning users → Dashboard  
✅ **Data Sync** - User data automatically syncs with Clerk metadata  
✅ **Responsive Design** - Works perfectly on desktop and mobile  

## 🎯 Authentication Flow

### For New Users (Sign Up):
1. Click "Sign Up" → Complete Clerk modal → Auto-redirect to `/setup` page → Complete onboarding

### For Returning Users (Sign In):
1. Click "Sign In" → Enter credentials → Auto-redirect to `/dashboard` → Start planning!

### User Profile Management:
- Click your avatar in the navigation
- Access account settings, security, and more
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

## 🐛 Troubleshooting

### ❌ "Missing Clerk Publishable Key" Error
**Solution**: Make sure you've added your key to `.env.local` with the `VITE_` prefix and restarted the dev server.

### ❌ Sign In Modal Not Appearing
**Solution**: Check browser console for errors. Verify your Publishable Key is correct in `.env.local`.

### ❌ Environment Variable Not Loading
**Solution**: 
- Verify the file is named `.env.local` (not `.env`)
- Ensure `VITE_` prefix is present
- Restart the dev server completely (`Ctrl+C` then `npm run dev`)
- Clear browser cache and refresh

### ❌ Wrong Redirect After Sign In
**Solution**: Check the `signInFallbackRedirectUrl` and `signUpFallbackRedirectUrl` props in `src/main.tsx`.

### ❌ Development vs Production Keys
**Development keys** start with `pk_test_`  
**Production keys** start with `pk_live_`

Make sure you're using the correct key for your environment!

## 💡 Need More Help?

- Check [Clerk's Support Center](https://clerk.com/support)
- Visit [Clerk's Discord Community](https://clerk.com/discord)
- Read the [full documentation](https://clerk.com/docs)
