// Mobile fix - Ensures proper mobile rendering

export const initMobileFix = () => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Prevent horizontal scroll
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    // Set max width
    document.documentElement.style.maxWidth = '100vw';
    document.body.style.maxWidth = '100vw';
    
    // Add mobile class to body
    document.body.classList.add('mobile-view');
    
    console.log('📱 Mobile view activated');
  }
};

// Run on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initMobileFix);
  window.addEventListener('resize', initMobileFix);
}
