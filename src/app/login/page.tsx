"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import {toast} from 'sonner'

import { Suspense } from "react"

function LoginForm() {
    const [email , setEmail] = useState('');
    const [password , setPassword] =useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading ,setLoading] =useState(false);

    const router= useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';
    const supabase = createClient();


    const handleLogin = async(e:React.FormEvent) =>{
        e.preventDefault();
        setLoading(true);

         const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if(error){
        toast.error(error.message)
        setLoading(false);
    }else{
        toast.success("Successfully logged in")
        router.push(redirect)
        router.refresh()
    }
    }
    return (
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-800/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-3 pt-8 pb-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#1337ec] flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 mb-2">
            S
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white">Welcome Back</CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Enter your credentials to access your vault
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-medium ml-1">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-slate-950/50 border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
                <a href="#" className="text-xs text-[#1337ec] hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-slate-950/50 border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 px-8 pb-10 pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#1337ec] hover:underline font-bold">Create Account</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    )
}

export default function LoginPage(){
    return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] p-4 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent -z-10" />
      <Suspense fallback={<div className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.3em] text-xs">Initializing Vault...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}