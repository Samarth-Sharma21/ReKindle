import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../styles/responsiveStyles';

/**
 * AuthGuard - A higher-order component that provides enhanced security
 * by checking authentication status and preventing URL manipulation.
 *
 * This component works alongside ProtectedRoute but adds additional
 * security checks and redirects unauthorized users.
 */
const AuthGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    // Check if the user is authenticated
    if (!isAuthenticated) {
      // Store the attempted URL for redirection after login
      const loginPath = '/patient/login';
      navigate(loginPath, {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // Check if the user is trying to access a route that doesn't match their user type
    const isPatientRoute = location.pathname.includes('/patient/');
    const isFamilyRoute = location.pathname.includes('/family/');

    // Redirect if trying to access specific user type routes
    if (isPatientRoute && user?.type !== 'patient') {
      navigate('/family/dashboard', { replace: true });
      return;
    }

    if (isFamilyRoute && user?.type !== 'family') {
      navigate('/patient/dashboard', { replace: true });
      return;
    }

    // For shared routes, ensure user is authenticated
    const isProtectedRoute = [
      '/add-memory',
      '/memory/',
      '/help',
      '/breathing-game',
      '/settings',
      '/saved-locations',
      '/calendar',
      '/task-manager',
    ].some((route) => location.pathname.includes(route));

    if (isProtectedRoute && !isAuthenticated) {
      navigate('/patient/login', {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [isAuthenticated, location.pathname, navigate, user]);

  // Return children directly to avoid adding extra padding that might interfere with layout
  // The ResponsiveWrapper component should be used in individual pages instead
  return children;
};

export default AuthGuard;
