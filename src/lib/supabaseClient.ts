import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvnzhqufublxartwdndz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bnpocXVmdWJseGFydHdkbmR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3Njc2NDQsImV4cCI6MjA1OTM0MzY0NH0.R5cWIupTtxvaoXkKpQveCsLVit9iG3wEFFGsk4lgIc0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);