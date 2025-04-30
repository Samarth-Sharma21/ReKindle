import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Tooltip,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HelpIcon from '@mui/icons-material/Help';
import SpaIcon from '@mui/icons-material/Spa';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Determine if we're on a patient or family page
  const isPatientView = location.pathname.includes('patient');
  const userType = isPatientView ? 'Patient' : 'Family';

  const pages = [
    {
      name: 'Home',
      icon: <HomeIcon />,
      path: isPatientView ? '/patient/dashboard' : '/family/dashboard',
    },
    {
      name: 'Timeline',
      icon: <TimelineIcon />,
      path: isPatientView
        ? '/patient/dashboard/timeline'
        : '/family/dashboard/timeline',
    },
    {
      name: 'Add Memory',
      icon: <AddPhotoAlternateIcon />,
      path: '/add-memory',
    },
    { name: 'Breathing Exercise', icon: <SpaIcon />, path: '/breathing-game' },
    { name: 'Help', icon: <HelpIcon />, path: '/help' },
  ];

  const settings = [
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
    { name: 'Logout', path: '/' },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleSettingNavigation = (path) => {
    navigate(path);
    handleCloseUserMenu();
  };

  return (
    <AppBar position='fixed' color='primary' sx={{ top: 0, bottom: 'auto' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <div>
            <AccessibilityNewIcon
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 35 }}
            />
          </div>
          <Typography
            variant='h6'
            noWrap
            component='a'
            href={isPatientView ? '/patient/dashboard' : '/family/dashboard'}
            sx={{
              mr: 3,
              display: { xs: 'none', md: 'flex' },
              fontFamily: '"Bodoni Moda", serif',
              fontWeight: 400,
              fontSize: '2rem',
              color: 'inherit',
              textDecoration: 'none',
              letterSpacing: '0.05rem',
            }}>
            <span style={{ fontWeight: 700 }}>R</span>
            <span>e</span>
            <span style={{ fontWeight: 700 }}>K</span>
            <span>indle</span>
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='menu'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'>
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}>
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleNavigation(page.path)}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {page.icon}
                    <Typography sx={{ ml: 1 }}>{page.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile logo */}
          <AccessibilityNewIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, fontSize: 30 }}
          />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href=''
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: '"Bodoni Moda", serif',
              fontWeight: 400,
              fontSize: '1.7rem',
              color: 'inherit',
              textDecoration: 'none',
              letterSpacing: '0.05rem',
            }}>
            <span style={{ fontWeight: 700 }}>R</span>
            <span>e</span>
            <span style={{ fontWeight: 700 }}>K</span>
            <span>indle</span>
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigation(page.path)}
                sx={{
                  my: 2,
                  mx: 1.5,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}>
                {page.icon}
                <Typography sx={{ ml: 1 }}>{page.name}</Typography>
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {userType.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem
                  key={setting.name}
                  onClick={() => handleSettingNavigation(setting.path)}>
                  <Typography textAlign='center'>{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
