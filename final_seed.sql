-- 1. Ensure at least one profile exists for the seed data
INSERT INTO public.profiles (id, username, display_name, email)
SELECT 
  '984cc078-cda6-40f1-b559-ff72f1b6776d', -- The user's ID from their log
  'vault_pioneer',
  'Vault Pioneer',
  'pioneer@example.com'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = '984cc078-cda6-40f1-b559-ff72f1b6776d')
ON CONFLICT (id) DO NOTHING;

-- 2. Bulk insert diversified public snippets
INSERT INTO public.snippets (user_id, title, code, language, description, is_public)
VALUES 
('984cc078-cda6-40f1-b559-ff72f1b6776d', 'Retry Decorator', 'import time\nfrom functools import wraps\n\ndef retry(exceptions, tries=3, delay=1):\n    def decorator(f):\n        @wraps(f)\n        def wrapper(*args, **kwargs):\n            _tries, _delay = tries, delay\n            while _tries > 1:\n                try:\n                    return f(*args, **kwargs)\n                except exceptions as e:\n                    time.sleep(_delay)\n                    _tries -= 1\n            return f(*args, **kwargs)\n        return wrapper\n    return decorator', 'python', 'Retries a function call if specific exceptions occur.', true),
('984cc078-cda6-40f1-b559-ff72f1b6776d', 'Modern CSS Reset', '*, *::before, *::after { box-sizing: border-box; }\nbody { min-height: 100vh; text-rendering: optimizeSpeed; line-height: 1.5; margin: 0; }', 'css', 'A modern CSS reset for consistent cross-browser styling.', true),
('984cc078-cda6-40f1-b559-ff72f1b6776d', 'Deep Partial Type', 'type DeepPartial<T> = T extends object ? {\n    [P in keyof T]?: DeepPartial<T[P]>;\n} : T;', 'typescript', 'A recursive Partial type for nested objects.', true),
('984cc078-cda6-40f1-b559-ff72f1b6776d', 'Weekly Growth Query', 'SELECT DATE_TRUNC(''week'', created_at) AS week, COUNT(id) FROM profiles GROUP BY 1 ORDER BY 1 DESC;', 'sql', 'Analyzes weekly user growth trends.', true),
('984cc078-cda6-40f1-b559-ff72f1b6776d', 'JSON Response Helper', 'func RespondWithJSON(w http.ResponseWriter, code int, payload interface{}) {\n    response, _ := json.Marshal(payload)\n    w.Header().Set("Content-Type", "application/json")\n    w.WriteHeader(code)\n    w.Write(response)\n}', 'go', 'Standardized JSON response helper for Go APIs.', true),
('984cc078-cda6-40f1-b559-ff72f1b6776d', 'Flatten Nested List', 'def flatten(nested_list):\n    return [item for sublist in nested_list for item in sublist]', 'python', 'One-liner to flatten a 2D list into 1D.', true),
('984cc078-cda6-40f1-b559-ff72f1b6776d', 'Responsive Auto-Grid', '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 2rem;\n}', 'css', 'A responsive grid that wraps without media queries.', true);
