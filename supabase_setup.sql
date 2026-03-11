-- 1. PROFILES Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SNIPPETS Table
CREATE TABLE IF NOT EXISTS public.snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE
);

-- 3. TAGS Table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE(name, user_id)
);

-- 4. SNIPPET_TAGS Junction Table
CREATE TABLE IF NOT EXISTS public.snippet_tags (
  snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);

-- 5.     SNIPPET_SHARES Table
CREATE TABLE IF NOT EXISTS public.snippet_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE(snippet_id, shared_with)
);

-- Migration fix: handle existing tables missing the shared_with column
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='snippet_shares' AND column_name='shared_with') THEN
    ALTER TABLE public.snippet_shares ADD COLUMN shared_with UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- --- ACCESS FUNCTIONS (SECURITY DEFINER to break circularity) ---

CREATE OR REPLACE FUNCTION public.is_snippet_owner(snippet_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.snippets
    WHERE id = snippet_id_param AND user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_snippet_public(snippet_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.snippets
    WHERE id = snippet_id_param AND is_public = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- CREATE INDEXES ---
CREATE INDEX IF NOT EXISTS idx_snippets_user_id ON public.snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_is_public ON public.snippets(is_public);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_snippet_id ON public.snippet_tags(snippet_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags(user_id);

-- --- RLS POLICIES ---

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_shares ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, user can update own
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Snippets: 
DROP POLICY IF EXISTS "Snippet read access" ON public.snippets;
CREATE POLICY "Snippet read access" ON public.snippets
  FOR SELECT USING (
    is_public = true 
    OR user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.snippet_shares ss
      WHERE ss.snippet_id = public.snippets.id 
      AND ss.shared_with = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can insert snippets" ON public.snippets;
CREATE POLICY "Owners can insert snippets" ON public.snippets FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Owners can update snippets" ON public.snippets;
CREATE POLICY "Owners can update snippets" ON public.snippets FOR UPDATE USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Owners can delete snippets" ON public.snippets;
CREATE POLICY "Owners can delete snippets" ON public.snippets FOR DELETE USING (user_id = auth.uid());

-- Tags: 
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.tags;
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners manage tags" ON public.tags;
CREATE POLICY "Owners manage tags" ON public.tags FOR ALL USING (user_id = auth.uid());

-- snippet_tags: 
DROP POLICY IF EXISTS "View snippet tags" ON public.snippet_tags;
CREATE POLICY "View snippet tags" ON public.snippet_tags
  FOR SELECT USING (
    is_snippet_public(snippet_id) OR is_snippet_owner(snippet_id, auth.uid())
  );

DROP POLICY IF EXISTS "Manage snippet tags" ON public.snippet_tags;
CREATE POLICY "Manage snippet tags" ON public.snippet_tags
  FOR ALL USING (
    is_snippet_owner(snippet_id, auth.uid())
  );

-- snippet_shares:
DROP POLICY IF EXISTS "Collaborators can view shares" ON public.snippet_shares;
CREATE POLICY "Collaborators can view shares" ON public.snippet_shares
  FOR SELECT USING (
    shared_with = auth.uid()
    OR is_snippet_owner(snippet_id, auth.uid())
  );

DROP POLICY IF EXISTS "Owners manage shares" ON public.snippet_shares;
CREATE POLICY "Owners manage shares" ON public.snippet_shares
  FOR ALL USING (
    is_snippet_owner(snippet_id, auth.uid())
  );

-- --- AUTH TRIGGER ---
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
