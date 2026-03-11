-- REQUIRED SEED DATA FOR ASSESSMENT
-- Ensure you have at least one user in auth.users before running this, or replace 'USER_ID' with a valid UUID.

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Try to get the first user ID from the profiles table
    SELECT id INTO target_user_id FROM public.profiles LIMIT 1;

    IF target_user_id IS NULL THEN
        RAISE NOTICE 'No users found in profiles table. Please sign up first or manually set target_user_id.';
    ELSE
        -- Delete existing snippets if you want a fresh start (Optional)
        -- DELETE FROM public.snippets WHERE user_id = target_user_id;

        -- 1. React Hook Snippet (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'UseLocalStorage Hook', 'function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = value => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}', 'javascript', 'A simple hook to sync state with localStorage.', true);

        -- 2. Python Auth Decorator (Private)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Flask Admin Required', 'from functools import wraps
from flask import abort, current_user

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function', 'python', 'Decorator to restrict Flask routes to admins only.', false);

        -- 3. SQL Analytics Query (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'User Retention Query', 'WITH monthly_active AS (
  SELECT date_trunc(''month'', last_login) as active_month, count(id) as users
  FROM profiles
  GROUP BY 1
)
SELECT 
  active_month, 
  users,
  lag(users) OVER (ORDER BY active_month) as prev_month_users
FROM monthly_active;', 'sql', 'Calculate monthly active users and retention.', true);

        -- 4. TypeScript Interface (Private)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'API Response Types', 'export interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  error?: {
    code: string;
    message: string;
  };
}', 'typescript', 'Standardized interface for backend API responses.', false);

        -- 5. CSS Glassmorphism (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Glassmorphism Card', '.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}', 'css', 'Modern glassy UI card styles.', true);

        -- 6. Go Http Middleware (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Logging Middleware', 'func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}', 'go', 'Simple request logger for Go web servers.', true);

        -- 7. Bash Script (Private)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'DB Backup Script', '#!/bin/bash
DATE=$(date +%Y-%m-%d)
pg_dump -U postgres snippet_vault > "backup_$DATE.sql"
gzip "backup_$DATE.sql"
aws s3 cp "backup_$DATE.sql.gz" s3://my-backups/', 'bash', 'Nightly database backup to S3.', false);

        -- 8. Tailwind Config (Public)
        INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
        VALUES (target_user_id, 'Brand Theme Config', 'module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#1337ec",
        secondary: "#101322",
        accent: "#3b82f6"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    }
  }
}', 'javascript', 'Tailwind configuration for the design system.', true);

        RAISE NOTICE '8 snippets successfully seeded for user %', target_user_id;
    END IF;
END $$;
