import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa'; // Leaf-like icon

const Logo = ({ size = 'medium', linkTo = '/', withLink = true }) => {
  const theme = useTheme();

  // Size variants - updated to be larger
  const sizes = {
    small: 'h3',
    medium: 'h2',
    large: 'h1',
    extraLarge: {
      fontSize: '10rem',
      lineHeight: 1.1,
    },
  };

  // Icon size variants - increased sizes
  const iconSizes = {
    small: { fontSize: 36 },
    medium: { fontSize: 48 },
    large: { fontSize: 60 },
    extraLarge: { fontSize: 72 },
  };

  // The logo component
  const LogoComponent = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <SpaIcon
        sx={{
          color: theme.palette.primary.main,
          mr: 1.5,
          ...iconSizes[size],
        }}
      />
      <Typography
        variant={size === 'extraLarge' ? undefined : sizes[size]}
        sx={{
          ...(size === 'extraLarge' ? sizes.extraLarge : {}),
          fontFamily: '"Playfair Display", serif',
          fontWeight: 700,
          background: `linear-gradient(90deg, #FF5252 0%, #FF7B50 50%, #FF3D00 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '0.03em',
        }}>
        <span style={{ fontWeight: 800 }}>R</span>e
        <span style={{ fontWeight: 800 }}>K</span>indle
      </Typography>
    </Box>
  );

  // Return with or without link
  if (withLink) {
    return (
      <Box
        component={Link}
        to={linkTo}
        sx={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {LogoComponent}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {LogoComponent}
    </Box>
  );
};

export default Logo;
