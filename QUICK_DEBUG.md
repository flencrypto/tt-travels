# 🚀 Quick Debug Guide - Start Here!

Having issues? Follow these steps in order:

## Step 1: Check Your Clerk Configuration (2 minutes)

### A. Verify Your Publishable Key

1. Open `.env.local` in project root
2. Check if it has your Clerk key:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```
3. ✅ Starts with `pk_test_` (development) or `pk_live_` (production)
4. ✅ No quotes around the key
5. ✅ `VITE_` prefix is present

**Don't have a key?** → See `CLERK_SETUP.md` for full setup instructions

### B. Restart Dev Server (REQUIRED!)

```bash
# Press Ctrl+C to stop, then:
npm run dev
```

**Why?** Environment variables only load when server starts.

### C. Check Browser Console

1. Open your app in browser
2. Press F12 to open DevTools
3. Go to Console tab
4. Look for errors (red text)

**Common errors:**
- "Missing Clerk Publishable Key" → Check step 1A above
- "Failed to load" → Check internet connection
- No errors but auth not working → Continue to Step 2

## Step 2: Enable OAuth Providers (3 minutes)

### Add Google OAuth (Recommended)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate: **Configure** → **User & Authentication** → **Social Connections**
4. Find **Google** in the list
5. Toggle it **ON** (should turn green)
6. Choose **"Use Clerk's development keys"** (easiest option)
7. Click **Save** or **Apply changes**
8. Wait 30 seconds for changes to propagate

### Add GitHub OAuth (Recommended for developers)

1. Same steps as Google above
2. Find **GitHub** instead
3. Toggle **ON**
4. Choose **"Use Clerk's development keys"**
5. Click **Save**

### Verify OAuth Enabled

1. Refresh your app (Ctrl+Shift+R for hard refresh)
2. Click "Sign Up" or "Sign In"
3. You should now see:
   - ✅ **Continue with Google** (if enabled)
   - ✅ **Continue with GitHub** (if enabled)  
   - ✅ **Continue with Email** (always available)

**Still not showing?** → Wait another 30 seconds and refresh again

## Step 3: Test Authentication (1 minute)

### Try OAuth Login

1. Click **"Sign Up"** in navigation
2. Click **"Continue with Google"** or **"Continue with GitHub"**
3. Complete authentication with the provider
4. You should be redirected back to the app
5. Check top-right corner - you should see your avatar/profile picture

### Or Try Email Login

1. Click **"Sign Up"**
2. Enter your email
3. Verify email and create password
4. Complete setup
5. Check for avatar in top-right

### Success Indicators ✅

- Avatar/profile picture appears in navigation
- Clicking avatar shows account menu
- Can access all protected pages
- No console errors

## Step 4: Still Having Issues?

### Quick Fixes (Try these in order)

#### Fix 1: Clear Everything
```bash
# In browser:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

# Or use keyboard:
Ctrl+Shift+Delete → Clear cache
```

#### Fix 2: Check Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Users**
3. Check if test users were created
4. If users exist but you can't sign in → Delete test users and try again

#### Fix 3: Verify API Keys Page
1. Clerk Dashboard → **API Keys**
2. Copy the **Publishable Key** again
3. Replace it in `.env.local`
4. Restart dev server: `Ctrl+C` then `npm run dev`

#### Fix 4: Test in Incognito
1. Open incognito/private window
2. Go to your app URL
3. Try signing up again
4. If it works → Clear browser cache in normal window
5. If it doesn't work → Continue to detailed debugging

### Common Issues & Quick Solutions

| Issue | Quick Fix |
|-------|-----------|
| No Sign In button showing | Check Navigation.tsx - verify `<Show when="signed-out">` wraps buttons |
| Modal doesn't open | Check browser console for errors, try incognito mode |
| OAuth buttons missing | Go to Clerk Dashboard → Enable social connections → Wait 60 seconds → Refresh |
| "Invalid key" error | Copy fresh key from Clerk Dashboard → Update `.env.local` → Restart server |
| Avatar not showing after login | Check `<Show when="signed-in">` wraps UserButton → Sign out and back in |
| Data not saving | Using `useKV` hook? → Check functional updates pattern → See DEBUG_CHECKLIST.md |

## Step 5: Detailed Debugging

If quick fixes didn't work, you need detailed troubleshooting:

1. **For Authentication Issues:**
   - Read `CLERK_SETUP.md` - Complete setup guide with step-by-step instructions
   - See troubleshooting section for 15+ common auth problems

2. **For OAuth Configuration:**
   - Read OAuth sections in `CLERK_SETUP.md`
   - Learn about custom OAuth credentials vs Clerk's development keys
   - Configure redirect URIs if using custom credentials

3. **For Other App Issues:**
   - Read `DEBUG_CHECKLIST.md` - Comprehensive debugging guide
   - Covers API integrations, data persistence, routing, styling, and more
   - Organized by issue type with checkboxes

## 🎯 Expected Behavior

When everything is working correctly:

### Landing Page (Not Signed In)
- ✅ Landing page shows at `/` route
- ✅ "Sign In" and "Sign Up" buttons visible in navigation
- ✅ Clicking opens Clerk modal
- ✅ Modal shows email + OAuth options (Google/GitHub if enabled)

### After Sign Up (New User)
- ✅ Complete auth flow
- ✅ Redirect to `/setup` page
- ✅ Avatar appears in navigation
- ✅ Can access all pages

### After Sign In (Returning User)
- ✅ Complete auth flow  
- ✅ Redirect to `/dashboard` page
- ✅ Avatar appears in navigation
- ✅ Data syncs from Clerk metadata automatically
- ✅ Previous trips/favorites/settings restored

### Using the App
- ✅ All navigation links work
- ✅ Can explore destinations, search weather
- ✅ AI features generate itineraries
- ✅ Can save trips and favorites
- ✅ Settings persist
- ✅ Can sign out (redirects to `/`)

## 📚 Additional Resources

- **CLERK_SETUP.md** - Complete Clerk authentication setup guide
- **DEBUG_CHECKLIST.md** - Comprehensive troubleshooting for all features
- **PRD.md** - Full product specifications and feature details
- **README.md** - Project overview and getting started

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Dashboard](https://dashboard.clerk.com/)
- [Clerk Support](https://clerk.com/support)

## 💡 Pro Tips

1. **Always restart dev server** after changing environment variables
2. **Hard refresh** (Ctrl+Shift+R) after Clerk Dashboard changes
3. **Check browser console first** - 90% of issues show up there
4. **Use incognito mode** to rule out cache/extension issues
5. **Verify in Clerk Dashboard** - check Users, API Keys, Social Connections
6. **OAuth takes 30-60 seconds** to propagate after enabling

---

**Remember:** Most auth issues are solved by:
1. Correct Clerk key in `.env.local`
2. Restarting the dev server
3. Enabling OAuth providers in Clerk Dashboard
4. Hard refreshing the browser

If you're still stuck after trying everything above, check the detailed guides or Clerk's support resources.
