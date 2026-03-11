# 🐛 TT Travels - Debug Checklist

Quick reference for troubleshooting common issues in the TT Travels application.

## 🔐 Authentication Issues

### Issue: Can't see Sign In/Sign Up buttons
- [ ] Check Navigation component is rendering
- [ ] Verify `<Show when="signed-out">` wraps auth buttons
- [ ] Inspect browser console for component errors
- [ ] Check if route is correct (should show on all pages)

### Issue: Clerk publishable key error
- [ ] `.env.local` file exists in project root
- [ ] Key starts with `pk_test_` (development) or `pk_live_` (production)
- [ ] Variable named exactly: `VITE_CLERK_PUBLISHABLE_KEY`
- [ ] No quotes around the key value
- [ ] No extra spaces before/after equals sign
- [ ] Dev server was restarted after adding key (Ctrl+C → `npm run dev`)
- [ ] Verify in code: `console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)`

### Issue: OAuth providers not showing (Google/GitHub missing)
- [ ] Go to Clerk Dashboard → User & Authentication → Social Connections
- [ ] Google toggle is ON (green)
- [ ] GitHub toggle is ON (green)
- [ ] Clicked "Save" or "Apply changes"
- [ ] Waited 30-60 seconds for propagation
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Checked "Sign-in options" - providers enabled for both sign-up AND sign-in
- [ ] Using Clerk's development keys (easier) or configured custom OAuth apps

### Issue: OAuth login fails with redirect error
- [ ] Provider is enabled in Clerk Dashboard
- [ ] For custom credentials: Client ID and Secret are correct
- [ ] Redirect URIs match Clerk's requirements exactly
- [ ] Cleared browser cookies for app and OAuth provider
- [ ] Tried incognito mode to rule out cache
- [ ] Checked OAuth provider console for domain restrictions

### Issue: Signed in but UserButton not showing
- [ ] Check Navigation.tsx has `<UserButton />` component
- [ ] Verify wrapped in `<Show when="signed-in">`
- [ ] Browser console shows no errors
- [ ] User exists in Clerk Dashboard → Users
- [ ] Try signing out and back in
- [ ] Clear browser cache completely

### Issue: Authentication persists but data doesn't sync
- [ ] Check `useClerkSync` hook in App.tsx
- [ ] Browser console shows no sync errors
- [ ] Clerk Dashboard → Users → [User] → Metadata shows data
- [ ] `unsafeMetadata` field is populated
- [ ] Sign out and sign back in to force sync
- [ ] Check if `useKV` hooks are working properly

## 🗺️ API Integration Issues

### Issue: Weather search not working
- [ ] Open-Meteo API doesn't require key (should just work)
- [ ] Check browser network tab for failed requests
- [ ] Verify search input has minimum 3 characters
- [ ] Check if geocoding returned results
- [ ] Browser console shows specific error message
- [ ] Try different location name (use city + country)

### Issue: Flight/Hotel search fails
- [ ] Amadeus API keys configured in environment (not required but affects features)
- [ ] Check Network tab for 401/403 errors (auth issue)
- [ ] Verify dates are in future
- [ ] IATA codes are valid (3-letter airport codes)
- [ ] Check Setup page for integration status
- [ ] Review CLERK_SETUP.md for optional API setup

### Issue: AI features not generating
- [ ] Spark LLM is built-in (no API key needed)
- [ ] Check browser console for errors
- [ ] Verify `spark.llm()` function is available
- [ ] Check network tab for API failures
- [ ] Try regenerating with different inputs
- [ ] Ensure prompts are created with `spark.llmPrompt` template literal

### Issue: Geolocation not working
- [ ] Browser prompted for location permission
- [ ] Permission was granted (check browser address bar)
- [ ] Not using HTTPS (geolocation requires secure context locally: localhost is ok)
- [ ] Check browser console for permission errors
- [ ] Try "Use My Location" button explicitly
- [ ] Fall back to manual search if permission denied

## 💾 Data Persistence Issues

### Issue: Data not persisting (trips, favorites, settings)
- [ ] Using `useKV` hook from `@github/spark/hooks`
- [ ] Functional updates: `setValue((current) => newValue)` not `setValue(stateVar)`
- [ ] Check browser console for KV errors
- [ ] Verify KV keys are unique strings
- [ ] Data shows in browser DevTools → Application → IndexedDB
- [ ] Not using localStorage (should use useKV instead)

### Issue: Settings not saving
- [ ] Settings page saves to `tt-travels-settings` key
- [ ] Toast confirmation appears after save
- [ ] Check browser console for errors
- [ ] Verify form validation passes
- [ ] Data persists in IndexedDB
- [ ] Try signing out and back in

### Issue: Trips/Favorites not syncing between devices
- [ ] User is signed in (required for Clerk sync)
- [ ] `useClerkSync` hook is active in App.tsx
- [ ] Check Clerk Dashboard → Users → Metadata
- [ ] Local KV and Clerk metadata both updated
- [ ] Wait a few seconds for debounced sync (1000ms delay)
- [ ] Try manual refresh or sign out/in

## 🎨 UI/Styling Issues

### Issue: Styles not loading / broken layout
- [ ] `main.css` imported in main.tsx
- [ ] `index.css` exists and has Tailwind directives
- [ ] Tailwind classes rendering correctly (check Elements tab)
- [ ] No CSS errors in console
- [ ] Vite dev server running without errors
- [ ] Clear browser cache and hard refresh

