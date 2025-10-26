# Google Analytics 4 - Quick Start Guide

## ✅ Integration Complete!

Your Google Analytics 4 integration is **fully configured and ready to use**.

## 🎯 What's Tracking Automatically

### All Page Visits

Every page navigation is tracked:

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Register page
- `/interview` - Interview page
- `/history` - History page
- `/pricing` - Pricing page
- `/dashboard` - Dashboard page
- All other pages (privacy, terms, contact, etc.)

### All Button Clicks

Every button click is tracked with:

- Button text or aria-label
- Button ID and class name
- Current page path
- Timestamp

### All Link Clicks

Every link click is tracked with:

- Link text
- Destination URL
- Current page path
- Timestamp

## 📋 Configuration Summary

### Your GA4 Measurement ID

```
G-5NMT889SK2
```

### Environment Variables (Already Set ✅)

Your `.env` file now contains:

```bash
VITE_API_BASE_URL=http://localhost:4000

# Google Analytics 4 Configuration
VITE_GA_MEASUREMENT_ID=G-5NMT889SK2
```

## 🧪 Testing Right Now

Your dev server is running! Open your browser to test:

1. **Open the app:** http://localhost:5173 (or whatever port Vite shows)

2. **Open browser console (F12)** and you should see:

   ```
   Google Analytics initialized
   Automatic click tracking enabled
   Page view tracked: /
   ```

3. **Navigate to different pages** - Watch console for:

   ```
   Page view tracked: /pricing
   Page view tracked: /interview
   ```

4. **Click any button or link** - Watch console for:
   ```
   Event tracked: { category: 'Button', action: 'click', label: '...' }
   Event tracked: { category: 'Link', action: 'click', label: '...' }
   ```

## 📊 View Your Analytics Data

### Real-Time Reports (1-2 minute delay)

1. Go to: https://analytics.google.com
2. Select your PM Interview Practice property
3. Navigate to: **Reports** → **Real-time**
4. You'll see:
   - Active users on your site
   - Page views in real-time
   - All events (button clicks, link clicks)

### Full Reports (24-48 hour delay)

1. Go to: **Reports** → **Engagement** → **Events**
2. You'll see all tracked events:
   - `page_view` - All page navigations
   - `Button` category - All button clicks
   - `Link` category - All link clicks

## 🚀 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

### Option 1: Use Environment Variables in Your Platform

Set this in your hosting platform's environment variables:

```
VITE_GA_MEASUREMENT_ID=G-5NMT889SK2
```

### Option 2: Commit .env to Production Branch (Not Recommended)

If your production deployment doesn't support env vars, you could commit the `.env` file to a production branch only.

### Vercel Deployment

If you're using Vercel, add the environment variable:

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add: `VITE_GA_MEASUREMENT_ID` = `G-5NMT889SK2`
4. Redeploy

## 🔍 What You Can Track

### Current Automatic Tracking

- ✅ All page visits
- ✅ All button clicks
- ✅ All link clicks
- ✅ Anonymous users
- ✅ Authenticated users

### Custom Event Tracking (Optional)

You can also track custom events anywhere in your code:

```javascript
import { trackEvent } from "./services/analytics";

// Track when user starts an interview
trackEvent("Interview", "start", "Product Design Question");

// Track when user completes an interview
trackEvent("Interview", "complete", "Product Design Question", scoreValue);

// Track subscription purchases
trackEvent("Subscription", "purchase", "Pro Plan", 99);

// Track feature usage
trackEvent("Feature", "use", "Voice Input");
```

## 📁 Files Modified

1. ✅ **package.json** - Added `react-ga4` dependency
2. ✅ **index.html** - Added GA4 script tags
3. ✅ **src/App.jsx** - Added tracking initialization
4. ✅ **src/services/analytics.js** - Created analytics service (NEW)
5. ✅ **.env** - Added GA4 Measurement ID
6. ✅ **.env.example** - Updated with GA4 template

## 🎓 Console Logs (Development Mode)

The integration includes helpful console logs to verify tracking:

- `Google Analytics initialized` - GA4 is ready
- `Automatic click tracking enabled` - Click tracking is active
- `Page view tracked: /path` - Page navigation tracked
- `Event tracked: {...}` - Button/link click tracked

**Note:** These logs are visible in development. Consider removing them for production by modifying `src/services/analytics.js` if needed.

## 🔒 Privacy & Compliance

- ✅ **IP Anonymization** - Enabled by default
- ✅ **Environment Variables** - Properly configured
- ⚠️ **Cookie Consent** - Consider adding a consent banner for GDPR
- ⚠️ **Privacy Policy** - Update to mention analytics tracking

## 🛠️ Troubleshooting

### No data in Google Analytics?

1. Check console for "Google Analytics initialized" message
2. Verify Measurement ID in `.env` file
3. Wait 1-2 minutes for real-time reports
4. Disable ad blockers during testing

### Events not tracking?

1. Check browser console for event logs
2. Verify buttons/links are standard HTML elements
3. Check if analytics is initialized (console message)

### Build errors?

1. Ensure `react-ga4` is installed: `npm install`
2. Check imports in `App.jsx` are correct
3. Run `npm run build` to test

## 📚 Full Documentation

For detailed information, see:

- `/PMIP-FE/docs/GOOGLE_ANALYTICS_SETUP.md` - Complete setup guide
- `/GOOGLE_ANALYTICS_INTEGRATION_COMPLETE.md` - Implementation details

## 🎉 You're All Set!

Google Analytics 4 is now tracking every page visit and button click in your application. Open your browser console to see it in action!

**Quick Links:**

- 🔗 Your GA4 Dashboard: https://analytics.google.com
- 🔗 Real-time Reports: https://analytics.google.com/analytics/web/#/realtime
- 📖 GA4 Documentation: https://support.google.com/analytics/answer/9304153
