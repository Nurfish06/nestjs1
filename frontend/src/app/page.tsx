import Link from 'next/link';
import { ArrowRight, Zap, Shield, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] text-white text-center px-4">
      <div className="max-w-3xl space-y-8">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20 text-sm font-medium animate-fade-in">
          <Zap className="w-4 h-4" />
          <span>Next.js 15 + NestJS Full Stack</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Modern Management <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            For Your Portfolio
          </span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto">
          Scale your applications with built-in Redis caching, background queues, 
          microservices, and secure file management.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            href="/login" 
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold border border-zinc-800 transition-all hover:border-zinc-700"
          >
            Create Account
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-left space-y-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            <h3 className="font-bold">Secure Auth</h3>
            <p className="text-sm text-zinc-500">JWT-based authentication with role-based access control.</p>
          </div>
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-left space-y-3">
            <Zap className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold">Redis Speed</h3>
            <p className="text-sm text-zinc-500">High-performance caching and reliable background workers.</p>
          </div>
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-left space-y-3">
            <Rocket className="w-8 h-8 text-purple-500" />
            <h3 className="font-bold">Microservices</h3>
            <p className="text-sm text-zinc-500">Architecture built for distributed systems and scalability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
