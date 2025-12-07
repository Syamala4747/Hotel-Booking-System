import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// Responsive style helper
export const responsive = (desktop: any, mobile: any, tablet?: any) => {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) return mobile;
  if (isTablet && tablet) return tablet;
  return desktop;
};
