import ReactGA from 'react-ga4';

// Initialize Google Analytics
let isInitialized = false;

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('Google Analytics Measurement ID not found');
    return;
  }

  if (isInitialized) {
    return;
  }

  try {
    ReactGA.initialize(measurementId, {
      gaOptions: {
        anonymize_ip: true,
      },
    });
    isInitialized = true;
    console.log('Google Analytics initialized');
  } catch (error) {
    console.error('Error initializing Google Analytics:', error);
  }
};

// Track page views
export const trackPageView = (path, title) => {
  if (!isInitialized) return;

  try {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: title || document.title
    });
    console.log('Page view tracked:', path);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track custom events
export const trackEvent = (category, action, label, value) => {
  if (!isInitialized) return;

  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    console.log('Event tracked:', { category, action, label, value });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Track button clicks
export const trackButtonClick = (buttonText, buttonId, pagePath) => {
  trackEvent('Button', 'click', buttonText, undefined);
};

// Track link clicks
export const trackLinkClick = (linkText, linkHref, pagePath) => {
  trackEvent('Link', 'click', `${linkText} -> ${linkHref}`, undefined);
};

// Setup automatic click tracking
export const setupClickTracking = () => {
  if (!isInitialized) return;

  // Use event delegation for better performance
  document.addEventListener('click', (event) => {
    try {
      const target = event.target.closest('button, a, [role="button"]');
      
      if (!target) return;

      const pagePath = window.location.pathname;
      const tagName = target.tagName.toLowerCase();
      
      if (tagName === 'button' || target.getAttribute('role') === 'button') {
        // Track button clicks
        const buttonText = target.textContent.trim() || 
                          target.getAttribute('aria-label') || 
                          target.getAttribute('title') || 
                          target.getAttribute('id') || 
                          'Unknown Button';
        
        const buttonId = target.getAttribute('id') || target.className || '';
        
        trackButtonClick(buttonText, buttonId, pagePath);
      } else if (tagName === 'a') {
        // Track link clicks
        const linkText = target.textContent.trim() || 
                        target.getAttribute('aria-label') || 
                        'Unknown Link';
        const linkHref = target.getAttribute('href') || '';
        
        trackLinkClick(linkText, linkHref, pagePath);
      }
    } catch (error) {
      console.error('Error in click tracking:', error);
    }
  }, true); // Use capture phase for better reliability

  console.log('Automatic click tracking enabled');
};

// Check if analytics is initialized
export const isAnalyticsInitialized = () => isInitialized;

