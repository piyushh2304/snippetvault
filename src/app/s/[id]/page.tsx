'use client'

import { useParams } from 'next/navigation'
import { useSnippet } from '@/hooks/use-snippets'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Loader2, Copy, Globe, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function PublicSnippetPage() {
  const { id } = useParams()
  const { data: snippet, isLoading, error } = useSnippet(id as string)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#1337ec]" />
      </div>
    )
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <Globe className="w-10 h-10 text-red-500 opacity-50" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Snippet Not Found</h1>
        <p className="text-slate-400 max-w-md">The snippet you're looking for doesn't exist or is private.</p>
        <Button 
          variant="outline" 
          className="mt-8 border-slate-800 text-slate-400 hover:text-white"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 md:p-12 lg:p-20">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-[#1337ec]/10 text-[#1337ec] border-[#1337ec]/20 px-3 py-1 rounded-lg uppercase tracking-wider font-bold">
                {snippet.language}
              </Badge>
              <Link 
                href={`/u/${snippet.profiles?.username || snippet.user_id}`}
                className="flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-[#1337ec] transition-colors"
              >
                <User className="w-4 h-4" />
                <span>@{snippet.profiles?.username || 'user'}</span>
              </Link>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight uppercase">
              {snippet.title}
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed max-w-3xl">
              {snippet.description || 'No description provided for this snippet.'}
            </p>
          </div>
          <Button 
            className="h-14 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white rounded-2xl px-10 font-bold text-lg shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.05]"
            onClick={() => {
              navigator.clipboard.writeText(snippet.code)
              toast.success('Code copied!')
            }}
          >
            <Copy className="w-5 h-5 mr-3" />
            Copy Full Code
          </Button>
        </div>

        {/* Code Block */}
        <div className="rounded-3xl border border-slate-800/60 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] bg-[#010409]">
           <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800/50 bg-slate-900/10">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
              </div>
              <div className="text-xs font-bold text-slate-600 tracking-[0.2em] uppercase font-mono">
                {snippet.title.toLowerCase().replace(/\s+/g, '-')}.{snippet.language}
              </div>
              <div className="w-12" />
           </div>
           <SyntaxHighlighter 
            language={snippet.language.toLowerCase()} 
            style={atomDark}
            customStyle={{ 
              margin: 0, 
              padding: '3rem', 
              fontSize: '1rem',
              lineHeight: '1.8',
              background: 'transparent',
              overflowX: 'auto'
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>

        {/* Author Footer */}
        <div className="pt-12 border-t border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1337ec] flex items-center justify-center text-white font-black text-xl">V</div>
                <div>
                    <h3 className="font-bold text-white uppercase tracking-wider">SnippetVault</h3>
                    <p className="text-slate-500 text-xs">Premium Code Storage</p>
                </div>
            </div>
            <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                Protected by RLS Encryption
            </div>
        </div>
      </div>
    </div>
  )
}
