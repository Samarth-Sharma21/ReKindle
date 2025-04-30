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
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Logo from '../components/Logo';
import { Footer } from '../components';

const PricingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [scrollDir, setScrollDir] = useState('up');
  const [prevScrollY, setPrevScrollY] = useState(0);

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
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Section */}
      <Slide appear={false} direction='down' in={scrollDir === 'up'}>
        <AppBar
          position='fixed'
          color='transparent'
          elevation={0}
          sx={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.9)',
            borderBottom: `1px solid rgba(255, 138, 0, 0.12)`,
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
                  transform: 'scale(1.2)',
                  transformOrigin: 'left center',
                }}>
                <Logo size='medium' />
              </Box>

              {/* Back Button */}
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
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>

      <Container maxWidth='lg' sx={{ pt: 15, pb: 10 }}>
        {/* Pricing Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant='h2'
            component='h1'
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
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
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6,
            }}>
            Choose the plan that works for you
          </Typography>

          {/* Free For Now Banner */}
          <Box
            sx={{
              py: 2,
              px: 4,
              bgcolor: 'rgba(255, 189, 0, 0.15)',
              borderRadius: 2,
              mb: 5,
              mx: 'auto',
              maxWidth: 'fit-content',
              border: `1px solid ${theme.palette.secondary.main}`,
            }}>
            <Typography
              variant='h6'
              sx={{ fontWeight: 700, color: theme.palette.primary.dark }}>
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
                    }}>
                    Yearly (save 20%)
                  </Typography>
                </Box>
              }
              labelPlacement='end'
            />
          </Box>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent='center'>
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={6}
              md={4}
              sx={{
                display: 'flex',
              }}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: tier.isFeatured
                    ? `0 8px 24px 0 rgba(255, 138, 0, 0.25)`
                    : `0 4px 12px 0 rgba(255, 138, 0, 0.1)`,
                  border: tier.isFeatured
                    ? `2px solid ${theme.palette.primary.main}`
                    : 'none',
                  transform: tier.isFeatured ? 'scale(1.05)' : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 12px 28px 0 rgba(255, 138, 0, ${
                      tier.isFeatured ? '0.3' : '0.2'
                    })`,
                    transform: tier.isFeatured ? 'scale(1.07)' : 'scale(1.02)',
                  },
                  overflow: 'visible',
                  position: 'relative',
                  background: tier.isFeatured
                    ? 'linear-gradient(135deg, rgba(255, 138, 0, 0.05) 0%, rgba(255, 255, 255, 1) 100%)'
                    : 'white',
                }}>
                {tier.isFeatured && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      borderRadius: 5,
                      py: 0.5,
                      px: 2,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}>
                    Most Popular
                  </Box>
                )}
                <CardContent
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}>
                  <Typography
                    variant='h4'
                    component='h2'
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: tier.isFeatured
                        ? theme.palette.primary.main
                        : 'inherit',
                    }}>
                    {tier.title}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {/* Strikethrough price */}
                    <Typography
                      component='span'
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          width: '100%',
                          height: '2px',
                          backgroundColor: theme.palette.error.main,
                          transform: 'rotate(-8deg)',
                        },
                      }}>
                      {tier.price}
                    </Typography>{' '}
                    <Typography
                      component='span'
                      sx={{
                        ml: 1,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: theme.palette.secondary.main,
                      }}>
                      FREE
                    </Typography>
                  </Box>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 3, minHeight: '40px' }}>
                    {tier.description}
                  </Typography>

                  <Divider
                    sx={{ my: 2, borderColor: 'rgba(255, 138, 0, 0.12)' }}
                  />

                  <Typography
                    variant='subtitle2'
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}>
                    Includes
                  </Typography>
                  <List sx={{ mb: 'auto', pt: 0 }}>
                    {tier.features.map((feature) => (
                      <ListItem key={feature} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon color='primary' fontSize='small' />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ mt: 4 }}>
                    <Button
                      fullWidth
                      variant={tier.buttonVariant}
                      color={tier.isFeatured ? 'secondary' : 'primary'}
                      onClick={handlePatientRegister}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                      }}>
                      {tier.buttonText}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 12, textAlign: 'center' }}>
          <Typography
            variant='h3'
            component='h2'
            sx={{
              fontWeight: 700,
              mb: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            Frequently Asked Questions
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
                  Why isn't ReKindle charging for its services?
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  We're currently in beta, focusing on perfecting our platform
                  and building our community. We believe in making memory
                  preservation accessible to everyone during this phase.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
                  Will there be pricing in the future?
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Yes, we plan to introduce tiered pricing in the future to
                  sustainably support our services, but will always offer a free
                  option for basic memory preservation.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
                  Who owns the memories stored in ReKindle?
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  You do! All content you upload belongs to you. We never claim
                  ownership of your personal memories and provide tools to
                  download your data anytime.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', mb: 4 }}>
                <Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
                  What happens to my memories if I choose to stop using
                  ReKindle?
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  We provide tools to export all your memories before closing
                  your account. After account closure, data is securely deleted
                  after a 30-day grace period.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 12,
            py: 8,
            px: { xs: 3, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
          }}>
          <Typography
            variant='h3'
            component='h2'
            sx={{ fontWeight: 700, mb: 3 }}>
            Start preserving your memories today
          </Typography>
          <Typography
            variant='h6'
            sx={{ maxWidth: '800px', mx: 'auto', mb: 5, opacity: 0.9 }}>
            Join thousands of families who are strengthening connections through
            shared memories.
          </Typography>
          <Button
            variant='contained'
            color='secondary'
            size='large'
            onClick={handlePatientRegister}
            sx={{
              py: 1.5,
              px: 5,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.secondary.light,
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(255, 189, 0, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}>
            Sign Up For Free
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default PricingPage;
