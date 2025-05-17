import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  useTheme,
  AppBar,
  Toolbar,
  Stack,
  Slide,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CelebrationIcon from '@mui/icons-material/Celebration';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import Logo from '../components/Logo';
import { Footer } from '../components';
import Chatbot from '../components/Chatbot';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import patientImage1 from '../assets/patient side.jpg';
import patientImage2 from '../assets/Patient side 2.jpg';
import patientImage3 from '../assets/patient side 3.jpg';
import familyImage1 from '../assets/family side.jpg';
import familyImage2 from '../assets/family side 2.jpg';
import familyImage3 from '../assets/familyillustration.jpg';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode, toggleTheme } = useCustomTheme();
  const [scrollDir, setScrollDir] = useState('up');
  const [prevScrollY, setPrevScrollY] = useState(0);

  // Improved responsive breakpoints
  const isExtraSmallMobile = useMediaQuery('(max-width:375px)');
  const isMobile = useMediaQuery('(max-width:450px)');
  const isTablet = useMediaQuery('(min-width:451px) and (max-width:900px)');
  const isSmallTablet = useMediaQuery(
    '(min-width:451px) and (max-width:650px)'
  );
  const isLargeTablet = useMediaQuery(
    '(min-width:651px) and (max-width:900px)'
  );
  const isLaptop = useMediaQuery('(min-width:901px) and (max-width:1200px)');
  const isDesktop = useMediaQuery('(min-width:1201px)');
  const isExtraLargeDesktop = useMediaQuery('(min-width:1600px)');

  // State for hover effects
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  // State for image cycling
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);

  // Arrays of images for cycling
  const patientImages = [patientImage1, patientImage2, patientImage3];
  const familyImages = [familyImage1, familyImage2, familyImage3];

  // Functions to cycle images on hover
  const cycleLeftImage = () => {
    setLeftHovered(true);
    setLeftImageIndex((prevIndex) => (prevIndex + 1) % patientImages.length);
  };

  const cycleRightImage = () => {
    setRightHovered(true);
    setRightImageIndex((prevIndex) => (prevIndex + 1) % familyImages.length);
  };

  // Refs for split panels
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  // Text animation state
  const [loopTextIndex, setLoopTextIndex] = useState(0);
  const loopTexts = [
    'Preserve your precious memories',
    'Cherish moments that matter',
    'Build your digital legacy',
    'Connect across generations',
    'Remember the beautiful journey',
  ];

  // Loop text animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLoopTextIndex((prevIndex) => (prevIndex + 1) % loopTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setScrollDir('down');
      } else {
        setScrollDir('up');
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  const handlePatientLogin = () => {
    navigate('/patient/login');
  };

  const handleFamilyLogin = () => {
    navigate('/family/login');
  };

  const handlePatientRegister = () => {
    navigate('/patient/register');
  };

  const handleFamilyRegister = () => {
    navigate('/family/register');
  };

  const handlePricingNavigate = () => {
    navigate('/pricing');
  };

  const features = [
    {
      title: 'Memory Recording',
      description:
        'Easily record memories through photos, voice recordings, or text entries.',
      icon: <MemoryIcon fontSize='large' />,
    },
    {
      title: 'Family Connection',
      description:
        'Share memories with family members and caregivers through secure access codes.',
      icon: <PeopleIcon fontSize='large' />,
    },
    {
      title: 'Calming Exercises',
      description:
        'Access breathing exercises and relaxation techniques to reduce anxiety.',
      icon: <SpaIcon fontSize='large' />,
    },
  ];

  const statistics = [
    { value: 'Our Goal', label: '100% user satisfaction' },
    { value: 'Our Mission', label: 'Improve family communication' },
    { value: 'Our Vision', label: 'Enhance memory recall for all' },
  ];

  // Mouse position animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position to percentage
  const mouseXPercent = useTransform(
    mouseX,
    [0, window.innerWidth],
    ['0%', '100%']
  );
  const mouseYPercent = useTransform(
    mouseY,
    [0, window.innerHeight],
    ['0%', '100%']
  );

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}>
      {/* Chatbot */}
      {/* <Chatbot /> */}

      {/* Header Section */}
      <Slide appear={false} direction='down' in={scrollDir === 'up'}>
        <AppBar
          position='fixed'
          color='transparent'
          elevation={0}
          sx={{
            backdropFilter: 'blur(10px)',
            background:
              mode === 'dark'
                ? 'rgba(18, 18, 18, 0.85)'
                : 'rgba(255, 255, 255, 0.9)',
            borderBottom: `1px solid ${
              mode === 'dark'
                ? 'rgba(255, 138, 0, 0.2)'
                : 'rgba(255, 138, 0, 0.12)'
            }`,
            width: '100%',
            maxWidth: '100%',
            left: 0,
            right: 0,
            margin: 0,
            boxSizing: 'border-box',
            zIndex: 1100,
          }}>
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              px: {
                xs: 2,
                sm: isSmallTablet ? 2 : 3,
                md: 4,
                lg: isDesktop ? 6 : 5,
              },
              width: '100%',
              margin: 0,
              boxSizing: 'border-box',
              maxWidth: {
                lg: '1400px',
                xl: isExtraLargeDesktop ? '1800px' : '1600px',
              },
              mx: {
                lg: 'auto',
              },
            }}>
            <Toolbar
              disableGutters
              sx={{
                justifyContent: 'space-between',
                py: { xs: 0.5, sm: 0.8, md: 1 },
                height: { xs: 60, sm: 70, md: 80 },
              }}>
              {/* Brand Logo/Name */}
              <Box
                component={Link}
                to='/'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  transform: {
                    xs: 'scale(0.8)',
                    sm: 'scale(0.9)',
                    md: 'scale(1.1)',
                    lg: 'scale(1.2)',
                  },
                  transformOrigin: 'left center',
                  ml: { xs: 0, sm: 0 },
                  textDecoration: 'none',
                  position: 'relative',
                }}>
                <Logo
                  size={
                    isExtraSmallMobile
                      ? 'small'
                      : isMobile
                      ? 'medium'
                      : isTablet
                      ? 'medium'
                      : 'medium'
                  }
                />
              </Box>

              {/* Navigation */}
              <Stack
                direction='row'
                spacing={1}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                }}>
                <Button
                  variant='text'
                  color='inherit'
                  onClick={() =>
                    document
                      .getElementById('ourApproach')
                      .scrollIntoView({ behavior: 'smooth' })
                  }
                  sx={{
                    fontWeight: 500,
                    color:
                      mode === 'dark' ? 'rgba(255,255,255,0.85)' : 'inherit',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                    textTransform: 'none',
                    fontSize: { md: '0.9rem', lg: '1rem' },
                    position: 'relative',
                  }}>
                  Our Approach
                </Button>
                <Button
                  variant='text'
                  color='inherit'
                  onClick={() =>
                    document
                      .getElementById('features')
                      .scrollIntoView({ behavior: 'smooth' })
                  }
                  sx={{
                    fontWeight: 500,
                    color:
                      mode === 'dark' ? 'rgba(255,255,255,0.85)' : 'inherit',
                    '&:hover': { color: theme.palette.primary.main },
                    textTransform: 'none',
                    fontSize: isLaptop ? '0.9rem' : '1rem',
                  }}>
                  Features
                </Button>
                <Button
                  variant='text'
                  color='inherit'
                  onClick={handlePricingNavigate}
                  endIcon={<CelebrationIcon />}
                  sx={{
                    fontWeight: 500,
                    color:
                      mode === 'dark' ? 'rgba(255,255,255,0.85)' : 'inherit',
                    '&:hover': { color: theme.palette.primary.main },
                    textTransform: 'none',
                    fontSize: isLaptop ? '0.9rem' : '1rem',
                  }}>
                  Pricing
                </Button>
              </Stack>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 1, sm: 2 },
                  alignItems: 'center',
                }}>
                {/* Theme Toggle */}
                <Tooltip
                  title={`Switch to ${
                    mode === 'light' ? 'Dark' : 'Light'
                  } Mode`}>
                  <IconButton
                    onClick={toggleTheme}
                    color='inherit'
                    sx={{
                      color:
                        mode === 'dark' ? 'primary.main' : 'text.secondary',
                    }}>
                    {mode === 'dark' ? (
                      <LightModeOutlinedIcon />
                    ) : (
                      <DarkModeOutlinedIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={() =>
                    document
                      .getElementById('howWeWork')
                      .scrollIntoView({ behavior: 'smooth' })
                  }
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    display: { xs: 'none', sm: 'flex' },
                    fontSize: { sm: '0.8rem', md: '0.9rem' },
                    px: { sm: 1.5, md: 2 },
                    py: { sm: 0.5, md: 0.8 },
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(255, 138, 0, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}>
                  How it Works
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handlePatientRegister}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: {
                      xs: '0.75rem',
                      sm: isSmallTablet ? '0.77rem' : '0.8rem',
                      md: '0.9rem',
                    },
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: 0.5, sm: 0.8, md: 1 },
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(255, 138, 0, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}>
                  Join Now
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>

      {/* New Split Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            mode === 'dark'
              ? 'radial-gradient(circle at 50% 50%, rgba(255, 138, 0, 0.06) 0%, transparent 60%)'
              : 'radial-gradient(circle at 50% 50%, rgba(255, 138, 0, 0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Mouse position gradient effect */}
      <Box
        component={motion.div}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6,
        }}
        style={{
          background:
            mode === 'dark'
              ? `radial-gradient(circle at ${mouseXPercent} ${mouseYPercent}, rgba(255, 138, 0, 0.08) 0%, transparent 50%)`
              : `radial-gradient(circle at ${mouseXPercent} ${mouseYPercent}, rgba(255, 138, 0, 0.05) 0%, transparent 50%)`,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          marginTop: {
            xs: 10,
            sm: 11.5,
            md: 12,
            lg: 12,
          },
          height: {
            xs: 'auto',
            sm: '65vh',
            md: '80vh',
            lg: '90vh',
          },
          maxHeight: {
            xs: '100%',
            sm: 650,
            md: 800,
            lg: 900,
            xl: 1000,
          },
          minHeight: {
            xs: isExtraSmallMobile ? 220 : 'unset',
            sm: 450,
            md: 550,
            lg: 650,
          },
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          width: '100%',
          maxWidth: '100%',
          zIndex: 1,
        }}>
        {/* Left Half - Individual */}
        <Box
          ref={leftPanelRef}
          component={motion.div}
          initial={{ x: isMobile || isTablet ? 0 : -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          onMouseEnter={cycleLeftImage}
          onMouseLeave={() => setLeftHovered(false)}
          onClick={handlePatientLogin}
          sx={{
            flex: rightHovered ? 0.5 : leftHovered ? 1.4 : 1,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: {
              xs: 5,
              sm: 4,
              md: 3,
              lg: 0,
            },
            px: {
              xs: 2,
              sm: 2,
              md: 3,
              lg: 4,
            },
            bgcolor: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
            transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'pointer',
            height: {
              xs: isExtraSmallMobile ? '35vh' : '38vh',
              sm: isSmallTablet ? '40vh' : '42vh',
              md: '100%',
            },
            minHeight: {
              xs: isExtraSmallMobile ? 200 : 220,
              sm: isSmallTablet ? 250 : 300,
              md: 450,
              lg: 550,
            },
            transform: leftHovered
              ? {
                  xs: 'none',
                  sm: isSmallTablet ? 'scale(1.01)' : 'scale(1.015)',
                  md: 'scale(1.02)',
                }
              : 'none',
            zIndex: leftHovered ? 10 : 1,
            boxShadow: leftHovered
              ? mode === 'dark'
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(0, 0, 0, 0.1)'
              : 'none',
            borderTop:
              leftHovered && (isMobile || isTablet)
                ? mode === 'dark'
                  ? '2px solid rgba(255, 138, 0, 0.3)'
                  : '2px solid rgba(255, 138, 0, 0.2)'
                : 'none',
            borderRight:
              leftHovered && !isMobile && !isTablet
                ? mode === 'dark'
                  ? '1px solid rgba(255, 138, 0, 0.2)'
                  : '1px solid rgba(255, 138, 0, 0.1)'
                : 'none',
          }}>
          {/* Background Image (cycles on hover) */}
          <Box
            component={motion.div}
            animate={{
              opacity: leftHovered ? 0.3 : 0,
              scale: leftHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.7 }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${patientImages[leftImageIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1,
              filter: leftHovered ? 'blur(0px)' : 'blur(2px)',
            }}
          />

          {/* Content */}
          <Box
            component={motion.div}
            animate={{
              y: leftHovered ? -15 : 0,
              scale: leftHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            sx={{
              position: 'relative',
              zIndex: 10,
              p: { xs: 1.5, sm: 2, md: 3 },
              maxWidth: { xs: '100%', sm: 350, md: leftHovered ? 500 : 450 },
              width: '100%',
              textAlign: 'center',
            }}>
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}>
              <PersonIcon
                sx={{
                  fontSize: { xs: 60, sm: 70, md: 90 },
                  color: theme.palette.primary.main,
                  mb: { xs: 1, sm: 2 },
                }}
              />
            </motion.div>

            <Typography
              variant='h2'
              sx={{
                fontSize: {
                  xs: isExtraSmallMobile ? '1.1rem' : '1.3rem',
                  sm: isSmallTablet ? '1.4rem' : '1.6rem',
                  md: '2rem',
                  lg: '2.5rem',
                  xl: '3rem',
                },
                fontWeight: 700,
                mb: { xs: 1, sm: 1.5 },
                color: mode === 'dark' ? 'white' : 'text.primary',
                fontFamily: '"Playfair Display", serif',
              }}>
              Individual
            </Typography>

            {/* Animated Text Loop for Individual */}
            <Box
              sx={{
                height: {
                  xs: isExtraSmallMobile ? 40 : 45,
                  sm: isSmallTablet ? 45 : 55,
                  md: 60,
                },
                overflow: 'hidden',
                position: 'relative',
                mb: { xs: 1.5, sm: 2 },
              }}>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={loopTextIndex}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5 }}>
                  <Typography
                    variant='body1'
                    sx={{
                      textAlign: 'center',
                      color:
                        mode === 'dark'
                          ? 'rgba(255,255,255,0.8)'
                          : 'text.secondary',
                      maxWidth: '90%',
                      mx: 'auto',
                      fontSize: {
                        xs: isExtraSmallMobile ? '0.7rem' : '0.8rem',
                        sm: isSmallTablet ? '0.8rem' : '0.9rem',
                        md: '1rem',
                      },
                    }}>
                    {loopTexts[loopTextIndex]}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'column', md: 'row' }}
              spacing={{ xs: 1, sm: 1.5 }}
              justifyContent='center'
              sx={{
                mt: {
                  xs: isExtraSmallMobile ? 1 : 1.5,
                  sm: isSmallTablet ? 1.5 : 2,
                },
                px: isTablet ? 1 : 0,
                position: 'relative',
                zIndex: 2,
              }}>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                variant='contained'
                color='primary'
                size={isMobile ? 'medium' : 'large'}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePatientLogin();
                }}
                sx={{
                  borderRadius: 2,
                  py: { xs: isExtraSmallMobile ? 0.8 : 1, sm: 1.5 },
                  px: { xs: isExtraSmallMobile ? 1.5 : 2, sm: 3 },
                  fontWeight: 600,
                  textTransform: 'none',
                  width: { xs: '100%', md: 'auto' },
                  fontSize: {
                    xs: isExtraSmallMobile ? '0.8rem' : '0.85rem',
                    sm: '0.9rem',
                    md: '1rem',
                  },
                  boxShadow:
                    mode === 'dark'
                      ? '0 4px 15px rgba(255, 138, 0, 0.2)'
                      : '0 4px 15px rgba(255, 138, 0, 0.1)',
                  '&:hover': {
                    boxShadow:
                      mode === 'dark'
                        ? '0 8px 25px rgba(255, 138, 0, 0.3)'
                        : '0 8px 25px rgba(255, 138, 0, 0.2)',
                  },
                }}>
                Sign In
              </Button>

              <Button
                component={motion.button}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                variant='outlined'
                color='primary'
                size={isMobile ? 'medium' : 'large'}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePatientRegister();
                }}
                sx={{
                  borderRadius: 2,
                  py: { xs: isExtraSmallMobile ? 0.8 : 1, sm: 1.5 },
                  px: { xs: isExtraSmallMobile ? 1.5 : 2, sm: 3 },
                  fontWeight: 600,
                  textTransform: 'none',
                  width: { xs: '100%', md: 'auto' },
                  fontSize: {
                    xs: isExtraSmallMobile ? '0.8rem' : '0.85rem',
                    sm: '0.9rem',
                    md: '1rem',
                  },
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor:
                      mode === 'dark'
                        ? 'rgba(255, 138, 0, 0.08)'
                        : 'rgba(255, 138, 0, 0.04)',
                  },
                }}>
                Join Now
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Right Half - Family */}
        <Box
          ref={rightPanelRef}
          component={motion.div}
          initial={{ x: isMobile || isTablet ? 0 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          onMouseEnter={cycleRightImage}
          onMouseLeave={() => setRightHovered(false)}
          onClick={handleFamilyLogin}
          sx={{
            flex: leftHovered ? 0.5 : rightHovered ? 1.4 : 1,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: {
              xs: 5,
              sm: 4,
              md: 3,
              lg: 0,
            },
            px: {
              xs: 2,
              sm: 2,
              md: 3,
              lg: 4,
            },
            bgcolor: mode === 'dark' ? '#181818' : '#efefef',
            transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'pointer',
            height: {
              xs: isExtraSmallMobile ? '35vh' : '38vh',
              sm: isSmallTablet ? '40vh' : '42vh',
              md: '100%',
            },
            minHeight: {
              xs: isExtraSmallMobile ? 200 : 220,
              sm: isSmallTablet ? 250 : 300,
              md: 450,
              lg: 550,
            },
            transform: rightHovered
              ? {
                  xs: 'none',
                  sm: isSmallTablet ? 'scale(1.01)' : 'scale(1.015)',
                  md: 'scale(1.02)',
                }
              : 'none',
            zIndex: rightHovered ? 10 : 1,
            boxShadow: rightHovered
              ? mode === 'dark'
                ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 20px rgba(0, 0, 0, 0.1)'
              : 'none',
            borderTop:
              rightHovered && (isMobile || isTablet)
                ? mode === 'dark'
                  ? '2px solid rgba(255, 138, 0, 0.3)'
                  : '2px solid rgba(255, 138, 0, 0.2)'
                : 'none',
            borderLeft:
              rightHovered && !isMobile && !isTablet
                ? mode === 'dark'
                  ? '1px solid rgba(255, 138, 0, 0.2)'
                  : '1px solid rgba(255, 138, 0, 0.1)'
                : 'none',
          }}>
          {/* Background Image (cycles on hover) */}
          <Box
            component={motion.div}
            animate={{
              opacity: rightHovered ? 0.3 : 0,
              scale: rightHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.7 }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${familyImages[rightImageIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1,
              filter: rightHovered ? 'blur(0px)' : 'blur(2px)',
            }}
          />

          {/* Content */}
          <Box
            component={motion.div}
            animate={{
              y: rightHovered ? -15 : 0,
              scale: rightHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            sx={{
              position: 'relative',
              zIndex: 10,
              p: { xs: 1.5, sm: 2, md: 3 },
              maxWidth: { xs: '100%', sm: 350, md: rightHovered ? 500 : 450 },
              width: '100%',
              textAlign: 'center',
            }}>
            <motion.div
              whileHover={{ rotate: -5, scale: 1.1 }}
              transition={{ duration: 0.3 }}>
              <FamilyRestroomIcon
                sx={{
                  fontSize: { xs: 60, sm: 70, md: 90 },
                  color: theme.palette.secondary.main,
                  mb: { xs: 1, sm: 2 },
                }}
              />
            </motion.div>

            <Typography
              variant='h2'
              sx={{
                fontSize: {
                  xs: isExtraSmallMobile ? '1.1rem' : '1.3rem',
                  sm: isSmallTablet ? '1.4rem' : '1.6rem',
                  md: '2rem',
                  lg: '2.5rem',
                  xl: '3rem',
                },
                fontWeight: 700,
                mb: { xs: 1, sm: 1.5 },
                color: mode === 'dark' ? 'white' : 'text.primary',
                fontFamily: '"Playfair Display", serif',
              }}>
              Family
            </Typography>

            {/* Animated Text Loop for Family */}
            <Box
              sx={{
                height: {
                  xs: isExtraSmallMobile ? 40 : 45,
                  sm: isSmallTablet ? 45 : 55,
                  md: 60,
                },
                overflow: 'hidden',
                position: 'relative',
                mb: { xs: 1.5, sm: 2 },
              }}>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={(loopTextIndex + 2) % loopTexts.length} // Offset to show different message
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.5 }}>
                  <Typography
                    variant='body1'
                    sx={{
                      textAlign: 'center',
                      color:
                        mode === 'dark'
                          ? 'rgba(255,255,255,0.8)'
                          : 'text.secondary',
                      maxWidth: '90%',
                      mx: 'auto',
                      fontSize: {
                        xs: isExtraSmallMobile ? '0.7rem' : '0.8rem',
                        sm: isSmallTablet ? '0.8rem' : '0.9rem',
                        md: '1rem',
                      },
                    }}>
                    {loopTexts[(loopTextIndex + 2) % loopTexts.length]}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'column', md: 'row' }}
              spacing={{ xs: 1, sm: 1.5 }}
              justifyContent='center'
              sx={{
                mt: {
                  xs: isExtraSmallMobile ? 1 : 1.5,
                  sm: isSmallTablet ? 1.5 : 2,
                },
                px: isTablet ? 1 : 0,
                position: 'relative',
                zIndex: 2,
              }}>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                variant='contained'
                color='secondary'
                size={isMobile ? 'medium' : 'large'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFamilyLogin();
                }}
                sx={{
                  borderRadius: 2,
                  py: { xs: isExtraSmallMobile ? 0.8 : 1, sm: 1.5 },
                  px: { xs: isExtraSmallMobile ? 1.5 : 2, sm: 3 },
                  fontWeight: 600,
                  textTransform: 'none',
                  width: { xs: '100%', md: 'auto' },
                  fontSize: {
                    xs: isExtraSmallMobile ? '0.8rem' : '0.85rem',
                    sm: '0.9rem',
                    md: '1rem',
                  },
                  bgcolor: mode === 'dark' ? '#ff9800' : undefined, // Brighter orange in dark mode
                  color: mode === 'dark' ? '#000' : undefined, // Black text on orange for contrast
                  boxShadow:
                    mode === 'dark'
                      ? '0 4px 15px rgba(255, 152, 0, 0.3)'
                      : '0 4px 15px rgba(255, 138, 0, 0.1)',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? '#ffb74d' : undefined,
                    boxShadow:
                      mode === 'dark'
                        ? '0 8px 25px rgba(255, 152, 0, 0.4)'
                        : '0 8px 25px rgba(255, 138, 0, 0.2)',
                  },
                }}>
                Sign In
              </Button>

              <Button
                component={motion.button}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                variant='outlined'
                color='secondary'
                size={isMobile ? 'medium' : 'large'}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFamilyRegister();
                }}
                sx={{
                  borderRadius: 2,
                  py: { xs: isExtraSmallMobile ? 0.8 : 1, sm: 1.5 },
                  px: { xs: isExtraSmallMobile ? 1.5 : 2, sm: 3 },
                  fontWeight: 600,
                  textTransform: 'none',
                  width: { xs: '100%', md: 'auto' },
                  fontSize: {
                    xs: isExtraSmallMobile ? '0.8rem' : '0.85rem',
                    sm: '0.9rem',
                    md: '1rem',
                  },
                  borderColor: mode === 'dark' ? '#ff9800' : undefined,
                  color: mode === 'dark' ? '#ff9800' : undefined,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: mode === 'dark' ? '#ffb74d' : undefined,
                    color: mode === 'dark' ? '#ffb74d' : undefined,
                    bgcolor:
                      mode === 'dark' ? 'rgba(255, 152, 0, 0.08)' : undefined,
                    borderWidth: 2,
                  },
                }}>
                Join Now
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          py: {
            xs: 3,
            sm: 4,
            md: 5,
            lg: 6,
          },
          px: 0,
          borderBottom: `1px solid ${
            mode === 'dark'
              ? 'rgba(255, 138, 0, 0.2)'
              : 'rgba(255, 138, 0, 0.12)'
          }`,
          background:
            mode === 'dark'
              ? 'rgba(30, 30, 30, 0.9)'
              : theme.palette.background.subtle,
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          boxSizing: 'border-box',
        }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: {
              xs: 2,
              sm: isSmallTablet ? 2 : 3,
              md: 4,
              lg: isDesktop ? 6 : 5,
            },
            width: '100%',
            margin: 0,
            boxSizing: 'border-box',
            maxWidth: {
              lg: '1400px',
              xl: isExtraLargeDesktop ? '1800px' : '1600px',
            },
            mx: {
              lg: 'auto',
            },
          }}>
          <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent='center'>
            {statistics.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: { xs: 2, sm: 3 },
                    }}>
                    <Typography
                      variant='h4'
                      sx={{
                        color:
                          mode === 'dark'
                            ? '#FFB84D'
                            : theme.palette.primary.main,
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      }}>
                      {stat.value}
                    </Typography>
                    <Typography
                      variant='h6'
                      color={
                        mode === 'dark'
                          ? 'rgba(255,255,255,0.85)'
                          : 'text.secondary'
                      }
                      sx={{
                        fontWeight: 400,
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Our Approach Section */}
      <Box
        id='ourApproach'
        sx={{
          py: {
            xs: 5,
            sm: 6,
            md: 8,
            lg: 10,
            xl: isExtraLargeDesktop ? 12 : 10,
          },
          px: 0,
          bgcolor: mode === 'dark' ? '#111111' : 'background.default',
          borderBottom: `1px solid ${
            mode === 'dark'
              ? 'rgba(255, 138, 0, 0.2)'
              : 'rgba(255, 138, 0, 0.12)'
          }`,
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          boxSizing: 'border-box',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60%',
            background:
              mode === 'dark'
                ? 'radial-gradient(circle at 30% 20%, rgba(255, 138, 0, 0.05) 0%, transparent 70%)'
                : 'radial-gradient(circle at 30% 20%, rgba(255, 138, 0, 0.04) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: {
              xs: 2,
              sm: isSmallTablet ? 2 : 3,
              md: 4,
              lg: isDesktop ? 6 : 5,
              xl: isExtraLargeDesktop ? 8 : 6,
            },
            width: '100%',
            margin: 0,
            boxSizing: 'border-box',
            maxWidth: isExtraLargeDesktop
              ? '1800px'
              : isDesktop
              ? '1600px'
              : isLargeTablet
              ? '1200px'
              : '1000px',
            mx: isLargeTablet || isLaptop || isDesktop ? 'auto' : 0,
          }}>
          <Grid container justifyContent='center'>
            {/* Text content */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}>
              <div>
                <Box
                  sx={{
                    maxWidth: '760px',
                    mx: 'auto',
                    textAlign: 'center',
                  }}>
                  <Typography
                    variant='overline'
                    component='p'
                    sx={{
                      mb: 1.5,
                      color:
                        mode === 'dark'
                          ? '#FFB84D'
                          : theme.palette.primary.main,
                      letterSpacing: 2,
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.9rem' },
                      opacity: 0.85,
                    }}>
                    OUR APPROACH
                  </Typography>
                  <Typography
                    variant='h3'
                    component='h2'
                    sx={{
                      mb: 4,
                      fontSize: {
                        xs: isExtraSmallMobile ? '1.3rem' : '1.5rem',
                        sm: isSmallTablet ? '1.7rem' : '2rem',
                        md: '2.8rem',
                        lg: '3.2rem',
                        xl: isExtraLargeDesktop ? '3.8rem' : '3.5rem',
                      },
                      fontWeight: 800,
                      lineHeight: 1.2,
                      color:
                        mode === 'dark' ? 'white' : theme.palette.text.primary,
                      background:
                        mode === 'dark'
                          ? 'linear-gradient(90deg, #FFB84D 30%, #FFC876 100%)'
                          : `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow:
                        mode === 'dark'
                          ? '0 2px 15px rgba(255, 184, 77, 0.2)'
                          : 'none',
                    }}>
                    Welcome to the end
                    <br />
                    of forgotten memories
                  </Typography>
                  <Typography
                    variant='body1'
                    sx={{
                      mb: 4,
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      lineHeight: 1.8,
                      color:
                        mode === 'dark'
                          ? 'rgba(255,255,255,0.85)'
                          : 'text.secondary',
                      maxWidth: '650px',
                      mx: 'auto',
                      px: { xs: 1, sm: 0 },
                    }}>
                    As a leading memory-preservation platform, we do everything
                    in our power to help families preserve precious moments
                    through total clarity. We provide intuitive tools that make
                    capturing and accessing memories simple, believing in
                    connection versus distance.
                  </Typography>
                  <Button
                    variant='contained'
                    color={mode === 'dark' ? 'inherit' : 'primary'}
                    size={isMobile ? 'medium' : 'large'}
                    endIcon={<ArrowForwardIcon />}
                    onClick={handlePatientRegister}
                    sx={{
                      py: { xs: 1.2, sm: 1.5 },
                      px: { xs: 2.5, sm: 3.5 },
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'none',
                      background:
                        mode === 'dark' ? 'white' : theme.palette.primary.main,
                      color: mode === 'dark' ? '#B15500' : 'white',
                      '&:hover': {
                        boxShadow:
                          mode === 'dark'
                            ? '0 6px 12px rgba(255, 255, 255, 0.3)'
                            : '0 6px 12px rgba(255, 138, 0, 0.3)',
                        transform: 'translateY(-3px)',
                        background:
                          mode === 'dark'
                            ? 'rgba(255,255,255,0.9)'
                            : theme.palette.primary.dark,
                      },
                      transition: 'all 0.3s ease',
                    }}>
                    How We Work
                  </Button>
                </Box>
              </div>
            </Grid>

            {/* Services section below */}
            <Grid item xs={12} sx={{ mt: { xs: 6, sm: 8, md: 12 } }}>
              <div>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 3 }}
                  justifyContent='center'>
                  {[
                    {
                      icon: (
                        <AnalyticsIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                      ),
                      title: 'Data-Driven Care',
                      description:
                        'Personalized memory tracking that adapts to individual needs and cognitive patterns.',
                    },
                    {
                      icon: (
                        <DevicesIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                      ),
                      title: 'Multi-Platform Access',
                      description:
                        'Access memories seamlessly across any device - mobile, tablet, or desktop.',
                    },
                    {
                      icon: (
                        <SecurityIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                      ),
                      title: 'Privacy & Security',
                      description:
                        'End-to-end encryption ensures your personal memories remain private and secure.',
                    },
                  ].map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      key={index}
                      sx={{ display: 'flex' }}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: { xs: 2, sm: 3 },
                          height: '100%',
                          width: '100%',
                          borderRadius: 3,
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: {
                              xs: 'translateY(-5px)',
                              sm: 'translateY(-8px)',
                            },
                            boxShadow: '0 8px 20px rgba(255, 138, 0, 0.15)',
                          },
                          background:
                            mode === 'dark'
                              ? 'linear-gradient(135deg, rgba(255, 138, 0, 0.05) 0%, rgba(40, 40, 40, 1) 100%)'
                              : 'linear-gradient(135deg, rgba(255, 138, 0, 0.02) 0%, rgba(255, 255, 255, 1) 100%)',
                        }}>
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            mb: 2,
                            display: 'flex',
                            justifyContent: { xs: 'center', sm: 'flex-start' },
                          }}>
                          {item.icon}
                        </Box>
                        <Typography
                          variant='h6'
                          sx={{
                            mb: 1,
                            fontWeight: 600,
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                          }}>
                          {item.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{
                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                            textAlign: { xs: 'center', sm: 'left' },
                          }}>
                          {item.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        id='features'
        sx={{
          py: {
            xs: 3,
            sm: 4,
            md: 5,
            lg: 6,
          },
          px: 0,
          bgcolor:
            mode === 'dark'
              ? 'rgba(18, 18, 18, 0.8)'
              : theme.palette.background.subtle,
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          boxSizing: 'border-box',
        }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: {
              xs: 2,
              sm: isSmallTablet ? 2 : 3,
              md: 4,
              lg: isDesktop ? 6 : 5,
            },
            width: '100%',
            margin: 0,
            boxSizing: 'border-box',
            maxWidth: isDesktop
              ? '1600px'
              : isLargeTablet
              ? '1200px'
              : '1000px',
            mx: isLargeTablet || isLaptop || isDesktop ? 'auto' : 0,
          }}>
          <Grid container spacing={3} direction='column' alignItems='center'>
            <Grid item xs={12}>
              <div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}>
                <Box
                  sx={{
                    textAlign: 'center',
                    maxWidth: '700px',
                    mx: 'auto',
                    mb: { xs: 4, sm: 6 },
                  }}>
                  <Typography
                    variant='overline'
                    sx={{
                      color:
                        mode === 'dark'
                          ? '#FFB84D'
                          : theme.palette.primary.main,
                      letterSpacing: 2,
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.9rem' },
                    }}>
                    OUR FEATURES
                  </Typography>
                  <Typography
                    variant='h3'
                    component='h2'
                    sx={{
                      mt: 1,
                      mb: 3,
                      fontWeight: 700,
                      fontSize: {
                        xs: '1.5rem',
                        sm: isSmallTablet ? '1.7rem' : '2rem',
                        md: '2.8rem',
                      },
                      background:
                        mode === 'dark'
                          ? 'linear-gradient(90deg, #FFB84D 30%, #FFC876 100%)'
                          : `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                    Key Features That Make a Difference
                  </Typography>
                  <Typography
                    variant='body1'
                    color={
                      mode === 'dark'
                        ? 'rgba(255,255,255,0.85)'
                        : 'text.secondary'
                    }
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1.1rem' },
                      px: { xs: 1, sm: 0 },
                    }}>
                    Our comprehensive suite of memory preservation tools is
                    designed to support every phase of the memory journey.
                  </Typography>
                </Box>
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent='center'>
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(255, 138, 0, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: {
                        xs: 'translateY(-5px)',
                        sm: 'translateY(-10px)',
                      },
                      boxShadow: '0 10px 25px rgba(255, 138, 0, 0.2)',
                    },
                    background:
                      mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(177, 85, 0, 0.8) 0%, rgba(139, 69, 19, 0.9) 100%)'
                        : 'white',
                    border:
                      mode === 'dark'
                        ? `1px solid rgba(255, 178, 0, 0.25)`
                        : `1px solid rgba(255, 138, 0, 0.08)`,
                  }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Box
                      sx={{
                        mb: 3,
                        color:
                          mode === 'dark'
                            ? 'rgba(255,255,255,0.9)'
                            : theme.palette.primary.main,
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                      {feature.icon}
                    </Box>
                    <Typography
                      variant='h5'
                      component='h3'
                      align='center'
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        color: mode === 'dark' ? 'white' : 'inherit',
                      }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant='body2'
                      align='center'
                      color={
                        mode === 'dark'
                          ? 'rgba(255,255,255,0.85)'
                          : 'text.secondary'
                      }
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.7,
                      }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Box
        sx={{
          py: {
            xs: 3,
            sm: 4,
            md: 5,
            lg: 6,
          },
          px: 0,
          bgcolor: mode === 'dark' ? '#111111' : 'background.default',
          width: '100%',
          maxWidth: '100%',
          margin: 0,
          boxSizing: 'border-box',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20%',
            background:
              mode === 'dark'
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)'
                : 'linear-gradient(to bottom, rgba(0,0,0,0.03) 0%, transparent 100%)',
            zIndex: 0,
          },
        }}>
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: {
              xs: 2,
              sm: isSmallTablet ? 2 : 3,
              md: 4,
              lg: isDesktop ? 6 : 5,
            },
            width: '100%',
            margin: 0,
            boxSizing: 'border-box',
            maxWidth: isDesktop
              ? '1600px'
              : isLargeTablet
              ? '1200px'
              : '1000px',
            mx: isLargeTablet || isLaptop || isDesktop ? 'auto' : 0,
            position: 'relative',
            zIndex: 1,
          }}>
          <div>
            <Typography
              variant='h3'
              component='h2'
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              }}>
              Ready to preserve your memories?
            </Typography>
            <Typography
              variant='h6'
              component='div'
              sx={{
                mb: 5,
                maxWidth: '700px',
                mx: 'auto',
                opacity: 0.9,
                fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.2rem' },
              }}>
              Join today and start creating a lasting collection of precious
              moments.
            </Typography>

            {/* Logo placed outside of the typography element */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                my: 3,
              }}>
              <Logo size='large' withLink={false} />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                variant='contained'
                size='large'
                color='inherit'
                onClick={handlePatientRegister}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 5 },
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow:
                    mode === 'dark'
                      ? '0 4px 15px rgba(255, 255, 255, 0.35)'
                      : '0 4px 15px rgba(255, 189, 0, 0.3)',
                  bgcolor: 'white',
                  color:
                    mode === 'dark' ? '#B15500' : theme.palette.secondary.main,
                  '&:hover': {
                    boxShadow:
                      mode === 'dark'
                        ? '0 8px 25px rgba(255, 255, 255, 0.45)'
                        : '0 8px 25px rgba(255, 189, 0, 0.4)',
                    transform: 'translateY(-3px)',
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  transition: 'all 0.3s',
                  width: { xs: '100%', sm: 'auto' },
                }}>
                Get Started
              </Button>
              <Button
                variant='outlined'
                size='large'
                onClick={handlePricingNavigate}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 5 },
                  borderRadius: 2,
                  border: 'none',
                  fontSize: { xs: '0.9rem', sm: '1.1rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow:
                    mode === 'dark'
                      ? '0 4px 15px rgba(255, 255, 255, 0.35)'
                      : '0 4px 15px rgba(255, 189, 0, 0.3)',
                  bgcolor: 'white',
                  color:
                    mode === 'dark' ? '#B15500' : theme.palette.secondary.main,
                  '&:hover': {
                    boxShadow:
                      mode === 'dark'
                        ? '0 8px 25px rgba(255, 255, 255, 0.45)'
                        : '0 8px 25px rgba(255, 189, 0, 0.4)',
                    transform: 'translateY(-3px)',
                    bgcolor: 'rgba(255,255,255,0.9)',
                  },
                  transition: 'all 0.3s',
                  width: { xs: '100%', sm: 'auto' },
                }}>
                View Pricing
              </Button>
            </Box>
          </div>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
