'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, LayoutDashboard, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
          setProfile(data)
        })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => {
          setProfile(data)
        })
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-xl bg-[#1337ec] flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
            >
              S
            </motion.div>
            <span className="font-black text-xl tracking-tighter text-white uppercase group-hover:tracking-normal transition-all">Vault</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="hidden md:flex bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest px-4 h-9">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Button>
                </motion.div>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 p-0 overflow-hidden hover:scale-105 transition-all outline-none">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1337ec] to-blue-600 text-[10px] font-black text-white focus:outline-none">
                      {profile?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-950/90 backdrop-blur-xl border-slate-800 mt-2 p-2 rounded-2xl shadow-2xl" align="end">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black text-white uppercase tracking-tight">{profile?.display_name || 'Coder'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem className="p-3 text-slate-400 focus:text-white focus:bg-[#1337ec]/10 rounded-xl transition-all cursor-pointer group" onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4 group-hover:text-[#1337ec]" />
                    <span className="font-bold text-xs uppercase tracking-widest">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 text-slate-400 focus:text-white focus:bg-[#1337ec]/10 rounded-xl transition-all cursor-pointer group" onClick={() => router.push(`/u/${profile?.username || user?.id}`)}>
                    <Globe className="mr-2 h-4 w-4 group-hover:text-[#1337ec]" />
                    <span className="font-bold text-xs uppercase tracking-widest">Public Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem className="p-3 text-red-400 focus:text-red-400 focus:bg-red-400/10 rounded-xl transition-all cursor-pointer font-bold text-xs uppercase tracking-widest" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <Link href="/login">
                  <Button variant="ghost" className="h-10 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest">Login</Button>
               </Link>
               <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="h-10 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white rounded-xl px-6 font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/10">Sign Up</Button>
                  </motion.div>
               </Link>
            </div>
          )}
        </motion.div>
      </div>
    </nav>
  )
}
