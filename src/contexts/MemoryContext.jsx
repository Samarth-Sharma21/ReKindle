import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../pages/server';
import { useAuth } from './AuthContext';

const MemoryContext = createContext(null);

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};

export const MemoryProvider = ({ children }) => {
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchMemories = async () => {
      if (!user) {
        setMemories([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Determine which user's memories to fetch
        let userId = user.id;

        // If user is a family member, we need to get the patient's memories
        if (user.type === 'family' && user.patient_id) {
          userId = user.patient_id;
        }

        // Fetch memories from Supabase
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (error) throw error;

        setMemories(data || []);
      } catch (err) {
        console.error('Error fetching memories:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, [user, refreshKey]);

  const value = {
    memories,
    loading,
    error,
    triggerRefresh,
  };

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
};

export default MemoryProvider;
