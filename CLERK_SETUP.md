# Clerk Authentication Setup

This application uses [Clerk](https://clerk.com/) for user authentication and management.

## Quick Start

### 1. Create a Clerk Account

1. Go to [https://clerk.com/](https://clerk.com/) and sign up for a free account
2. Create a new application in the Clerk Dashboard
3. Choose your preferred authentication methods (Email, Google, GitHub, etc.)

### 2. Get Your Publishable Key

1. In the Clerk Dashboard, navigate to **API Keys**
2. Select **React** as your framework
3. Copy your **Publishable Key**

### 3. Configure Environment Variables

1. Open the `.env.local` file in the project root
2. Replace `your_clerk_publishable_key_here` with your actual Clerk Publishable Key:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
```

**Important:** The `VITE_` prefix is required for Vite to expose this variable to the client-side code.

### 4. Start the Application

```bash
npm run dev
```

The app will now have full authentication functionality with Sign In, Sign Up, and User Management features!

## Features Included

- **Sign In/Sign Up Buttons**: Modal-based authentication flow
- **User Button**: Displays user profile with account management options
- **Sign Out**: Redirects to home page after sign out
- **Protected Routes**: Can be easily added using Clerk's routing utilities

## Customizing Clerk

### Appearance

You can customize Clerk's UI to match your app's theme by adding appearance configuration to `ClerkProvider` in `src/main.tsx`:

```typescript
<ClerkProvider 
  publishableKey={publishableKey} 
  afterSignOutUrl="/"
  appearance={{
    variables: {
      colorPrimary: "#your-primary-color"
    }
  }}
>
```

### Authentication Methods

Configure which sign-in methods are available in your Clerk Dashboard under:
**User & Authentication** → **Email, Phone, Username** → **Social Connections**

## Documentation

- Clerk React Quickstart: https://clerk.com/docs/react/getting-started/quickstart
- Clerk Components: https://clerk.com/docs/components/overview
- Clerk Hooks: https://clerk.com/docs/references/react/overview

## Troubleshooting

### Environment Variable Not Loading

- Make sure the variable name starts with `VITE_`
- Restart the development server after changing `.env.local`
- Verify the file is named `.env.local` exactly (not `.env` or `.env.development`)

### Sign In Not Working

- Check that your Clerk application is in the correct mode (Development vs Production)
- Verify your Publishable Key is correct
- Check browser console for error messages
