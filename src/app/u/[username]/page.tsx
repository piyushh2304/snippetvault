'use client'

import { useParams } from 'next/navigation'
import { usePublicProfile } from '@/hooks/use-snippets'
import { Loader2, Globe, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function PublicProfilePage() {
  const { username: identifier } = useParams()
  const { data, isLoading, error } = usePublicProfile(identifier as string)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#1337ec]" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Profile Not Found</h1>
        <p className="text-slate-400">The user @{identifier} hasn't been found.</p>
      </div>
    )
  }

  const { profile, snippets } = data
  const displayName = profile.display_name || profile.username || 'Coder'

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-[#1337ec] to-blue-600 flex items-center justify-center text-white font-black text-5xl md:text-6xl shadow-2xl shadow-blue-500/20">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase">
              {displayName}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-2xl font-black text-[#1337ec]">{snippets.length}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Public Snippets</span>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Validated Profile</span>
               </div>
            </div>
          </div>
        </div>

        {/* Snippet Grid */}
        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Collections</h2>
              <div className="h-px flex-1 bg-slate-800/50" />
           </div>

           {snippets.length === 0 ? (
             <div className="py-20 text-center rounded-3xl border-2 border-dashed border-slate-800/50">
               <p className="text-slate-500 font-medium">No public snippets yet.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {snippets.map((snippet: any) => (
                  <Link 
                    key={snippet.id} 
                    href={`/s/${snippet.id}`}
                    className="group"
                  >
                    <div className="h-full p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/60 hover:border-[#1337ec]/40 hover:bg-[#1337ec]/5 transition-all duration-300 flex flex-col justify-between gap-6 overflow-hidden relative">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-[#1337ec]/10 text-[#1337ec] border-[#1337ec]/20 px-3 py-1 rounded-lg uppercase tracking-wider font-bold text-[10px]">
                            {snippet.language}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-[#1337ec] transition-colors leading-tight uppercase line-clamp-2">
                          {snippet.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 font-medium">
                          {snippet.description || 'Seamlessly shared logic.'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800/30">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                          {new Date(snippet.created_at).toLocaleDateString()}
                        </span>
                        <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-[#1337ec] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
