import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-center px-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <FileQuestion className="w-12 h-12 text-blue-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          404 - Snippet Not Found
        </h2>
        <p className="text-slate-400 max-w-md mx-auto">
          The code you're looking for might have been deleted, marked as private, or simply never existed.
        </p>
      </div>
      <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
