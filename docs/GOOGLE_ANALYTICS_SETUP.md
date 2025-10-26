# Google Analytics 4 Integration Guide

## Overview

This application is integrated with Google Analytics 4 (GA4) to track:

- **All page visits** - Automatic tracking when users navigate between pages
- **All button clicks** - Automatic tracking of every button click with context
- **All link clicks** - Automatic tracking of link clicks with destination URLs

## Configuration

### Environment Variables

Create a `.env.local` file in the `PMIP-FE` directory with the following content:

```bash
VITE_GA_MEASUREMENT_ID=G-5NMT889SK2
```

**Note:** The `.env.local` file is git-ignored and should never be committed to version control.

### Current Measurement ID

- **Production Measurement ID:** `G-5NMT889SK2`

## Implementation Details

### 1. Analytics Service (`src/services/analytics.js`)

The analytics service provides:

- `initGA()` - Initializes Google Analytics with the Measurement ID
- `trackPageView(path, title)` - Manually tracks page views
- `trackEvent(category, action, label, value)` - Tracks custom events
- `setupClickTracking()` - Sets up automatic click tracking for all buttons and links

### 2. Automatic Page Tracking

Page views are automatically tracked in `App.jsx`:

- Initial page load is tracked when the app mounts
- Route changes are tracked using React Router's `useLocation` hook
- The `AnalyticsTracker` component handles route change detection

### 3. Automatic Click Tracking

All clicks on buttons and links are automatically tracked:

- **Button clicks** track: button text, ID, class name, and current page path
- **Link clicks** track: link text, destination href, and current page path
- Uses event delegation for optimal performance
- Captures aria-labels and titles when available for better context

### 4. Direct gtag Integration

In addition to react-ga4, we also load the GA4 script directly in `index.html`:

- Provides faster initial tracking
- Enables enhanced measurement features
- IP anonymization is enabled by default

## What Gets Tracked

### Page Views

- **Event Type:** `page_view`
- **Data Captured:**
  - Page path (e.g., `/interview`, `/pricing`)
  - Page title
  - Query parameters

### Button Clicks

- **Event Category:** `Button`
- **Event Action:** `click`
- **Event Label:** Button text or aria-label or ID
- **Additional Context:** Current page path

### Link Clicks

- **Event Category:** `Link`
- **Event Action:** `click`
- **Event Label:** Link text and destination URL
- **Additional Context:** Current page path

## Viewing Analytics Data

### Real-Time Reports

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property (PM Interview Practice)
3. Navigate to **Reports** → **Real-time**
4. You'll see live data for:
   - Users currently on your site
   - Page views
   - Events (button/link clicks)

### Event Reports

1. Go to **Reports** → **Engagement** → **Events**
2. You'll see all tracked events including:
   - `page_view` - Page navigation
   - `Button` category events - All button clicks
   - `Link` category events - All link clicks

## Testing the Integration

### Local Testing

1. Start the development server:

```bash
npm run dev
```

2. Open the browser console and navigate through your app
3. You should see console logs like:
   - `Google Analytics initialized`
   - `Page view tracked: /your-path`
   - `Event tracked: { category: 'Button', action: 'click', ... }`

### Production Testing

1. Deploy your application
2. Visit your site and perform various actions
3. Check Google Analytics Real-time reports within 1-2 minutes

## Privacy Considerations

- **IP Anonymization:** Enabled by default
- **Cookie Consent:** Consider adding a cookie consent banner for GDPR compliance
- **User Identification:** Currently tracking anonymous users; authenticated user IDs can be added later

## Advanced Usage

### Tracking Custom Events

If you need to track specific custom events beyond automatic tracking, use the analytics service:

```javascript
import { trackEvent } from "../services/analytics";

// Track a custom event
trackEvent("Subscription", "upgrade", "Pro Plan", 99);
```

### Conditional Tracking

The analytics service automatically checks for the Measurement ID. If not found, it logs a warning and disables tracking (useful for development).

## Troubleshooting

### Analytics Not Showing Data

1. **Check Measurement ID:** Ensure `VITE_GA_MEASUREMENT_ID` is set correctly in `.env.local`
2. **Check Console:** Look for initialization messages or errors
3. **Ad Blockers:** Disable ad blockers for testing
4. **Wait Time:** Real-time reports may take 1-2 minutes to show data

### Events Not Tracking

1. **Check Console Logs:** Look for event tracking messages
2. **Verify Initialization:** Ensure "Google Analytics initialized" appears in console
3. **Check Element Structure:** Ensure buttons/links are using standard HTML elements

## Future Enhancements

Potential improvements for the analytics setup:

- User identification for authenticated users
- Enhanced e-commerce tracking for subscriptions
- Funnel analysis for interview completion rates
- Custom dimensions for question types and difficulty
- A/B testing integration
- Conversion tracking for key actions
