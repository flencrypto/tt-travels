# 🔄 Debugging Flowchart

Follow this decision tree to quickly identify and fix issues.

## Start: What's Not Working?

```
┌─────────────────────────────────────────────────┐
│  What issue are you experiencing?              │
└─────────────────────────────────────────────────┘
                      │
      ┌───────────────┼───────────────┬─────────────────┬──────────────┐
      │               │               │                 │              │
      ▼               ▼               ▼                 ▼              ▼
┌──────────┐    ┌──────────┐   ┌──────────┐     ┌──────────┐   ┌──────────┐
│   Auth   │    │   Data   │   │   API    │     │    UI    │   │  Other   │
│  Issues  │    │  Issues  │   │  Issues  │     │  Issues  │   │  Issues  │
└──────────┘    └──────────┘   └──────────┘     └──────────┘   └──────────┘
      │               │               │                 │              │
      ▼               ▼               ▼                 ▼              ▼
  Section A       Section B       Section C        Section D      Section E
```

---

## Section A: Authentication Issues

```
┌────────────────────────────────────────┐
│  Can you see Sign In/Sign Up buttons? │
└────────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
   NO            YES
    │             │
    ▼             ▼
┌────────┐   ┌──────────────────────────┐
│ Fix:   │   │ Do buttons open a modal? │
│ Check  │   └──────────────────────────┘
│ Nav    │              │
│ comp   │       ┌──────┴──────┐
└────────┘       │             │
                NO            YES
                 │             │
                 ▼             ▼
          ┌────────────┐  ┌─────────────────────────┐
          │ Fix:       │  │ Do you see OAuth options│
          │ Check .env │  │ (Google/GitHub)?        │
          │ Restart    │  └─────────────────────────┘
          │ server     │              │
          └────────────┘       ┌──────┴──────┐
                              NO            YES
                               │             │
                               ▼             ▼
                        ┌────────────┐  ┌──────────┐
                        │ Fix:       │  │ Test     │
                        │ Enable in  │  │ OAuth    │
                        │ Clerk      │  │ login    │
                        │ Dashboard  │  └──────────┘
                        └────────────┘       │
                                             ▼
                                    ┌─────────────────┐
                                    │ Does it work?   │
                                    └─────────────────┘
                                          │
                                    ┌─────┴─────┐
                                   YES         NO
                                    │           │
                                    ▼           ▼
                              ┌─────────┐  ┌─────────────┐
                              │ ✅ Done │  │ See         │
                              └─────────┘  │ CLERK_SETUP │
                                           │ Troubleshoot│
                                           └─────────────┘
```

### Authentication Quick Fixes

| Symptom | Solution |
|---------|----------|
| Buttons don't show | Check Navigation.tsx, verify `<Show>` components |
| Modal won't open | Check console, verify Clerk key, try incognito |
| No OAuth buttons | Enable in Clerk Dashboard → Social Connections |
| OAuth redirect fails | Check redirect URIs in provider console |
| Can't stay signed in | Clear cookies, check session settings |

→ **Detailed Guide:** [CLERK_SETUP.md](./CLERK_SETUP.md)

---

## Section B: Data Persistence Issues

```
┌───────────────────────────────────┐
│  Is data saving to storage?      │
└───────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
   NO            YES (but not syncing)
    │             │
    ▼             ▼
┌────────────────────┐   ┌──────────────────────┐
│ Are you using      │   │ Are you signed in?   │
│ useKV hook?        │   └──────────────────────┘
└────────────────────┘              │
    │                        ┌──────┴──────┐
┌───┴────┐                  NO            YES
│        │                   │             │
NO      YES                  ▼             ▼
│        │            ┌────────────┐  ┌──────────────┐
│        │            │ Sign in    │  │ Check Clerk  │
│        │            │ required   │  │ metadata in  │
│        │            │ for sync   │  │ dashboard    │
│        │            └────────────┘  └──────────────┘
│        │
│        ▼
│   ┌─────────────────────────┐
│   │ Using functional        │
│   │ updates?                │
│   │ setValue(cur => ...)    │
│   └─────────────────────────┘
│              │
│       ┌──────┴──────┐
│      NO            YES
│       │             │
│       ▼             ▼
│   ┌────────┐   ┌──────────┐
│   │ FIX IT!│   │ Check    │
│   │ CRITICAL│  │ console  │
│   │ BUG    │   │ for      │
│   └────────┘   │ errors   │
│                └──────────┘
▼
┌────────────┐
│ Use useKV  │
│ not        │
│ localStorage│
└────────────┘
```

### Data Persistence Quick Fixes

| Symptom | Solution |
|---------|----------|
| Data disappears on refresh | Use `useKV` hook, not `useState` |
| Data saving but wrong value | Use functional updates: `setValue(current => newValue)` |
| Not syncing between devices | Sign in, check `useClerkSync`, verify metadata |
| Settings not persisting | Check KV key name, verify save function called |

→ **Critical Pattern:**
```typescript
// ❌ WRONG - will cause data loss
setTodos([...todos, newTodo])

// ✅ CORRECT - always works
setTodos((currentTodos) => [...currentTodos, newTodo])
```

