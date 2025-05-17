import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../styles/responsiveStyles';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (!isAuthenticated) {
    // Redirect to the appropriate login page based on the route type
    const loginPath =
      user?.type === 'patient' ? '/patient/login' : '/family/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Allow access to shared routes marked with userType 'any'
  if (userType === 'any') {
    // Apply responsive styling to ensure consistent layout across all protected routes
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
        {children}
      </div>
    );
  }

  // Check if the user type matches the required type for the route
  if (user.type !== userType) {
    const correctPath =
      user.type === 'patient' ? '/patient/dashboard' : '/family/dashboard';
    return <Navigate to={correctPath} replace />;
  }

  // Return children directly to avoid adding extra padding that might interfere with layout
  // The ResponsiveWrapper component should be used in individual pages instead
  return children;
};

export default ProtectedRoute;
