import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Stack,
  Slide,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '../components/Logo';
import { Footer } from '../components';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const PricingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [scrollDir, setScrollDir] = useState('up');
  const [prevScrollY, setPrevScrollY] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleGoBack = () => {
    navigate('/');
  };

  const handlePatientRegister = () => {
    navigate('/patient/register');
  };

  const handleSwitchChange = () => {
    setYearlyBilling(!yearlyBilling);
  };

  // Pricing tiers
  const tiers = [
    {
      title: 'Basic',
      price: 'FREE',
      description: 'Free for everyone, forever',
      buttonText: 'Start Free',
      buttonVariant: 'outlined',
      features: [
        'Basic memory storage',
        'Photo uploads (limit: 100)',
        'Text entries',
        'Basic timeline view',
        'Email support',
      ],
    },
    {
      title: 'Pro',
      price: yearlyBilling ? '$120/year' : '$10/month',
      description: 'Most popular for personal use',
      buttonText: 'Start Free',
      buttonVariant: 'contained',
      features: [
        'Everything in Basic',
        'Unlimited photo uploads',
        'Voice recordings',
        'Advanced timeline organization',
        'Family sharing (up to 3 members)',
        'Priority support',
        'Customizable themes',
      ],
      isFeatured: true,
    },
    {
      title: 'Family',
      price: yearlyBilling ? '$240/year' : '$20/month',
      description: 'For families managing multiple accounts',
      buttonText: 'Start Free',
      buttonVariant: 'outlined',
      features: [
        'Everything in Pro',
        'Family sharing (up to 10 members)',
        'Advanced privacy controls',
        'Collaborative memory additions',
        'Memory analytics',
        'Dedicated support specialist',
        'Custom backup options',
      ],
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        overflow: 'hidden',
        width: '100%',
      }}>
      {/* Header Section */}
      <Slide appear={false} direction='down' in={scrollDir === 'up'}>
        <AppBar
          position='fixed'
          color='transparent'
          elevation={0}
          sx={{
            backdropFilter: 'blur(10px)',
            background: mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            borderBottom: `1px solid ${mode === 'dark' 
              ? 'rgba(255, 138, 0, 0.2)' 
              : 'rgba(255, 138, 0, 0.12)'}`,
            color: mode === 'dark' ? '#fff' : 'inherit',
          }}>
          <Container maxWidth='lg'>
            <Toolbar
              disableGutters
              sx={{ justifyContent: 'space-between', py: 1 }}>
              {/* Brand Logo/Name */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  transform: { xs: 'scale(0.9)', sm: 'scale(1.2)' },
                  transformOrigin: 'left center',
                  ml: { xs: 0, sm: 0 },
                }}>
                <Logo size={isMobile ? 'small' : 'medium'} withLink={true} linkTo="/" />
              </Box>

              {/* Back Button */}
              {isMobile ? (
                <IconButton
                  color='inherit'
                  onClick={handleGoBack}
                  sx={{
                    '&:hover': { color: theme.palette.primary.main },
                  }}>
                  <ArrowBackIcon />
                </IconButton>
              ) : (
                <Button
                  startIcon={<ArrowBackIcon />}
                  color='inherit'
                  onClick={handleGoBack}
                  sx={{
                    fontWeight: 500,
                    '&:hover': { color: theme.palette.primary.main },
                    textTransform: 'none',
                  }}>
                  Back to Home
                </Button>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>

      <Container
        maxWidth='lg'
        sx={{
          pt: { xs: 12, sm: 15 },
          pb: { xs: 8, sm: 10 },
          px: { xs: 1, sm: 3 },
        }}>
        {/* Pricing Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, sm: 8 } }}>
          <Typography
            variant='h2'
            component='h1'
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Pricing
          </Typography>
          <Typography
            variant='h5'
            sx={{
              color: 'text.secondary',
              maxWidth: '700px',
              mx: 'auto',
              mb: 5,
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6,
              px: { xs: 1, sm: 0 },
            }}>
            Choose the plan that works for you
          </Typography>

          {/* Free For Now Banner */}
          <Box
            sx={{
              py: { xs: 1.5, sm: 2 },
              px: { xs: 2, sm: 4 },
              bgcolor: 'rgba(255, 189, 0, 0.15)',
              borderRadius: 2,
              mb: 5,
              mx: 'auto',
              maxWidth: 'fit-content',
              border: `1px solid ${theme.palette.secondary.main}`,
            }}>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.dark,
                fontSize: { xs: '0.9rem', sm: '1.25rem' },
              }}>
              It's all FREE for now! We're in beta.
            </Typography>
          </Box>

          {/* Billing Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={yearlyBilling}
                  onChange={handleSwitchChange}
                  color='primary'
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      mr: 1,
                      fontWeight: yearlyBilling ? 400 : 700,
                      color: yearlyBilling
                        ? 'text.secondary'
                        : theme.palette.primary.main,
                      fontSize: { xs: '0.8rem', sm: '1rem' },
                    }}>
                    Monthly
                  </Typography>
                  <Divider
                    orientation='vertical'
                    flexItem
                    sx={{ mx: 1, height: 20 }}
                  />
                  <Typography
                    sx={{
                      ml: 1,
                      fontWeight: yearlyBilling ? 700 : 400,
                      color: yearlyBilling
                        ? theme.palette.primary.main
                        : 'text.secondary',
                      fontSize: { xs: '0.8rem', sm: '1rem' },
                    }}>
                    Yearly{' '}
                    <Box
                      component='span'
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        bgcolor: yearlyBilling
                          ? 'rgba(255, 138, 0, 0.15)'
                          : 'transparent',
                        color: yearlyBilling
                          ? theme.palette.primary.dark
                          : 'text.secondary',
                      }}>
                      Save 30%
                    </Box>
                  </Typography>
                </Box>
              }
              labelPlacement='end'
            />
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent='center'>
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={6}
              md={4}
              sx={{ display: 'flex' }}>
              <Card
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: tier.isFeatured
                    ? `2px solid ${theme.palette.primary.main}`
                    : '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: {
                      xs: 'translateY(-5px)',
                      sm: 'translateY(-10px)',
                    },
                    boxShadow: '0 8px 30px rgba(255, 138, 0, 0.15)',
                  },
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                {tier.isFeatured && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 15,
                      right: -30,
                      transform: 'rotate(45deg)',
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      py: 0.5,
                      width: 150,
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      zIndex: 1,
                    }}>
                    MOST POPULAR
                  </Box>
                )}

                <CardContent
                  sx={{
                    p: { xs: 2, sm: 3 },
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant='h5'
                      component='h3'
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      }}>
                      {tier.title}
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        color: 'text.secondary',
                        mb: 2,
                      }}>
                      {tier.description}
                    </Typography>
                    <Typography
                      variant='h3'
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        fontSize: {
                          xs: '1.75rem',
                          sm: '2.25rem',
                          md: '2.5rem',
                        },
                      }}>
                      {tier.price}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ flexGrow: 1, mb: 3 }}>
                    <List sx={{ p: 0 }}>
                      {tier.features.map((feature) => (
                        <ListItem
                          key={feature}
                          disableGutters
                          sx={{
                            py: { xs: 0.5, sm: 1 },
                          }}>
                          <ListItemIcon sx={{ minWidth: { xs: 32, sm: 40 } }}>
                            <CheckIcon
                              color='primary'
                              sx={{ fontSize: { xs: 18, sm: 20 } }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Button
                    variant={tier.buttonVariant}
                    color='primary'
                    size={isMobile ? 'medium' : 'large'}
                    onClick={handlePatientRegister}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: { xs: 1, sm: 1.5 },
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}>
                    {tier.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Box
          sx={{
            mt: { xs: 6, sm: 10 },
            mb: { xs: 4, sm: 8 },
            textAlign: 'center',
          }}>
          <Typography
            variant='h4'
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
            }}>
            Frequently Asked Questions
          </Typography>
          <Typography
            variant='subtitle1'
            color='text.secondary'
            sx={{
              mb: 5,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}>
            Still have questions? Contact our support team
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent='center'>
            {[
              {
                question: 'How do I switch between plans?',
                answer:
                  'You can upgrade or downgrade your plan at any time from your account settings page.',
              },
              {
                question: 'Can I try the Pro features before purchasing?',
                answer:
                  'Yes! During our beta period, all features are available for free.',
              },
              {
                question:
                  'Do I have to provide payment information for the free plan?',
                answer:
                  'No, the Basic plan is completely free and requires no payment information.',
              },
              {
                question: 'Is there a limit to how many memories I can store?',
                answer:
                  'The Basic plan has storage limits, while Pro and Family plans offer more generous storage options.',
              },
            ].map((faq, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    p: { xs: 2, sm: 3 },
                    height: '100%',
                    textAlign: 'left',
                    borderRadius: 2,
                  }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <HelpOutlineIcon
                      sx={{
                        color: theme.palette.primary.main,
                        mr: 1.5,
                        mt: 0.3,
                      }}
                    />
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                      }}>
                      {faq.question}
                    </Typography>
                  </Box>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                      pl: 4.5,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    }}>
                    {faq.answer}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call-to-action section */}
        <Box
          sx={{
            textAlign: 'center',
            mt: { xs: 4, sm: 8 },
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor: 'rgba(255, 138, 0, 0.08)',
            border: '1px solid rgba(255, 138, 0, 0.15)',
          }}>
          <Typography
            variant='h4'
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
            }}>
            Ready to start preserving memories?
          </Typography>
          <Typography
            variant='body1'
            sx={{
              mb: 3,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}>
            Join ReKindle today and start your memory preservation journey.
          </Typography>
          <Button
            variant='contained'
            color='primary'
            size={isMobile ? 'medium' : 'large'}
            onClick={handlePatientRegister}
            sx={{
              borderRadius: 2,
              py: { xs: 1, sm: 1.5 },
              px: { xs: 3, sm: 4 },
              fontWeight: 600,
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}>
            Get Started Now
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default PricingPage;
