import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvwvurqedrcmwuuwzkcg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2d3Z1cnFlZHJjbXd1dXd6a2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDcxNDksImV4cCI6MjA1OTAyMzE0OX0.tsN9l5DkoHJin8xOGzikgcG5LhXkMXBbIEHtgRwas6o';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing supabase credentials');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Persist user session
    autoRefreshToken: true, // Auto-refresh login session
    detectSessionInUrl: true,
  },
});

// Helper functions for location management
const locationService = {
  // Save a location to the database
  saveLocation: async (location, userId) => {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .insert([{ ...location, user_id: userId }]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error saving location:', error);
      return { data: null, error };
    }
  },

  // Get all locations for a user
  getLocations: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching locations:', error);
      return { data: null, error };
    }
  },

  // Update a location
  updateLocation: async (location, locationId) => {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .update(location)
        .eq('id', locationId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating location:', error);
      return { data: null, error };
    }
  },

  // Delete a location
  deleteLocation: async (locationId) => {
    try {
      const { data, error } = await supabase
        .from('saved_locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting location:', error);
      return { data: null, error };
    }
  },
};

// Helper functions for emergency contact management
const emergencyContactService = {
  // Save a contact to the database
  saveContact: async (contact, userId) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert([{ ...contact, user_id: userId }]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error saving contact:', error);
      return { data: null, error };
    }
  },

  // Get all contacts for a user
  getContacts: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return { data: null, error };
    }
  },

  // Update a contact
  updateContact: async (contact, contactId) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update(contact)
        .eq('id', contactId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating contact:', error);
      return { data: null, error };
    }
  },

  // Delete a contact
  deleteContact: async (contactId) => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { data: null, error };
    }
  },
};

export { supabase, locationService, emergencyContactService };