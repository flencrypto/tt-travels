# ⚡ Quick Commands - Debug Reference

Fast copy-paste commands for common debugging tasks.

## 🔧 Development Server

```bash
# Start dev server
npm run dev

# Force restart (when changes not reflecting)
# Press Ctrl+C, then:
npm run dev

# Start on different port (if 5173 is busy)
npm run dev -- --port 3000

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

## 📦 Package Management

```bash
# Check what's installed
npm list --depth=0

# Check specific package
npm list @clerk/react
npm list @phosphor-icons/react

# Reinstall everything (nuclear option)
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Check for outdated packages
npm outdated
```

## 🔍 Debugging Commands

```bash
# Check environment variables (run in terminal)
echo $VITE_CLERK_PUBLISHABLE_KEY

# Or check in app (add to any component):
```

```typescript
// Check in browser console
console.log('Env Check:', {
  clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  mode: import.meta.env.MODE,
  dev: import.meta.env.DEV
})
```

```bash
# Check Node version
node -v
# Should be v18 or higher

# Check npm version
npm -v

# Check Git status
git status

# View recent changes
git log --oneline -10
```

## 🧹 Clean Up Commands

```bash
# Delete all generated files
rm -rf node_modules
rm -rf dist
rm package-lock.json

# Clear Vite cache
rm -rf node_modules/.vite

# Full clean slate
rm -rf node_modules package-lock.json node_modules/.vite dist
npm install
npm run dev
```

## 🔐 Clerk Debugging

```typescript
// Add to App.tsx or any component for debug info
import { useUser, useAuth } from '@clerk/react'

function DebugClerk() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { sessionId, userId } = useAuth()
  
  console.log('🔐 Clerk Debug:', {
    isLoaded,
    isSignedIn,
    userId: user?.id || userId,
    sessionId,
    email: user?.primaryEmailAddress?.emailAddress,
    metadata: user?.unsafeMetadata
  })
  
  return null
}

// Use in App.tsx:
// <DebugClerk />
```

## 💾 Storage Debugging

```typescript
// Check what's in IndexedDB (browser console)
const keys = await window.spark.kv.keys()
console.log('📦 KV Keys:', keys)

// Check specific value
const value = await window.spark.kv.get('trips')
console.log('📦 Trips:', value)

// Clear specific key
await window.spark.kv.delete('trips')

// Clear everything (careful!)
const allKeys = await window.spark.kv.keys()
for (const key of allKeys) {
  await window.spark.kv.delete(key)
}
```

## 🌐 Browser Console Commands

```javascript
// Check localStorage (shouldn't be used, but just in case)
console.log('Local Storage:', Object.keys(localStorage))

// Check cookies
console.log('Cookies:', document.cookie)

// Check current user
window.Clerk?.user

// Force sign out
window.Clerk?.signOut()

// Check session
window.Clerk?.session

// Reload with cache clear
location.reload(true)
```

## 📊 Network Debugging

```bash
# Check if APIs are accessible (in terminal)

# Test Open-Meteo (weather)
curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m"

# Test Open-Meteo Geocoding
curl "https://geocoding-api.open-meteo.com/v1/search?name=London&count=1"

# Check Clerk status
curl https://status.clerk.com/

# Test internet connection
ping 8.8.8.8
```

## 🎨 Style Debugging

```typescript
// Check if Tailwind is working (add to component)
<div className="bg-red-500 text-white p-4">
  If you see red background, Tailwind is working!
</div>

// Check theme variables (browser console)
const root = document.querySelector(':root')
const styles = getComputedStyle(root)
console.log('Theme Colors:', {
  primary: styles.getPropertyValue('--color-primary'),
  accent: styles.getPropertyValue('--color-accent'),
  background: styles.getPropertyValue('--color-background')
})
```

## 🔄 Git Commands (if needed)

```bash
# Reset to last commit (lose all changes - careful!)
git reset --hard HEAD

# Discard changes to specific file
git checkout -- src/App.tsx

