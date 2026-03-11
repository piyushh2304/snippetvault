import { createClient } from './supabase/client';
import { Snippet, SnippetWithTags } from '@/types';

const supabase = createClient();

export const api = {
  // Fetch a single snippet with tags
  async getSnippet(id: string) {
    const { data, error } = await supabase
      .from('snippets')
      .select('*, profiles(username, display_name), snippet_tags(tags(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as any; // Cast for now, update types later if needed
  },

  // Fetch all snippets for the logged-in user
  async getMySnippets() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('snippets')
      .select('*, snippet_tags(tags(*))')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SnippetWithTags[];
  },

  // Create a new snippet with tags
  async createSnippet(payload: Partial<Snippet> & { tags?: string[] }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { tags, ...snippetData } = payload;

    // 1. Insert snippet
    const { data: snippet, error: snippetError } = await supabase
      .from('snippets')
      .insert([{ ...snippetData, user_id: session.user.id }])
      .select()
      .single();

    if (snippetError) throw snippetError;

    // 2. Handle Tags (Optimized bulk operation)
    if (tags && tags.length > 0) {
      // 2.1 Get existing tags
      const { data: existingTags } = await supabase
        .from('tags')
        .select('id, name')
        .eq('user_id', session.user.id)
        .in('name', tags);

      const existingTagNames = existingTags?.map((t: any) => t.name) || [];
      const tagsToCreate = tags.filter(name => !existingTagNames.includes(name));

      let allTags = [...(existingTags || [])];

      // 2.2 Create missing tags in bulk
      if (tagsToCreate.length > 0) {
        const { data: newTags } = await supabase
          .from('tags')
          .insert(tagsToCreate.map(name => ({ name, user_id: session.user.id })))
          .select('id, name');
        
        if (newTags) allTags = [...allTags, ...newTags];
      }

      // 2.3 Create junction records in bulk
      if (allTags.length > 0) {
        await supabase
          .from('snippet_tags')
          .insert(allTags.map((t: any) => ({ snippet_id: snippet.id, tag_id: t.id })));
      }
    }

    return snippet as Snippet;
  },

  // Update an existing snippet
  async updateSnippet(id: string, payload: Partial<Snippet> & { tags?: string[] }) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { tags, ...snippetData } = payload;

    // 1. Update snippet
    const { data: snippet, error: snippetError } = await supabase
      .from('snippets')
      .update(snippetData)
      .eq('id', id)
      .select()
      .single();

    if (snippetError) throw snippetError;

    // 2. Update Tags (Optimized bulk operation)
    if (tags !== undefined) {
      // Remove old links
      await supabase.from('snippet_tags').delete().eq('snippet_id', id);

      if (tags.length > 0) {
        // 2.1 Get existing tags
        const { data: existingTags } = await supabase
          .from('tags')
          .select('id, name')
          .eq('user_id', session.user.id)
          .in('name', tags);

        const existingTagNames = existingTags?.map((t: any) => t.name) || [];
        const tagsToCreate = tags.filter(name => !existingTagNames.includes(name));

        let allTags = [...(existingTags || [])];

        // 2.2 Create missing tags in bulk
        if (tagsToCreate.length > 0) {
          const { data: newTags } = await supabase
            .from('tags')
            .insert(tagsToCreate.map(name => ({ name, user_id: session.user.id })))
            .select('id, name');
          
          if (newTags) allTags = [...allTags, ...newTags];
        }

        // 2.3 Create junction records in bulk
        if (allTags.length > 0) {
          await supabase
            .from('snippet_tags')
            .insert(allTags.map((t: any) => ({ snippet_id: id, tag_id: t.id })));
        }
      }
    }

    return snippet as Snippet;
  },

  // Fetch public profile data (profile + snippets)
  async getPublicProfile(identifier: string) {
    const isUuid = identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    
    // Step 1: Fetch Profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq(isUuid ? 'id' : 'username', identifier)
      .single();
    
    if (profileError || !profile) throw new Error('Profile not found');

    // Step 2: Fetch Public Snippets in parallel
    const { data: snippets, error } = await supabase
      .from('snippets')
      .select('*, snippet_tags(tags(*))')
      .eq('user_id', profile.id)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { profile, snippets: snippets as SnippetWithTags[] };
  },

  // Get users a snippet is shared with
  async getShares(snippetId: string) {
    const { data, error } = await supabase
      .from('snippet_shares')
      .select('id, shared_with, profiles(display_name, avatar_url, username)')
      .eq('snippet_id', snippetId);
    
    if (error) throw error;
    return data;
  },

  // Share snippet with a user by email
  async addShare(snippetId: string, email: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    if (user.email === email) {
      throw new Error('You cannot share a snippet with yourself');
    }

    const { data: targetUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError || !targetUser) {
      throw new Error('No account found with that email');
    }

    const { error: shareError } = await supabase
      .from('snippet_shares')
      .insert({ snippet_id: snippetId, shared_with: targetUser.id });

    if (shareError) {
      if (shareError.code === '23505') throw new Error('Already shared with this user');
      throw shareError;
    }
  },

  // Remove a share
  async removeShare(shareId: string) {
    const { error } = await supabase
      .from('snippet_shares')
      .delete()
      .eq('id', shareId);
    
    if (error) throw error;
  },

  // Delete a snippet
  async deleteSnippet(id: string) {
    const { error } = await supabase
      .from('snippets')
      .delete()
      .match({ id });

    if (error) throw error;
  },
};
