import { createClient } from '@supabase/supabase-js';
// Note: supabaseUrl and supabaseAnonKey are hardcoded here for demonstration
// purposes. In a real application, these should be fetched from environment
// variables or a secure configuration store.
export const supabase = createClient('https://xvnzhqufublxartwdndz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bnpocXVmdWJseGFydHdkbmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njc2NDQsImV4cCI6MjA1OTM0MzY0NH0.R5cWIupTtxvaoXkKpQveCsLVit9iG3wEFFGsk4lgIc0');

