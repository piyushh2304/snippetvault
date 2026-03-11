import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useSnippetStore } from '@/store/use-snippet-store'
import { Trash2, Loader2, Copy, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SharePopover } from './share-popover'
import { useSnippet, useDeleteSnippet } from '@/hooks/use-snippets'
import { useState } from 'react'
import { SnippetForm } from './snippet-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion } from 'framer-motion'

export function SnippetDetails() {
  const { activeSnippetId, setActiveSnippetId } = useSnippetStore()
  const { data: snippet, isLoading } = useSnippet(activeSnippetId)
  const deleteMutation = useDeleteSnippet()
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = () => {
    if (snippet) {
      deleteMutation.mutate(snippet.id, {
        onSuccess: () => setActiveSnippetId(null)
      })
    }
  }

  if (!activeSnippetId) return null

  if (activeSnippetId && isLoading) {
    return (
      <Sheet open={!!activeSnippetId} onOpenChange={() => setActiveSnippetId(null)}>
        <SheetContent className="w-full sm:max-w-[90vw] xl:max-w-[1200px] overflow-y-auto bg-slate-950 border-slate-800/50 text-slate-100 p-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1337ec]" />
        </SheetContent>
      </Sheet>
    )
  }

  if (isEditing && snippet) {
    return (
      <Sheet open={!!activeSnippetId} onOpenChange={() => {
        setIsEditing(false)
        setActiveSnippetId(null)
      }}>
        <SheetContent className="w-full sm:max-w-5xl bg-slate-950 border-slate-800 text-slate-100 overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Edit Snippet</SheetTitle>
          </SheetHeader>
          <SnippetForm snippet={snippet} onSuccess={() => setIsEditing(false)} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={!!activeSnippetId} onOpenChange={() => setActiveSnippetId(null)}>
      <SheetContent className="w-full sm:max-w-[90vw] xl:max-w-[1200px] overflow-y-auto bg-slate-950 border-slate-800/50 text-slate-100 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{snippet?.title || 'Snippet Details'}</SheetTitle>
        </SheetHeader>
        {snippet && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col min-h-full"
          >
            <div className="p-6 md:p-10 space-y-8 flex-1">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-[#1337ec]/10 text-[#1337ec] text-[11px] font-bold uppercase tracking-wider border border-[#1337ec]/20">
                    {snippet.language}
                  </div>
                  <div className="text-slate-500 text-xs font-medium">
                    Created {new Date(snippet.created_at).toLocaleDateString()}
                  </div>
                  {snippet.is_public && (
                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase border border-emerald-500/20">
                      Public
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <SheetTitle className="text-4xl font-black tracking-tight text-white leading-tight uppercase">
                    {snippet.title}
                  </SheetTitle>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                    {snippet.description || 'No description provided for this snippet.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-11 bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl px-5 flex items-center gap-2 font-bold transition-all hover:scale-[1.02]"
                    onClick={() => {
                      navigator.clipboard.writeText(snippet.code)
                      toast.success('Code copied to clipboard')
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    Copy Code
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-11 bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl px-5 flex items-center gap-2 font-bold transition-all hover:scale-[1.02]"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                  <SharePopover snippet={snippet} />
                  <div className="flex-1" />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-11 w-11 text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all rounded-xl border border-transparent hover:border-red-400/20"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          This will permanently delete "{snippet.title}" and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 text-white border-none"
                        >
                          Delete Snippet
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </SheetHeader>
              
              <div className="rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl bg-[#010409] scrollbar-thin scrollbar-thumb-slate-800">
                {/* Editor Chrome Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/50 bg-slate-900/10">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono">
                    {snippet.title.toLowerCase().replace(/\s+/g, '-')}.{snippet.language === 'javascript' ? 'js' : snippet.language === 'typescript' ? 'ts' : snippet.language === 'python' ? 'py' : snippet.language}
                  </div>
                  <div className="w-12 h-2.5" /> {/* Spacer to center the title better */}
                </div>
                 <SyntaxHighlighter 
                  language={snippet.language.toLowerCase()} 
                  style={atomDark}
                  customStyle={{ 
                    margin: 0, 
                    padding: '2.5rem', 
                    fontSize: '0.975rem',
                    lineHeight: '1.7',
                    background: 'transparent',
                    overflowX: 'auto'
                  }}
                  codeTagProps={{
                    style: { fontFamily: 'inherit' }
                  }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>

              {snippet.snippet_tags && snippet.snippet_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {snippet.snippet_tags.map((st) => (
                    <div key={st.tags.id} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
                      #{st.tags.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  )
}