### Issue: Theme/colors look wrong
- [ ] Check `index.css` for CSS custom properties in `:root`
- [ ] Verify `@theme` block maps variables correctly
- [ ] Inspect element to see computed color values
- [ ] Check if dark mode is accidentally active
- [ ] Google Fonts loading (check Network tab)
- [ ] Space Grotesk and Inter fonts specified in index.html

### Issue: Icons not showing
- [ ] `@phosphor-icons/react` imported correctly
- [ ] Icon component capitalized: `<Icon />` not `<icon />`
- [ ] Check for typos in icon names
- [ ] Verify package is installed: `npm list @phosphor-icons/react`
- [ ] Browser console shows no import errors

### Issue: Responsive design broken on mobile
- [ ] Test in browser DevTools responsive mode
- [ ] Check viewport meta tag in index.html
- [ ] Verify Tailwind responsive classes (md:, lg:, etc.)
- [ ] Check Navigation mobile layout (hamburger menu)
- [ ] Glass effects reduced on mobile (lower blur for performance)

## 🔀 Routing Issues

### Issue: 404 on page refresh / routes not working
- [ ] Using `BrowserRouter` (not HashRouter)
- [ ] All routes defined in App.tsx `<Routes>` component
- [ ] Route paths start with `/`
- [ ] Vite dev server handling history API correctly
- [ ] Check for typos in route paths
- [ ] Verify Link components use `to` prop

### Issue: Redirects not working after auth
- [ ] Check `signInFallbackRedirectUrl="/dashboard"` in main.tsx
- [ ] Check `signUpFallbackRedirectUrl="/setup"` in main.tsx
- [ ] Check `afterSignOutUrl="/"` in main.tsx
- [ ] Routes exist in router configuration
- [ ] No console errors during redirect
- [ ] Try manually navigating to route

### Issue: Navigation highlights wrong route
- [ ] `useLocation()` hook working correctly
- [ ] Route paths match exactly (case-sensitive)
- [ ] Check `isActive` logic in Navigation.tsx
- [ ] Inspect className to see if active styles applied

## 🛠️ Development Environment Issues

### Issue: npm install fails
- [ ] Node version is compatible (v18 or higher recommended)
- [ ] Delete `node_modules` and `package-lock.json`
- [ ] Run `npm cache clean --force`
- [ ] Run `npm install` again
- [ ] Check for disk space
- [ ] Check npm registry connectivity

### Issue: Dev server won't start
- [ ] Port 5173 is available (not used by another process)
- [ ] Check terminal for specific error messages
- [ ] Delete `node_modules` and reinstall
- [ ] Check `vite.config.ts` for syntax errors
- [ ] Try `npm run dev -- --port 3000` for different port

### Issue: Hot reload not working
- [ ] File is saved (check for save indicator)
- [ ] File is inside `src/` directory
- [ ] No syntax errors in file
- [ ] Vite dev server still running in terminal
- [ ] Try manual refresh (F5)
- [ ] Restart dev server

### Issue: TypeScript errors
- [ ] Run `npx tsc --noEmit` to check all files
- [ ] Check for missing imports
- [ ] Verify type definitions installed
- [ ] Check `tsconfig.json` configuration
- [ ] Restart VS Code TypeScript server

## 📊 Performance Issues

### Issue: App loading slowly
- [ ] Check Network tab for slow requests
- [ ] Verify images/assets are optimized
- [ ] Check for large bundle size
- [ ] Look for unnecessary re-renders in React DevTools
- [ ] Verify API calls aren't in infinite loops
- [ ] Check if too many useEffect dependencies

### Issue: Maps/iframes slow to load
- [ ] OpenStreetMap iframe loading correctly
- [ ] Check network speed/connectivity
- [ ] Reduce map zoom level if possible
- [ ] Consider lazy loading maps on demand

## 🔍 General Debugging Steps

1. **Check Browser Console (F12)**
   - Look for red errors
   - Check warnings
   - Review network tab for failed requests

2. **Check Terminal**
   - Vite dev server running?
   - Any build errors?
   - Hot reload working?

3. **Clear Everything**
   - Browser cache (Ctrl+Shift+Delete)
   - IndexedDB (DevTools → Application → Storage)
   - Cookies for your domain
   - Restart dev server
   - Hard refresh (Ctrl+Shift+R)

4. **Test in Incognito**
   - Rules out extensions
   - Rules out cache issues
   - Fresh environment

5. **Check Package Versions**
   ```bash
   npm list --depth=0
   ```
   - Verify critical packages installed
   - Check for peer dependency warnings

6. **Environment Variables**
   ```typescript
   console.log('Environment Check:', {
     clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
     nodeEnv: import.meta.env.MODE
   })
   ```

## 🆘 Still Stuck?

If you've tried everything:

1. Check the detailed guides:
   - `CLERK_SETUP.md` - Complete authentication setup
   - `README.md` - General project overview
   - `PRD.md` - Feature specifications

2. Review the code:
   - `src/main.tsx` - App initialization and Clerk setup
   - `src/App.tsx` - Routing and main app structure
   - `src/hooks/use-clerk-sync.ts` - Authentication sync logic
   - `src/components/Navigation.tsx` - Auth UI components

3. Common quick fixes:
   ```bash
   # Nuclear option - reset everything
   rm -rf node_modules package-lock.json
   npm install
   rm .env.local
   # Re-add your Clerk key to .env.local
   npm run dev
   ```

4. Check external services:
   - [Clerk Status](https://status.clerk.com/)
   - [Clerk Dashboard](https://dashboard.clerk.com/)
   - [Open-Meteo Status](https://open-meteo.com/)

Remember: 90% of issues are resolved by:
- Restarting the dev server
- Clearing browser cache
- Checking environment variables
- Verifying API keys in Clerk Dashboard
