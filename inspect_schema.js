const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://adzopqgalxfxcigveoct.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkem9wcWdhbHhmeGNpZ3Zlb2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTY1NjgsImV4cCI6MjA4ODczMjU2OH0.DrcLALUQ7X5s5jwi8zcVVkW2Rj7l1lAbL014ln6lDE0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectSchema() {
  console.log('--- Inspecting Profiles Table ---');
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (profError) {
    console.error('Profiles Select Error:', profError);
  } else {
    console.log('Profiles columns:', Object.keys(profiles[0] || {}));
  }
}

inspectSchema();
