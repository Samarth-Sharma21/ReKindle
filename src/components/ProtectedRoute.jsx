import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the appropriate login page based on the route type
    const loginPath =
      user?.type === 'patient' ? '/patient/login' : '/family/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Allow access to shared routes marked with userType 'any'
  if (userType === 'any') {
    return children;
  }

  // Check if the user type matches the required type for the route
  if (user.type !== userType) {
    const correctPath =
      user.type === 'patient' ? '/patient/dashboard' : '/family/dashboard';
    return <Navigate to={correctPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
