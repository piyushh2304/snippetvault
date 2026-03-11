import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Snippet, SnippetWithTags } from '@/types';

export function useSnippets() {
  return useQuery<SnippetWithTags[]>({
    queryKey: ['snippets'],
    queryFn: api.getMySnippets,
    staleTime: 60 * 1000,
  });
}

export function usePublicSnippets(page: number = 0) {
  return useQuery<SnippetWithTags[]>({
    queryKey: ['public-snippets', page],
    queryFn: () => api.getPublicSnippets(page),
    staleTime: 5 * 60 * 1000, // Public snippets can be cached longer
  });
}

export function useSnippet(id: string | null) {
  const queryClient = useQueryClient();
  return useQuery<SnippetWithTags | null>({
    queryKey: ['snippet', id],
    queryFn: () => (id ? api.getSnippet(id) : Promise.resolve(null)),
    enabled: !!id,
    initialData: () => {
      // Pull from the snippets list cache if available
      return queryClient
        .getQueryData<SnippetWithTags[]>(['snippets'])
        ?.find((s) => s.id === id);
    },
    initialDataUpdatedAt: () => 
      queryClient.getQueryState(['snippets'])?.dataUpdatedAt,
  });
}

export function usePublicProfile(identifier: string) {
  return useQuery({
    queryKey: ['public-profile', identifier],
    queryFn: () => api.getPublicProfile(identifier),
    staleTime: 60 * 1000,
  });
}

export function useCreateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSnippet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      toast.success('Snippet created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create snippet');
      console.error(error);
    },
  });
}

export function useUpdateSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Snippet> & { tags?: string[] } }) => 
      api.updateSnippet(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['snippet', variables.id] });
      toast.success('Snippet updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update snippet');
      console.error(error);
    },
  });
}

export function useDeleteSnippet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteSnippet,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['snippets'] });
      const previousSnippets = queryClient.getQueryData<SnippetWithTags[]>(['snippets']);
      
      if (previousSnippets) {
        queryClient.setQueryData<SnippetWithTags[]>(
          ['snippets'],
          previousSnippets.filter((s) => s.id !== id)
        );
      }
      
      return { previousSnippets };
    },
    onError: (err, id, context) => {
      if (context?.previousSnippets) {
        queryClient.setQueryData(['snippets'], context.previousSnippets);
      }
      toast.error('Failed to delete snippet. Rolling back.');
    },
    onSuccess: () => {
      toast.success('Snippet deleted');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
  });
}

export function useShares(snippetId: string | null) {
  return useQuery({
    queryKey: ['shares', snippetId],
    queryFn: () => (snippetId ? api.getShares(snippetId) : Promise.resolve([])),
    enabled: !!snippetId,
  });
}

export function useAddShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ snippetId, email }: { snippetId: string; email: string }) => 
      api.addShare(snippetId, email),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shares', variables.snippetId] });
      toast.success('Snippet shared successfully');
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || 'Failed to share snippet');
    },
  });
}

export function useRemoveShare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.removeShare,
    onSuccess: () => {
      // We don't have snippetId in removeShare response easily?
      // Re-invalidate all shares for safety or passed in
      queryClient.invalidateQueries({ queryKey: ['shares'] });
      toast.success('Share removed');
    },
  });
}
