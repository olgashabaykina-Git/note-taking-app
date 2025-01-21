// reportWebVitals.js
/**
 * A function for measuring application performance.
 * 
 *
 * @param {Function} onPerfEntry - Callback function for processing metrics..
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamic import of web-vitals library
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        // Calling library methods to measure metrics
        getCLS(onPerfEntry); // Measures Cumulative Layout Shift (CLS)
        getFID(onPerfEntry); // Measures First Input Delay (FID)
        getFCP(onPerfEntry); // Measuresт First Contentful Paint (FCP)
        getLCP(onPerfEntry); // Measures Largest Contentful Paint (LCP)
        getTTFB(onPerfEntry); // Measures Time to First Byte (TTFB)
      })
      .catch((err) => {
        console.error('Error loading web-vitals:', err);
      });
  }
};

// Export the function for use in other modules
export default reportWebVitals;
