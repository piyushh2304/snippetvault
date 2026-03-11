const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀 Starting robust seeding...');

  // 1. Get or create a user
  let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single();

  if (profileError || !profile) {
    console.log('⚠️ No profiles found. Please sign up in the app first, then run this script again.');
    console.log('Or, if you want to create a dummy profile (requires turning off RLS or using service_role), please sign up manually.');
    return;
  }

  const userId = profile.id;
  console.log(`✅ Using profile ID: ${userId}`);

  const snippets = [
    {
      user_id: userId,
      title: 'Retry Decorator',
      language: 'python',
      is_public: true,
      description: 'Retries a function call if specific exceptions occur.',
      code: 'import time\nfrom functools import wraps\n\ndef retry(exceptions, tries=3, delay=1):\n    def decorator(f):\n        @wraps(f)\n        def wrapper(*args, **kwargs):\n            _tries, _delay = tries, delay\n            while _tries > 1:\n                try:\n                    return f(*args, **kwargs)\n                except exceptions as e:\n                    time.sleep(_delay)\n                    _tries -= 1\n            return f(*args, **kwargs)\n        return wrapper\n    return decorator'
    },
    {
      user_id: userId,
      title: 'Modern CSS Reset',
      language: 'css',
      is_public: true,
      description: 'A modern CSS reset for consistent cross-browser styling.',
      code: '*, *::before, *::after { box-sizing: border-box; }\nbody { min-height: 100vh; text-rendering: optimizeSpeed; line-height: 1.5; margin: 0; }'
    },
    {
      user_id: userId,
      title: 'Deep Partial Type',
      language: 'typescript',
      is_public: true,
      description: 'A recursive Partial type for nested objects.',
      code: 'type DeepPartial<T> = T extends object ? {\n    [P in keyof T]?: DeepPartial<T[P]>;\n} : T;'
    }
  ];

  console.log(`📦 Inserting ${snippets.length} snippets...`);
  const { data, error } = await supabase
    .from('snippets')
    .insert(snippets)
    .select();

  if (error) {
    console.error('❌ Error inserting snippets:', error.message);
  } else {
    console.log('✨ Successfully seeded snippets!');
    console.log('🔗 Check it out at: http://localhost:3000/explore');
  }
}

seed();
