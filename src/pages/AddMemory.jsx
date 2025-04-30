import { useState, useEffect } from 'react';
import { supabase } from './server';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMemory } from '../contexts/MemoryContext';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MemoryForm } from '../components';

const AddMemory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerRefresh } = useMemory();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [recentLocations, setRecentLocations] = useState([]);
  const [memoryData, setMemoryData] = useState({
    title: '',
    description: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    type: 'text',
    people: [],
    filter: 'none',
    location: '',
  });

  // Fetch recent locations
  useEffect(() => {
    const fetchRecentLocations = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) return;

        // Determine user ID - handle both patient and family members
        let userId = authUser.id;

        // If user is a family member, we need to get patient ID
        if (user?.type === 'family') {
          const { data: familyData, error: familyError } = await supabase
            .from('family_members')
            .select('patient_id')
            .eq('id', authUser.id)
            .single();

          if (familyError) throw familyError;
          userId = familyData.patient_id;
        }

        const { data, error } = await supabase
          .from('memories')
          .select('location')
          .eq('user_id', userId)
          .not('location', 'is', null)
          .not('location', 'eq', '')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Get unique locations
        const uniqueLocations = [
          ...new Set(data.map((memory) => memory.location)),
        ];
        setRecentLocations(uniqueLocations);
      } catch (err) {
        console.error('Error fetching recent locations:', err.message);
      }
    };

    fetchRecentLocations();
  }, [user]);

  const handleLocationSelect = (location) => {
    setMemoryData((prev) => ({ ...prev, location }));
  };

  const steps = ['Create Memory', 'Add Details', 'Review & Save'];

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        // Get authenticated user
        const {
          data: { user: authUser },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !authUser) {
          throw new Error('User not authenticated! Please log in.');
        }

        // Determine user ID - for patients it's their own ID
        // For family members, we need to get the patient ID
        let userId = authUser.id;

        if (user?.type === 'family') {
          const { data: familyData, error: familyError } = await supabase
            .from('family_members')
            .select('patient_id')
            .eq('id', authUser.id)
            .single();

          if (familyError || !familyData) {
            throw new Error('Could not find connected patient');
          }
          userId = familyData.patient_id;
        }

        // Insert memory into Supabase without the created_by field
        const { error } = await supabase.from('memories').insert([
          {
            user_id: userId, // The patient ID (whose memory it is)
            title: memoryData.title,
            description: memoryData.description,
            content: memoryData.content,
            date: memoryData.date,
            type: memoryData.type,
            location: memoryData.location,
            people: memoryData.people,
            filter: memoryData.filter,
          },
        ]);

        if (error) throw error;

        // Trigger refresh of memories in the MemoryContext
        triggerRefresh();

        setCompleted(true);
        setTimeout(() => {
          // Redirect based on user type
          if (user?.type === 'family') {
            navigate('/family/dashboard');
          } else {
            navigate('/patient/dashboard');
          }
        }, 2000);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <Container maxWidth='md' sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant='h4'>Add New Memory</Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          {completed ? (
            <Alert severity='success'>
              Memory saved successfully! Redirecting...
            </Alert>
          ) : (
            <>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity='error' sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {activeStep === 1 && recentLocations.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant='subtitle1'
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color='primary' />
                    Recent Locations
                  </Typography>
                  <Stack direction='row' spacing={1} flexWrap='wrap' gap={1}>
                    {recentLocations.map((location, index) => (
                      <Chip
                        key={index}
                        label={location}
                        onClick={() => handleLocationSelect(location)}
                        color={
                          memoryData.location === location
                            ? 'primary'
                            : 'default'
                        }
                        variant={
                          memoryData.location === location
                            ? 'filled'
                            : 'outlined'
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <MemoryForm
                memoryData={memoryData}
                setMemoryData={setMemoryData}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 4,
                }}>
                <Button
                  variant='outlined'
                  onClick={handleBack}
                  sx={{ borderRadius: 2 }}>
                  Back
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleNext}
                  sx={{ borderRadius: 2 }}>
                  {activeStep === steps.length - 1 ? 'Save Memory' : 'Next'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default AddMemory;