→ **Detailed Guide:** [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md#-data-persistence-issues)

---

## Section C: API Integration Issues

```
┌──────────────────────────┐
│  Which API is failing?   │
└──────────────────────────┘
           │
    ┌──────┼──────┬──────────┐
    │      │      │          │
    ▼      ▼      ▼          ▼
┌────┐ ┌────┐ ┌─────┐  ┌─────┐
│Weather│Flight│ AI  │  │ Maps│
└────┘ └────┘ └─────┘  └─────┘
   │      │      │         │
   ▼      ▼      ▼         ▼

Weather (Open-Meteo):
  → No API key needed
  → Check network tab
  → Verify 3+ char search
  → See console errors

Flights/Hotels (Amadeus):
  → Optional feature
  → Check API keys
  → Verify IATA codes
  → Check date validity

AI Features (Spark LLM):
  → Built-in, no key
  → Check console
  → Verify spark.llm()
  → Try regenerate

Maps (OpenStreetMap):
  → Iframe embed
  → Check network
  → Verify coords
  → Check CSP headers
```

### API Quick Fixes

| API | Common Issue | Solution |
|-----|--------------|----------|
| Weather | No results | Min 3 characters, try "City, Country" format |
| Flights | 401 error | Amadeus keys optional, check Setup page |
| AI | Not generating | Check console, verify `spark.llmPrompt` usage |
| Maps | Not loading | Check network, verify coordinates valid |
| Geo | Permission denied | Use search instead, check HTTPS |

→ **Detailed Guide:** [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md#%EF%B8%8F-api-integration-issues)

---

## Section D: UI/Styling Issues

```
┌──────────────────────────┐
│  What's wrong with UI?   │
└──────────────────────────┘
           │
    ┌──────┼──────┬──────────┬────────┐
    │      │      │          │        │
    ▼      ▼      ▼          ▼        ▼
  Styles Icons Layout   Responsive Other
    │      │      │          │        │
    ▼      ▼      ▼          ▼        ▼

Styles not loading:
  1. Check main.css imported
  2. Verify index.css exists
  3. Check Tailwind directives
  4. Clear cache & refresh

Icons not showing:
  1. Import from @phosphor-icons/react
  2. Check component name capitalized
  3. Verify package installed
  4. Check console for errors

Layout broken:
  1. Check Tailwind classes
  2. Verify responsive utilities
  3. Test in DevTools
  4. Check for typos

Responsive issues:
  1. Check viewport meta tag
  2. Test in mobile view
  3. Verify md:/lg: classes
  4. Check Navigation mobile

Other:
  1. Check browser console
  2. Inspect element styles
  3. Verify fonts loading
  4. Check theme variables
```

### UI Quick Fixes

| Symptom | Solution |
|---------|----------|
| No styles at all | Check imports, restart dev server |
| Colors wrong | Check `index.css` theme variables |
| Icons missing | Verify import and capitalization |
| Mobile broken | Check responsive classes, viewport meta |
| Fonts not loading | Check Google Fonts link in index.html |

→ **Detailed Guide:** [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md#-uistyling-issues)

---

## Section E: Other Issues

```
┌─────────────────────────┐
│  General Issues         │
└─────────────────────────┘
           │
    ┌──────┼──────┬──────────┐
    │      │      │          │
    ▼      ▼      ▼          ▼
  Build  Route  Perf     Dev Env
    │      │      │          │
    ▼      ▼      ▼          ▼

Build/Install:
  → npm install fails
  → Delete node_modules
  → npm cache clean
  → Reinstall

Routing:
  → 404 on refresh
  → Check BrowserRouter
  → Verify route paths
  → Check redirects

Performance:
  → Slow loading
  → Check Network tab
  → Look for loops
  → Check bundle size

Dev Environment:
  → Server won't start
  → Check port 5173
  → Restart server
  → Try different port
```

---

## Universal Debugging Steps

**Always try these first:**

1. **Open Browser Console (F12)**
   - Red errors? Read them carefully
   - Check Network tab for failed requests
   - Look for specific error messages

2. **Restart Dev Server**
   ```bash
   Ctrl+C
   npm run dev
   ```

3. **Hard Refresh Browser**
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

4. **Clear Everything**
   - Browser cache (Ctrl+Shift+Delete)
   - IndexedDB (DevTools → Application)
   - Cookies
   - Try incognito mode

5. **Check Environment**
   ```typescript
   console.log('Debug:', {
     clerkKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
     mode: import.meta.env.MODE
   })
   ```

---

## Quick Reference Matrix

| Symptom | First Check | Second Check | Last Resort |
|---------|-------------|--------------|-------------|
| White screen | Console errors | Environment vars | Restart everything |
| Auth broken | .env.local | Clerk Dashboard | Clear cache + sign out |
| Data not saving | Using useKV? | Functional updates? | Check console |
| API failing | Network tab | API keys | Check status page |
| Styles broken | Imports | Cache | Restart server |
| Can't install | Node version | Clear cache | Delete node_modules |

---

## 📚 Detailed Documentation

- **[QUICK_DEBUG.md](./QUICK_DEBUG.md)** - 5-minute solutions
- **[DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md)** - Complete checklists
- **[CLERK_SETUP.md](./CLERK_SETUP.md)** - Auth setup & troubleshooting
- **[README.md](./README.md)** - Project overview

---

**Remember:** 90% of issues are solved by:
1. Checking browser console
2. Restarting dev server  
3. Hard refreshing browser
4. Verifying environment variables
