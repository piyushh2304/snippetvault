-- ADDITIONAL PUBLIC SNIPPETS SEED DATA
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM public.profiles LIMIT 1;

    IF target_user_id IS NOT NULL THEN
        -- 1. Python Decorator (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Retry Decorator', 'import time
from functools import wraps

def retry(exceptions, tries=3, delay=1):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            _tries, _delay = tries, delay
            while _tries > 1:
                try:
                    return f(*args, **kwargs)
                except exceptions as e:
                    time.sleep(_delay)
                    _tries -= 1
            return f(*args, **kwargs)
        return wrapper
    return decorator', 'python', 'Retries a function call if specific exceptions occur.', true);

        -- 2. TypeScript Utility (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Deep Partial Type', 'type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;', 'typescript', 'A recursive Partial type for nested objects.', true);

        -- 3. CSS Modern Reset (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Modern CSS Reset', '/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}', 'css', 'A modern CSS reset for consistent cross-browser styling.', true);

        -- 4. JavaScript Debounce (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Debounce Function', 'function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}', 'javascript', 'Limits the rate at which a function can fire.', true);

        -- 5. SQL Weekly Report (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Weekly Growth Query', 'SELECT 
    DATE_TRUNC(''week'', created_at) AS week,
    COUNT(id) AS new_users,
    COUNT(id) - LAG(COUNT(id)) OVER (ORDER BY DATE_TRUNC(''week'', created_at)) AS growth
FROM profiles
GROUP BY 1
ORDER BY 1 DESC;', 'sql', 'Analyzes weekly user growth trends.', true);

        -- 6. Go JSON Helper (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'JSON Response Helper', 'func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
    response, _ := json.Marshal(payload)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(code)
    w.Write(response)
}', 'go', 'Standardized JSON response helper for Go APIs.', true);

        -- 7. Python List Flatten (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Flatten Nested List', 'def flatten(nested_list):
    return [item for sublist in nested_list for item in sublist]', 'python', 'One-liner to flatten a 2D list into 1D.', true);

        -- 8. TypeScript Fetch Hook (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'useFetch Hook', 'function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}', 'typescript', 'Generic data fetching hook for React applications.', true);

        -- 9. CSS Grid Layout (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Responsive Auto-Grid', '.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}', 'css', 'A responsive grid that wraps without media queries.', true);

        -- 10. Bash Permission Fix (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Fix Web Permissions', '#!/bin/bash
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chown -R www-data:www-data .', 'bash', 'Ensures correct permissions for a web root.', true);

        -- 11. Rust Hello World (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Rust HTTP Hello', 'use warp::Filter;

#[tokio::main]
async fn main() {
    let hello = warp::path!("hello" / String)
        .map(|name| format!("Hello, {}!", name));

    warp::serve(hello)
        .run(([127, 0, 0, 1], 3030))
        .await;
}', 'rust', 'Basic web server in Rust using Warp.', true);

        -- 12. SQL Index Check (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Find Missing Indexes', 'SELECT
    relname,
    seq_scan - idx_scan AS too_much_seq,
    CASE WHEN seq_scan - idx_scan > 0 THEN ''Missing Index?'' ELSE ''OK'' END AS status
FROM pg_stat_all_tables
WHERE schemaname = ''public'' AND pg_relation_size(relname::regclass) > 1000000
ORDER BY too_much_seq DESC;', 'sql', 'Identifies tables that might need indexing based on scan patterns.', true);

    END IF;
END $$;
