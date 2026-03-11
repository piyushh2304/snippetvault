'use client'

import { usePublicSnippets } from '@/hooks/use-snippets'
import { Loader2, ArrowRight, Search, Code2, Globe } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { SnippetWithTags } from '@/types'

export default function ExplorePage() {
  const [page, setPage] = useState(0)
  const [accumulatedSnippets, setAccumulatedSnippets] = useState<SnippetWithTags[]>([])
  
  const { data: snippets, isLoading, isFetching, error } = usePublicSnippets(page)

  // Sync incoming snippets with accumulated ones
  useEffect(() => {
    if (snippets && snippets.length > 0) {
      setAccumulatedSnippets(prev => {
        // If it's the first page, just set it
        if (page === 0) return snippets;
        
        // Only append snippets that aren't already in the list
        const existingIds = new Set(prev.map(s => s.id));
        const newSnippets = snippets.filter(s => !existingIds.has(s.id));
        
        if (newSnippets.length === 0) return prev;
        return [...prev, ...newSnippets];
      });
    }
  }, [snippets, page]);

  const [search, setSearch] = useState('')

  const filteredSnippets = accumulatedSnippets.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.language.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  )

  // Only show full screen loader for the very first load
  if (isLoading && page === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-t-2 border-r-2 border-[#1337ec] animate-spin" />
            <Globe className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#1337ec] animate-pulse" />
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Accessing the Vault...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-12 lg:p-20 selection:bg-[#1337ec] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-[0.2em]"
            >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span>Global Discovery</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none"
            >
              Explore <br />
              <span className="bg-gradient-to-r from-blue-500 via-[#1337ec] to-violet-500 bg-clip-text text-transparent">Public Cloud</span>
            </motion.h1>
            <p className="text-slate-500 text-xl max-w-xl font-medium leading-relaxed italic">
              "The shared wisdom of a thousand developers, decrypted just for you."
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#1337ec] transition-colors" />
            <input 
              type="text" 
              placeholder="Filter current view..."
              className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-950 border border-slate-800/50 focus:border-[#1337ec] outline-none transition-all placeholder:text-slate-600 font-bold text-sm tracking-wide"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Snippet Grid */}
        <AnimatePresence mode="popLayout">
          {error ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="py-32 text-center rounded-[3rem] border-2 border-red-500/20 bg-red-500/5"
              >
                <p className="text-red-400 font-black uppercase tracking-widest text-sm mb-2">Connection Error</p>
                <p className="text-slate-500">The vault is currently unreachable. Please try again later.</p>
              </motion.div>
          ) : filteredSnippets.length === 0 && !isLoading ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 text-center rounded-[3rem] border border-dashed border-slate-800/50 bg-slate-900/5 backdrop-blur-xl"
            >
              <Code2 className="w-16 h-16 text-[#1337ec]/20 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Vault is Empty</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">No public snippets found. Be the first to share your wisdom with the world!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSnippets.map((snippet: SnippetWithTags, idx) => (
                <motion.div
                  layout
                  key={snippet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (idx % 10) * 0.05 }}
                >
                  <Link href={`/s/${snippet.id}`} className="group block h-full">
                    <div className="h-full p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/60 hover:border-[#1337ec]/40 hover:bg-[#1337ec]/5 transition-all duration-500 flex flex-col justify-between gap-10 relative overflow-hidden">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <Badge className="bg-[#1337ec] text-white border-none px-4 py-1.5 rounded-full uppercase tracking-tighter font-black text-[10px]">
                            {snippet.language}
                          </Badge>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             Online
                          </div>
                        </div>
                        
                        <h3 className="text-3xl font-black text-white group-hover:text-[#1337ec] transition-colors leading-[1.1] uppercase tracking-tighter line-clamp-2">
                          {snippet.title}
                        </h3>
                        
                        <p className="text-slate-500 text-sm line-clamp-3 font-medium leading-relaxed italic">
                          {snippet.description || 'Accessing encrypted profile description...'}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-slate-800/40 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1337ec] to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-blue-500/20">
                             {snippet.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="text-xs font-black text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-[0.15em]">
                            @{snippet.profiles?.username || 'anonymous'}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center group-hover:bg-[#1337ec] transition-all transform group-hover:rotate-[-45deg]">
                            <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Load More */}
        {snippets && snippets.length === 10 && !search && (
          <div className="flex flex-col items-center gap-6 pt-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage(p => p + 1)}
              className="relative px-12 py-5 rounded-3xl bg-white text-slate-950 font-black uppercase tracking-[0.25em] text-xs hover:bg-[#1337ec] hover:text-white transition-all disabled:opacity-50 shadow-2xl shadow-blue-500/10"
              disabled={isFetching}
            >
              {isFetching ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Decrypting...</span>
                </div>
              ) : 'Load More WISDOM'}
            </motion.button>
            {isFetching && page > 0 && (
                <p className="text-[10px] text-[#1337ec] font-black uppercase tracking-[0.4em] animate-pulse">
                    Next page incoming
                </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
