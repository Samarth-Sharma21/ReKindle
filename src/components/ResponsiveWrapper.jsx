import React from 'react';
import { Box } from '@mui/material';
import {
  useResponsive,
  commonResponsiveStyles,
} from '../styles/responsiveStyles';

/**
 * ResponsiveWrapper - A component that provides consistent responsive behavior
 * across all pages in the application.
 *
 * This component applies the same responsive styles used in the landing page
 * to ensure a consistent user experience throughout the application.
 */
const ResponsiveWrapper = ({ children, sx = {}, ...props }) => {
  const { isMobile, isTablet, isLaptop, isDesktop } = useResponsive();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        margin: '0 auto',
        padding: isMobile ? 1.5 : isTablet ? 2 : isLaptop ? 3 : 4,
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...commonResponsiveStyles.container,
        ...sx,
      }}
      {...props}>
      {children}
    </Box>
  );
};

export default ResponsiveWrapper;