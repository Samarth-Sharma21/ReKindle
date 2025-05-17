/**
 * Global Responsive Styles
 *
 * This file contains responsive breakpoints and utility functions
 * to ensure consistent responsive behavior across the entire application.
 * Based on the responsive design patterns from the LandingPage component.
 */

import { useMediaQuery } from '@mui/material';

// Standardized breakpoints matching the landing page
export const breakpoints = {
  xs: 375, // Extra small mobile
  sm: 450, // Mobile
  md: 900, // Tablet
  lg: 1200, // Laptop
  xl: 1600, // Desktop and larger
};

// Media query strings for direct use in styled components
export const mediaQueries = {
  extraSmallMobile: `(max-width: ${breakpoints.xs}px)`,
  mobile: `(max-width: ${breakpoints.sm}px)`,
  tablet: `(min-width: ${breakpoints.sm + 1}px) and (max-width: ${
    breakpoints.md
  }px)`,
  smallTablet: `(min-width: ${breakpoints.sm + 1}px) and (max-width: 650px)`,
  largeTablet: `(min-width: 651px) and (max-width: ${breakpoints.md}px)`,
  laptop: `(min-width: ${breakpoints.md + 1}px) and (max-width: ${
    breakpoints.lg
  }px)`,
  desktop: `(min-width: ${breakpoints.lg + 1}px)`,
  extraLargeDesktop: `(min-width: ${breakpoints.xl}px)`,
};

/**
 * Custom hook that returns boolean values for different screen sizes
 * Usage example:
 * const { isExtraSmallMobile, isMobile, isTablet } = useResponsive();
 */
export const useResponsive = () => {
  const isExtraSmallMobile = useMediaQuery(mediaQueries.extraSmallMobile);
  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isSmallTablet = useMediaQuery(mediaQueries.smallTablet);
  const isLargeTablet = useMediaQuery(mediaQueries.largeTablet);
  const isLaptop = useMediaQuery(mediaQueries.laptop);
  const isDesktop = useMediaQuery(mediaQueries.desktop);
  const isExtraLargeDesktop = useMediaQuery(mediaQueries.extraLargeDesktop);

  return {
    isExtraSmallMobile,
    isMobile,
    isTablet,
    isSmallTablet,
    isLargeTablet,
    isLaptop,
    isDesktop,
    isExtraLargeDesktop,
  };
};

/**
 * Responsive spacing utility that returns different values based on screen size
 * @param {Object} options - Spacing values for different breakpoints
 * @returns {number|string} - The appropriate spacing value
 *
 * Usage example:
 * const padding = responsiveSpacing({ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 });
 */
export const responsiveSpacing = (options) => {
  const { isExtraSmallMobile, isMobile, isTablet, isLaptop, isDesktop } =
    useResponsive();

  if (isExtraSmallMobile && options.xs !== undefined) return options.xs;
  if (isMobile && options.sm !== undefined) return options.sm;
  if (isTablet && options.md !== undefined) return options.md;
  if (isLaptop && options.lg !== undefined) return options.lg;
  if (isDesktop && options.xl !== undefined) return options.xl;

  // Default fallback
  return options.md || 2;
};

/**
 * Responsive font size utility
 * @param {Object} options - Font size values for different breakpoints
 * @returns {string} - The appropriate font size with rem unit
 */
export const responsiveFontSize = (options) => {
  const { isExtraSmallMobile, isMobile, isTablet, isLaptop, isDesktop } =
    useResponsive();

  let fontSize;
  if (isExtraSmallMobile && options.xs !== undefined) fontSize = options.xs;
  else if (isMobile && options.sm !== undefined) fontSize = options.sm;
  else if (isTablet && options.md !== undefined) fontSize = options.md;
  else if (isLaptop && options.lg !== undefined) fontSize = options.lg;
  else if (isDesktop && options.xl !== undefined) fontSize = options.xl;
  else fontSize = options.md || 1; // Default fallback

  return `${fontSize}rem`;
};

/**
 * Common responsive styles that can be reused across components
 */
export const commonResponsiveStyles = {
  container: {
    px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
    py: { xs: 3, sm: 4, md: 5, lg: 6, xl: 8 },
    maxWidth: { xs: '100%', sm: '100%', md: '90%', lg: '85%', xl: '80%' },
  },
  card: {
    p: { xs: 1.5, sm: 2, md: 3 },
    borderRadius: { xs: 1, sm: 1.5, md: 2 },
  },
  button: {
    px: { xs: 1.5, sm: 2, md: 3 },
    py: { xs: 0.75, sm: 1, md: 1.25 },
    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
  },
  heading: {
    fontSize: {
      xs: '1.5rem',
      sm: '1.8rem',
      md: '2.2rem',
      lg: '2.5rem',
      xl: '3rem',
    },
    mb: { xs: 2, sm: 2.5, md: 3, lg: 4 },
  },
  subheading: {
    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem', lg: '1.8rem' },
    mb: { xs: 1.5, sm: 2, md: 2.5 },
  },
  grid: {
    spacing: { xs: 2, sm: 3, md: 4 },
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 1.5, sm: 2, md: 3 },
  },
  flexRow: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 1.5, sm: 2, md: 3 },
  },
};