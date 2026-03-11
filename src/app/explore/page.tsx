'use client'

import { usePublicSnippets } from '@/hooks/use-snippets'
import { Loader2, ArrowRight, Search, Code2, Globe } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { SnippetWithTags } from '@/types'

export default function ExplorePage() {
  const [page, setPage] = useState(0)
  const [accumulatedSnippets, setAccumulatedSnippets] = useState<SnippetWithTags[]>([])
  
  const { data: snippets, isLoading } = usePublicSnippets(page)

  // Sync incoming snippets with accumulated ones correctly using useEffect
  useEffect(() => {
    if (snippets) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setAccumulatedSnippets(prev => {
        if (page === 0) return snippets
        // Filter out any potential duplicates just in case
        const newSnippets = snippets.filter(s => !prev.find(p => p.id === s.id))
        return [...prev, ...newSnippets]
      })
    }
  }, [snippets, page])

  const [search, setSearch] = useState('')

  const filteredSnippets = accumulatedSnippets.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.language.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading && page === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#1337ec]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-12 lg:p-20">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-[0.2em]">
                <Globe className="w-4 h-4" />
                <span>Global Discovery</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase">
              Explore <br />
              <span className="bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">Public Snippets</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-medium">
              Browse shared wisdom from developers around the world. Secure, fast, and beautiful.
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-[#1337ec] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by title, language..."
              className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-950 border border-slate-800 focus:border-[#1337ec] outline-none transition-all placeholder:text-slate-600 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Snippet Grid */}
        {filteredSnippets.length === 0 && !isLoading ? (
          <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-800/50 bg-slate-900/10">
            <Code2 className="w-16 h-16 text-slate-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2 uppercase">No snippets found</h3>
            <p className="text-slate-500 font-medium">Try searching for something else or browse categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSnippets.map((snippet: SnippetWithTags, idx) => (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (idx % 10) * 0.03 }}
              >
                <Link href={`/s/${snippet.id}`} className="group block h-full">
                  <div className="h-full p-8 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/60 hover:border-[#1337ec]/40 hover:bg-[#1337ec]/5 transition-all duration-500 flex flex-col justify-between gap-8 relative overflow-hidden">
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-[#1337ec]/10 text-[#1337ec] border-[#1337ec]/20 px-3 py-1 rounded-lg uppercase tracking-wider font-bold text-[10px]">
                          {snippet.language}
                        </Badge>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           <span className="w-2 h-2 rounded-full bg-emerald-500" />
                           Public
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-black text-white group-hover:text-[#1337ec] transition-colors leading-tight uppercase line-clamp-2">
                        {snippet.title}
                      </h3>
                      
                      <p className="text-slate-400 text-sm line-clamp-3 font-medium leading-relaxed">
                        {snippet.description || 'Premium code logic shared by a vault user.'}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1337ec] to-blue-600 flex items-center justify-center text-white font-black text-xs">
                           {snippet.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-wider">
                          @{snippet.profiles?.username || 'user'}
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-[#1337ec] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {snippets && snippets.length === 10 && !search && (
          <div className="flex justify-center pt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => p + 1)}
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold uppercase tracking-widest hover:bg-[#1337ec] transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More Shared Wisdom'}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
