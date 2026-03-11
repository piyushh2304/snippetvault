export interface Profile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  user_id?: string;
}

export interface Snippet {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  is_public: boolean;
}

export interface SnippetWithTags extends Snippet {
  profiles?: Profile;
  snippet_tags?: { tags: Tag }[];
}
