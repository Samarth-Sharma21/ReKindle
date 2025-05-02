import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvwvurqedrcmwuuwzkcg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2d3Z1cnFlZHJjbXd1dXd6a2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDcxNDksImV4cCI6MjA1OTAyMzE0OX0.tsN9l5DkoHJin8xOGzikgcG5LhXkMXBbIEHtgRwas6o';



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
export { supabase };