# See what changed
git diff

# Create backup branch
git checkout -b backup-$(date +%Y%m%d)

# Return to main
git checkout main
```

## 🚨 Emergency Fixes

### Total Reset (Keep environment variables)
```bash
# Save your .env.local first!
cp .env.local .env.backup

# Nuclear option - reset everything
rm -rf node_modules package-lock.json node_modules/.vite dist
npm install

# Restore environment
cp .env.backup .env.local

# Start fresh
npm run dev
```

### Browser Reset
```javascript
// In browser console - clears everything
localStorage.clear()
sessionStorage.clear()
indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name))
})
// Then hard refresh: Ctrl+Shift+R
```

### Clerk Account Reset
```bash
# If completely stuck with auth:
# 1. Go to Clerk Dashboard → Users
# 2. Delete all test users
# 3. Clear browser data (above)
# 4. Create new test account
```

## 📝 Useful Snippets

### Check if Component Renders
```typescript
function MyComponent() {
  console.log('✅ MyComponent rendered')
  useEffect(() => {
    console.log('✅ MyComponent mounted')
    return () => console.log('❌ MyComponent unmounted')
  }, [])
  
  return <div>My Component</div>
}
```

### Debug useEffect Dependencies
```typescript
useEffect(() => {
  console.log('Effect triggered:', { dep1, dep2, dep3 })
}, [dep1, dep2, dep3])
```

### Debug API Calls
```typescript
const fetchData = async () => {
  console.log('🌐 API Call Started')
  try {
    const response = await fetch(url)
    console.log('📥 Response:', response.status, response.statusText)
    const data = await response.json()
    console.log('📦 Data:', data)
    return data
  } catch (error) {
    console.error('❌ API Error:', error)
    throw error
  }
}
```

### Debug Spark LLM
```typescript
const testLLM = async () => {
  console.log('🤖 Testing Spark LLM')
  try {
    const prompt = spark.llmPrompt`Say hello!`
    console.log('📝 Prompt:', prompt)
    const result = await spark.llm(prompt)
    console.log('✅ Result:', result)
  } catch (error) {
    console.error('❌ LLM Error:', error)
  }
}
```

## 🎯 Common Error Messages & Fixes

| Error Message | Command to Fix |
|---------------|----------------|
| `Missing Clerk Publishable Key` | Check `.env.local`, restart: `Ctrl+C` → `npm run dev` |
| `Cannot find module` | `npm install` |
| `EADDRINUSE` (port in use) | `npm run dev -- --port 3000` |
| `Failed to fetch` | Check network, APIs might be down |
| `Unexpected token` | Check for syntax errors, restart server |
| `Module not found` | Delete node_modules, reinstall: `rm -rf node_modules && npm install` |

## 💡 Pro Tips

1. **Always check browser console first** - F12 is your best friend
2. **Restart server after .env changes** - Variables only load on start
3. **Hard refresh after Clerk changes** - Ctrl+Shift+R
4. **Test in incognito** - Rules out cache/extension issues
5. **Check Network tab** - See actual API requests/responses

## 📚 Quick Links

- Clerk Dashboard: https://dashboard.clerk.com/
- Clerk Docs: https://clerk.com/docs
- Clerk Status: https://status.clerk.com/
- Open-Meteo: https://open-meteo.com/
- Phosphor Icons: https://phosphoricons.com/

## 🆘 Still Stuck?

Try this sequence:
1. Check browser console (F12)
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R)
4. Clear browser cache
5. Test in incognito
6. Check [QUICK_DEBUG.md](./QUICK_DEBUG.md)
7. Check [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md)
8. Check [CLERK_SETUP.md](./CLERK_SETUP.md)

**Last Resort:**
```bash
# Full reset (saves .env.local)
cp .env.local .env.backup
rm -rf node_modules package-lock.json dist node_modules/.vite
npm cache clean --force
npm install
cp .env.backup .env.local
npm run dev
# Clear browser cache and sign in fresh
```
