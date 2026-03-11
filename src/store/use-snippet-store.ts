import { create } from 'zustand'

interface SnippetState {
    searchQuery: string
    selectedTags: string[]
    activeSnippetId: string | null
    setSearchQuery: (query: string) => void
    setSelectedTags: (tags: string[]) => void
    setActiveSnippetId: (id: string | null) => void
}

export const useSnippetStore = create<SnippetState>((set) => ({
    searchQuery: '',
    selectedTags: [],
    activeSnippetId: null,
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSelectedTags: (selectedTags) => set({ selectedTags }),
    setActiveSnippetId: (activeSnippetId) => set({ activeSnippetId }),
}))
