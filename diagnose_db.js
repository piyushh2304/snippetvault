const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('🔍 Diagnosing SnippetVault Database...');

  const { count: profileCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: publicSnippetCount } = await supabase.from('snippets').select('*', { count: 'exact', head: true }).eq('is_public', true);
  const { data: snippets, error } = await supabase.from('snippets').select('title, is_public').limit(5);

  console.log('--- Statistics ---');
  console.log(`Total Profiles: ${profileCount}`);
  console.log(`Public Snippets: ${publicSnippetCount}`);
  
  if (error) {
    console.error('❌ API Error:', error.message);
  }

  console.log('--- Sample Data ---');
  if (snippets && snippets.length > 0) {
    snippets.forEach(s => console.log(`- [${s.is_public ? 'PUBLIC' : 'PRIVATE'}] ${s.title}`));
  } else {
    console.log('No snippets found in the sample.');
  }
}

check();
