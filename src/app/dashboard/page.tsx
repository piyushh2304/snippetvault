'use client'
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useSnippets } from '@/hooks/use-snippets';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Code2, Clock, ArrowRight, Plus, Search, Tag, Globe, Lock } from 'lucide-react';
import { SnippetDetails } from '@/components/dashboard/snippet-details';
import { SnippetForm } from '@/components/dashboard/snippet-form';
import { useSnippetStore } from '@/store/use-snippet-store';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDeferredValue, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as any }
  },
  hover: {
    y: -5,
    transition: { duration: 0.2, ease: "easeInOut" as any }
  }
};

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { setActiveSnippetId, searchQuery, setSearchQuery, selectedTags, setSelectedTags } = useSnippetStore();
  const deferredSearch = useDeferredValue(searchQuery);

  const { data: snippets, isLoading, error, refetch } = useSnippets();

  // Filter snippets based on deferred search query for better performance
  const filteredSnippets = useMemo(() => {
    if (!snippets) return null;
    return snippets.filter(s => {
      const matchesSearch = 
        s.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        s.description?.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        s.language.toLowerCase().includes(deferredSearch.toLowerCase());
      
      const snippetTagNames = s.snippet_tags?.map(st => st.tags.name) || [];
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => snippetTagNames.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [snippets, deferredSearch, selectedTags]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    snippets?.forEach(s => s.snippet_tags?.forEach(st => tags.add(st.tags.name)));
    return Array.from(tags);
  }, [snippets]);

  // Calculate language statistics
  const stats = useMemo(() => {
    return snippets?.reduce((acc: Record<string, number>, s) => {
      acc[s.language] = (acc[s.language] || 0) + 1;
      return acc;
    }, {});
  }, [snippets]);

  if (isLoading) {
    return (
      <div className="space-y-8 px-4 md:px-0">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-slate-900 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-slate-900 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-900 rounded-xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-red-500 opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Vault Access Error</h2>
        <p className="text-slate-400 max-w-md">We couldn't retrieve your snippets. Please check your connection or try logging in again.</p>
        <div className="flex gap-4 mt-8">
            <Button variant="outline" className="border-slate-800 text-slate-400 hover:text-white" onClick={() => refetch()}>
                Retry Connection
            </Button>
            <Button className="bg-[#1337ec] text-white" onClick={() => window.location.href = '/login'}>
                Login Again
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-0 pb-12">
      {/* Header & Actions */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white px-1">
            Your Vault
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Manage and access your private code collection.</p>
          
          {/* Tag Chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                className={`h-8 rounded-full border px-4 text-[11px] font-bold uppercase tracking-widest transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-[#1337ec] border-[#1337ec] text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                <Tag className="w-3 h-3 mr-2" />
                {tag}
              </Button>
            ))}
            {selectedTags.length > 0 && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setSelectedTags([])}
                className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-[#1337ec] transition-colors" />
            <Input 
              placeholder="Search snippets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-slate-900/50 border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-xl text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="h-12 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white shadow-lg shadow-blue-500/20 whitespace-nowrap rounded-xl px-6 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="w-5 h-5 mr-2" />
                New Snippet
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-5xl bg-slate-950 border-slate-800 text-slate-100 overflow-y-auto p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Create New Snippet</SheetTitle>
              </SheetHeader>
              <SnippetForm onSuccess={() => setIsFormOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>

      {/* Snippet Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredSnippets?.map((snippet) => (
            <motion.div
              layout
              key={snippet.id}
              variants={cardVariants}
              whileHover="hover"
            >
              <Card 
                onClick={() => setActiveSnippetId(snippet.id)}
                className="bg-slate-900/40 border-slate-800/60 hover:border-[#1337ec]/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer group flex flex-col relative overflow-hidden rounded-2xl h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1337ec]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="p-6 relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 rounded-xl bg-slate-800/50 text-[#1337ec] group-hover:bg-[#1337ec]/10 transition-all border border-slate-700/50 group-hover:border-[#1337ec]/20">
                      <Code2 className="w-5.5 h-5.5" />
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50 backdrop-blur-md">
                      {snippet.language}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mt-5 tracking-tight group-hover:text-white transition-colors line-clamp-1">
                    {snippet.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6 pt-0 flex-1 relative z-10">
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {snippet.description || 'Securely saved code snippet with no description.'}
                  </p>
                </CardContent>
                
                <CardFooter className="p-6 pt-4 border-t border-slate-800/40 bg-slate-900/20 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <Clock className="w-4 h-4" />
                      {new Date(snippet.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {snippet.is_public ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                          <Globe className="w-3 h-3" />
                          Public
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-500/5 px-2 py-0.5 rounded-md border border-slate-500/10">
                          <Lock className="w-3 h-3" />
                          Private
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1337ec] text-xs font-bold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    View
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredSnippets?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/50"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 text-slate-700 border border-slate-800 shadow-inner">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200">No snippets found</h3>
            <p className="text-slate-500 mt-2 max-w-xs text-center border-b border-slate-800 pb-6 mb-6">
              {searchQuery ? `We couldn't find any snippets matching "${searchQuery}"` : "Your vault is empty. Start by creating a new snippet."}
            </p>
            <Button 
              variant="outline" 
              onClick={() => searchQuery ? setSearchQuery('') : setIsFormOpen(true)}
              className="border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white transition-all px-8 py-6 rounded-xl"
            >
              {searchQuery ? 'Clear Search' : 'Create First Snippet'}
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Global Modals/Panels */}
      <SnippetDetails />
    </div>
  );
}
