'use client'
import { useState, useRef } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Share2, Link2, Image as ImageIcon, Users, Globe } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { toPng } from 'html-to-image'
import { toast } from 'sonner'
import { useShares, useAddShare, useRemoveShare } from '@/hooks/use-snippets'
import { X, Loader2 } from 'lucide-react'

export function SharePopover({ snippet }: { snippet: any }) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)

  const { data: shares, isLoading: loadingShares } = useShares(snippet.id)
  const addShare = useAddShare()
  const removeShare = useRemoveShare()

  // 1. Copy Link to Clipboard
  const copyLink = () => {
    const url = `${window.location.protocol}//${window.location.host}/s/${snippet.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  // 2. Export as Image (Truncate at 50 lines)
  const exportImage = async () => {
    if (!codeRef.current) return
    try {
      setLoading(true)
      const dataUrl = await toPng(codeRef.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${snippet.title}.png`
      link.href = dataUrl
      link.click()
      toast.success('Image exported!')
    } catch (err) {
      toast.error('Failed to export image')
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = () => {
    if (!email.trim()) return
    addShare.mutate({ snippetId: snippet.id, email }, {
      onSuccess: () => setEmail('')
    })
  }

  const truncatedCode = snippet.code.split('\n').length > 50 
    ? snippet.code.split('\n').slice(0, 50).join('\n') + '\n\n... [Truncated for export]'
    : snippet.code;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2 px-4 border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-200 rounded-xl transition-all hover:scale-[1.02]">
          <Share2 className="w-3.5 h-3.5 text-[#1337ec]" /> 
          <span className="font-semibold text-xs uppercase tracking-tight">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] bg-slate-900/90 backdrop-blur-xl border-slate-800/60 p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
        <h4 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#1337ec]" />
          Share Snippet
        </h4>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {snippet.is_public ? (
            <Button 
              variant="ghost" 
              className="flex-col h-auto py-5 gap-2 border border-slate-800/50 bg-slate-950/30 hover:bg-[#1337ec]/10 hover:border-[#1337ec]/30 rounded-xl transition-all group" 
              onClick={copyLink}
            >
              <Link2 className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-400 group-hover:text-blue-400">
                {copied ? 'Link Copied!' : 'Copy Link'}
              </span>
            </Button>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 border border-slate-800/50 bg-slate-950/30 rounded-xl text-center">
              <Globe className="w-6 h-6 text-slate-600 mb-2" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Private</span>
              <p className="text-[9px] text-slate-600 mt-1">Make public to share URL</p>
            </div>
          )}

          <Button 
            variant="ghost" 
            className="flex-col h-auto py-5 gap-2 border border-slate-800/50 bg-slate-950/30 hover:bg-emerald-500/10 hover:border-emerald-500/30 rounded-xl transition-all group" 
            onClick={exportImage} 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-400">
              {loading ? 'Exporting...' : 'Export PNG'}
            </span>
          </Button>
        </div>

        <div className="space-y-4 pt-5 border-t border-slate-800/50">
          <Label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Share via Email</Label>
          <div className="flex gap-2">
             <input 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="developer@example.com" 
               className="flex-1 bg-slate-950/50 border border-slate-800 text-xs px-4 py-2.5 rounded-xl outline-none focus:border-[#1337ec]/50 transition-all placeholder:text-slate-700 text-slate-200" 
             />
             <Button 
               className="bg-[#1337ec] hover:bg-[#1337ec]/90 text-white rounded-xl h-[38px] px-4 font-bold text-xs"
               onClick={handleInvite}
               disabled={addShare.isPending}
             >
               {addShare.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
             </Button>
          </div>

          {shares && shares.length > 0 && (
            <div className="space-y-2 mt-4 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {shares.map((share: any) => (
                <div key={share.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-slate-800/50 group">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-200">{share.profiles?.display_name || share.profiles?.email}</span>
                    <span className="text-[9px] text-slate-500">@{share.profiles?.username || 'user'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-slate-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => removeShare.mutate(share.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
      
      {/* Premium hidden container for image export */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        <div ref={codeRef} className="p-16 bg-[#020617] relative w-[800px]">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50" />
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1337ec] flex items-center justify-center font-bold text-white text-xl shadow-2xl shadow-blue-500/40">S</div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{snippet.title}</h2>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-[#1337ec]/10 text-[#1337ec] text-[9px] font-black uppercase tracking-widest border border-[#1337ec]/20">{snippet.language}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">Generated By</p>
                  <p className="text-[#1337ec] text-xs font-black uppercase tracking-tight">SnippetVault</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800/60 bg-slate-950/90 p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1337ec] to-transparent opacity-50" />
                <pre className="font-mono text-sm text-slate-200 leading-[1.8] whitespace-pre-wrap break-all">
                  {truncatedCode}
                </pre>
              </div>
              <div className="mt-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Globe className="w-4 h-4 text-[#1337ec]" />
                   <span className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase">Private & Secured Storage</span>
                </div>
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                  © {new Date().getFullYear()} SnippetVault
                </div>
              </div>
           </div>
        </div>
      </div>
    </Popover>
  )
}
