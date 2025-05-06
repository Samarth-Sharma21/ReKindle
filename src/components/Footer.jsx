import { Box, Container, Typography, Link, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const { mode } = useCustomTheme();

  return (
    <Box
      component='footer'
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor:
          mode === 'dark'
            ? '#121212' // Much darker in dark mode
            : theme.palette.primary.main,
        color: 'white',
        alignItems: 'center'
      }}>
      <Container maxWidth='lg'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Typography variant='body2' color='white'>
            © {currentYear} ReKindle. All rights reserved.
          </Typography>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant='body2' color='white'>
            <Link color='inherit' href='#' sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            |
            <Link color='inherit' href='#' sx={{ mx: 1 }}>
              Terms of Service
            </Link>
            |
            <Link color='inherit' href='#' sx={{ mx: 1 }}>
              Contact Us
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
