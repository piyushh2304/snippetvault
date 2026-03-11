'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Shield, Zap, Share2, MousePointerClick, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-slate-100 font-sans selection:bg-[#1337ec]/30 overflow-x-hidden">
      {/* Background Gradients & Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent -z-10" />
      <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#1337ec]/10 via-transparent to-transparent -z-10" />
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#1337ec]/10 rounded-full blur-[140px] -z-10 animate-pulse transition-opacity duration-1000" />
      <div className="fixed top-[40%] -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      {/* Hero Section */}
      <motion.header 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center justify-center px-6 pt-32 pb-32 text-center"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-slate-900/40 border border-slate-800/60 text-sm font-semibold text-blue-400 mb-10 shadow-xl backdrop-blur-md">
          <Sparkles className="w-4 h-4" />
          <span>Revolutionize your coding workflow</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05]">
          Your Personal <br />
          <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            Snippet Vault
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="max-w-2xl text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed font-medium">
          The premium developer companion. Save, organize, and export your code in a high-speed vault designed for efficiency and clarity.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5">
          <Link href="/dashboard">
            <Button size="lg" className="h-16 px-10 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white rounded-2xl shadow-2xl shadow-blue-600/20 text-xl font-bold group transition-all hover:scale-105 active:scale-95">
              Open Your Vault
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg" className="h-16 px-10 border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 text-slate-200 rounded-2xl text-xl font-bold backdrop-blur-md transition-all hover:scale-105 active:scale-95">
              Explore Demo
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="ghost" size="lg" className="h-16 px-10 text-slate-400 hover:text-white rounded-2xl text-xl font-bold transition-all hover:scale-105 active:scale-95">
              Browse Public
            </Button>
          </Link>
        </motion.div>
      </motion.header>

      {/* Features Grid */}
      <section className="px-6 py-32 max-w-7xl mx-auto w-full relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white">Built for performance</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">Every feature is meticulously designed to provide the fastest developer experience.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<Zap className="w-7 h-7 text-yellow-500" />}
            title="Lightning Fast"
            description="Built with Next.js and Supabase for instantaneous code retrieval and real-time updates."
          />
          <FeatureCard 
            icon={<Shield className="w-7 h-7 text-[#1337ec]" />}
            title="Secure by Design"
            description="Your snippets are protected with enterprise-grade row-level security and private storage."
          />
          <FeatureCard 
            icon={<Share2 className="w-7 h-7 text-emerald-500" />}
            title="Social Sharing"
            description="One-click public sharing with premium syntax highlighting and beautiful meta previews."
          />
          <FeatureCard 
            icon={<MousePointerClick className="w-7 h-7 text-indigo-500" />}
            title="Export Assets"
            description="Generate stunning, high-resolution code screenshots for presentations and social media."
          />
          <FeatureCard 
            icon={<Code2 className="w-7 h-7 text-orange-500" />}
            title="Multi-Language"
            description="Full support for 20+ programming languages with expert-level syntax highlighting."
          />
          <FeatureCard 
            icon={<Sparkles className="w-7 h-7 text-pink-500" />}
            title="Modern DX"
            description="Designed for developers, by developers. Every hotkey and shortcut has been optimized."
          />
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="px-6 py-40 text-center relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#1337ec]/10 blur-[150px] -z-10 rounded-full" />
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Ready to secure <br /> your knowledge?</h2>
        <Link href="/signup">
          <Button size="lg" className="h-16 px-12 bg-[#1337ec] hover:bg-[#1337ec]/90 text-white rounded-2xl shadow-2xl shadow-blue-600/20 text-xl font-bold transition-all hover:scale-110 active:scale-95">
            Create Free Account
          </Button>
        </Link>
        <p className="mt-8 text-slate-500 font-medium">No credit card required. Private by default.</p>
      </motion.section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900/50 py-16 text-center bg-slate-950/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5 opacity-60">
            <div className="w-7 h-7 rounded-lg bg-[#1337ec] flex items-center justify-center font-bold text-white text-sm">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              SnippetVault
            </span>
          </div>
          <div className="space-y-2 text-slate-500 text-sm font-medium">
            <p>© {new Date().getFullYear()} SnippetVault. All rights reserved.</p>
            <p className="text-slate-600">Built with excellence using Next.js and Supabase</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={itemVariants}
      className="group p-10 rounded-3xl bg-slate-900/20 border border-slate-800/40 hover:border-[#1337ec]/40 transition-all hover:bg-slate-900/40 hover:shadow-2xl hover:shadow-blue-500/5"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800/40 flex items-center justify-center mb-8 group-hover:bg-[#1337ec]/10 group-hover:scale-110 transition-all border border-slate-700/30 group-hover:border-[#1337ec]/20">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-base leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
