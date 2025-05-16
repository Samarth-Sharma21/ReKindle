import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import './App.css';

// Layout and Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MemoryProvider from './contexts/MemoryContext';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const PatientLogin = lazy(() => import('./pages/PatientLogin'));
const FamilyLogin = lazy(() => import('./pages/FamilyLogin'));
const PatientRegister = lazy(() => import('./pages/PatientRegister'));
const FamilyRegister = lazy(() => import('./pages/FamilyRegister'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));
const FamilyDashboard = lazy(() => import('./pages/FamilyDashboard'));
const PatientTimeline = lazy(() => import('./pages/PatientTimeline'));
const FamilyTimeline = lazy(() => import('./pages/FamilyTimeline'));
const AddMemory = lazy(() => import('./pages/AddMemory'));
const MemoryDetails = lazy(() => import('./pages/MemoryDetails'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const BreathingGame = lazy(() => import('./pages/BreathingGame'));
const Settings = lazy(() => import('./pages/Settings'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const SavedLocations = lazy(() => import('./pages/SavedLocations'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const TaskManagerPage = lazy(() => import('./pages/TaskManagerPage'));
const FamilyTaskManagerPage = lazy(() =>
  import('./pages/FamilyTaskManagerPage')
);

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
    <CircularProgress color='primary' />
  </Box>
);

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <MemoryProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path='/' element={<LandingPage />} />
                <Route path='/patient/login' element={<PatientLogin />} />
                <Route path='/family/login' element={<FamilyLogin />} />
                <Route path='/patient/register' element={<PatientRegister />} />
                <Route path='/family/register' element={<FamilyRegister />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/pricing' element={<PricingPage />} />

                {/* Protected routes with Layout */}
                <Route element={<Layout />}>
                  {/* Patient routes */}
                  <Route
                    path='/patient/dashboard'
                    element={
                      <ProtectedRoute userType='patient'>
                        <PatientDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/patient/dashboard/timeline'
                    element={
                      <ProtectedRoute userType='patient'>
                        <PatientTimeline />
                      </ProtectedRoute>
                    }
                  />

                  {/* Family routes */}
                  <Route
                    path='/family/dashboard'
                    element={
                      <ProtectedRoute userType='family'>
                        <FamilyDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/family/dashboard/timeline'
                    element={
                      <ProtectedRoute userType='family'>
                        <FamilyTimeline />
                      </ProtectedRoute>
                    }
                  />

                  {/* Shared protected routes */}
                  <Route
                    path='/add-memory'
                    element={
                      <ProtectedRoute userType='any'>
                        <AddMemory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/memory/:id'
                    element={
                      <ProtectedRoute userType='any'>
                        <MemoryDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/help'
                    element={
                      <ProtectedRoute userType='any'>
                        <HelpCenter />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/breathing-game'
                    element={
                      <ProtectedRoute userType='any'>
                        <BreathingGame />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/settings'
                    element={
                      <ProtectedRoute userType='any'>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/saved-locations'
                    element={
                      <ProtectedRoute userType='any'>
                        <SavedLocations />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/calendar'
                    element={
                      <ProtectedRoute userType='any'>
                        <CalendarPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/task-manager'
                    element={
                      <ProtectedRoute userType='patient'>
                        <TaskManagerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path='/family/task-manager'
                    element={
                      <ProtectedRoute userType='family'>
                        <FamilyTaskManagerPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Redirect for any unmatched routes */}
                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </Suspense>
          </MemoryProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
