"use client"
import { useState } from 'react' 
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client' // Browser client
import { Button } from '@/components/ui/button' 
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'


export default function signUpPage(){
    const [email ,setEmail] =useState('')
    const [password,setPassword] =useState('')
    const [displayName , setDisplayName ] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading , setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);

        const {error} = await supabase.auth.signUp({
            email,
            password,
            options:{
                data:{
                    display_name: displayName,
                }
            }
        })
        if(error){
            
        }  if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Welcome to SnippetVault! Your account has been created.')
      router.push('/dashboard')
      router.refresh()
    }
    }

return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] p-4 font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent -z-10" />
      
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-800/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-3 pt-8 pb-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#1337ec] flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 mb-2">
            S
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white leading-tight">Create Account</CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Start organizing your code snippets today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-slate-300 font-medium ml-1">Display Name</Label>
              <Input
                id="displayName"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="h-12 bg-slate-950/50 border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-medium ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-slate-950/50 border-slate-800 focus-visible:ring-[#1337ec]/50 rounded-xl text-slate-200 placeholder:text-slate-600 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 font-medium ml-1">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
              <p className="text-[10px] text-slate-500 ml-1">Minimum 8 characters required</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 px-8 pb-10 pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="text-[#1337ec] hover:underline font-bold">Log in</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}