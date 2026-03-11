'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCreateSnippet, useUpdateSnippet } from '@/hooks/use-snippets';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Save, X, Plus, Globe, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { SnippetWithTags } from '@/types';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  description: z.string().default(''),
  is_public: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

interface FormValues {
  title: string;
  code: string;
  language: string;
  description: string;
  is_public: boolean;
  tags: string[];
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'sql', label: 'SQL' },
  { value: 'markdown', label: 'Markdown' },
];

export function SnippetForm({ snippet, onSuccess }: { snippet?: SnippetWithTags; onSuccess?: () => void }) {
  const [tagInput, setTagInput] = useState('');
  const createMutation = useCreateSnippet();
  const updateMutation = useUpdateSnippet();
  
  const isEditing = !!snippet;
  const mutation = isEditing ? updateMutation : createMutation;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: { 
      title: snippet?.title || '', 
      code: snippet?.code || '', 
      language: snippet?.language || 'javascript', 
      description: snippet?.description || '', 
      is_public: snippet?.is_public || false,
      tags: snippet?.snippet_tags?.map(st => st.tags.name) || [] 
    },
  });

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = form.getValues('tags');
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(t => t !== tagToRemove));
  };

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updateMutation.mutate({ id: snippet.id, data }, {
        onSuccess: () => {
          onSuccess?.();
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
          form.reset();
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 md:p-10 overflow-x-hidden">
        {/* Title Section from Template */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-2 text-[#1337ec]">
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Editor</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
            {isEditing ? 'Edit Snippet' : 'Create New Snippet'}
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            {isEditing ? 'Update your saved logic.' : 'Share your logic with the world or keep it private.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            name="title" 
            control={form.control} 
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Title <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Binary Search in Go" className="h-12 bg-slate-900/50 border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-xl text-slate-100 placeholder:text-slate-600 transition-all font-sans" />
                </FormControl>
                <FormMessage className="ml-1 text-red-400/80 text-[10px]" />
              </FormItem>
            )} 
          />
          <FormField 
            name="language" 
            control={form.control} 
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1.5">
                <FormLabel className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Language <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-slate-900/50 border-slate-800 focus:ring-[#1337ec]/50 rounded-xl text-slate-200 transition-all font-sans">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-xl">
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="focus:bg-[#1337ec]/10 focus:text-white rounded-lg cursor-pointer">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="ml-1 text-red-400/80 text-[10px]" />
              </FormItem>
            )} 
          />
        </div>

        <FormField 
          name="description" 
          control={form.control} 
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1.5">
              <FormLabel className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Description (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Describe what this snippet does..." className="h-12 bg-slate-900/50 border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all font-sans" />
              </FormControl>
              <FormMessage className="ml-1 text-red-400/80 text-[10px]" />
            </FormItem>
          )} 
        />

        <FormField 
          name="code" 
          control={form.control} 
          render={({ field }: { field: any }) => (
            <FormItem className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <FormLabel className="text-xs font-bold text-slate-300 uppercase tracking-wider">Code Block <span className="text-red-500">*</span></FormLabel>
                <span className="text-[9px] uppercase font-black text-slate-600 tracking-widest">Markdown Supported</span>
              </div>
              <FormControl>
                <div className="relative group">
                  <Textarea {...field} placeholder="Paste your code here..." className="font-mono h-72 bg-[#010409] border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-2xl text-slate-200 placeholder:text-slate-700 p-6 leading-relaxed text-sm scrollbar-thin scrollbar-thumb-slate-800 transition-all" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-8 w-8 bg-slate-800 hover:bg-[#1337ec] text-slate-300 hover:text-white rounded-lg" type="button" onClick={() => {
                        navigator.clipboard.writeText(field.value)
                        toast.success('Code copied')
                    }}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="ml-1 text-red-400/80 text-[10px]" />
            </FormItem>
          )} 
        />

        {/* Tags Section from Template */}
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Tags</Label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-800 bg-slate-900/50 min-h-[56px] focus-within:border-[#1337ec]/40 transition-all">
            {form.watch('tags').map((tag) => (
              <Badge key={tag} className="bg-[#1337ec]/15 hover:bg-[#1337ec]/25 text-[#1337ec] border-[#1337ec]/30 rounded-lg px-3 py-1 flex items-center gap-1.5 text-[11px] font-bold">
                {tag}
                <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeTag(tag)} />
              </Badge>
            ))}
            <input 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder={form.watch('tags').length === 0 ? "Add tags (press enter)..." : "More..."} 
              className="bg-transparent border-none focus:ring-0 text-sm text-slate-200 placeholder:text-slate-700 p-0 flex-1 min-w-[120px] outline-none" 
            />
          </div>
          <p className="text-[10px] text-slate-600 px-1 font-medium italic">Press Enter to register a tag</p>
        </div>

        <FormField 
          name="is_public" 
          control={form.control} 
          render={({ field }: { field: any }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-800/60 p-5 bg-[#1337ec]/5 backdrop-blur-sm transition-all hover:bg-[#1337ec]/10">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-[#1337ec]" />
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-bold text-white leading-none">Public Snippet</FormLabel>
                  <FormDescription className="text-slate-500 text-[11px] font-medium leading-tight">
                    Anyone can search and view this shared logic.
                  </FormDescription>
                </div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-[#1337ec]" />
              </FormControl>
            </FormItem>
          )} 
        />

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800/50">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => onSuccess?.()}
            className="px-6 h-12 text-slate-400 font-bold rounded-xl hover:bg-slate-900 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="px-8 h-12 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white rounded-xl shadow-xl shadow-blue-500/10 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {mutation.isPending ? 'Saving...' : 'Save Snippet'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
