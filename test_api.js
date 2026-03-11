const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://adzopqgalxfxcigveoct.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkem9wcWdhbHhmeGNpZ3Zlb2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTY1NjgsImV4cCI6MjA4ODczMjU2OH0.DrcLALUQ7X5s5jwi8zcVVkW2Rj7l1lAbL014ln6lDE0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPublicSnippets() {
  console.log('--- Testing Explicit Constraint Name ---');
  const { data, error } = await supabase
    .from('snippets')
    .select('*, profiles!snippets_user_id_fkey(username, display_name), snippet_tags(tags(*))')
    .eq('is_public', true)
    .limit(1)
    .single();

  if (error) {
    console.error('Error Details:', JSON.stringify(error, null, 2));
  } else {
    console.log('Success! Count:', data ? 1 : 0);
    if (data) {
      console.log('Profile:', data.profiles);
    }
  }
}

testPublicSnippets();
