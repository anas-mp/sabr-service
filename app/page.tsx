import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-scholar-emerald/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-scholar-gold/5 rounded-full blur-3xl opacity-30" />

      {/* Navbar Placeholder (Monogram) */}
      <nav className="absolute top-6 left-6 md:left-12">
        <div className="w-10 h-10 rounded-full border border-scholar-gold/30 flex items-center justify-center">
          <span className="text-scholar-gold font-serif text-sm">SS</span>
        </div>
      </nav>

      <nav className="absolute top-6 right-6 md:right-12 space-x-6 text-sm font-medium tracking-wide">
        <Link href="/login" className="text-muted-text hover:text-soft-white transition-colors">
          LOGIN
        </Link>
        <Link href="/signup" className="text-scholar-gold hover:text-scholar-gold/80 transition-colors">
          JOIN
        </Link>
      </nav>

      <main className="max-w-4xl w-full text-center space-y-16 z-10">

        {/* Hero Section */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <p className="text-scholar-gold font-medium tracking-[0.2em] text-xs uppercase opacity-80">
            A Private Discipline System
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-soft-white leading-tight">
            Sabr <span className="text-scholar-gold text-4xl md:text-6xl align-middle mx-2">&</span> Service
          </h1>
          <p className="text-xl text-muted-text font-serif italic max-w-lg mx-auto">
            "Preparation is private. Character is permanent."
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <Link
            href="/signup"
            className="group relative px-8 py-4 glass-card hover:bg-white/10 transition-all duration-300 flex items-center gap-4"
          >
            <span className="text-soft-white tracking-widest uppercase text-sm font-medium group-hover:text-scholar-gold transition-colors">
              Begin The Work
            </span>
            <ArrowRight className="w-4 h-4 text-scholar-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <div className="glass-card p-6 space-y-4 text-left hover:-translate-y-1 transition-transform duration-300">
            <Clock className="w-6 h-6 text-scholar-emerald" />
            <h3 className="text-lg font-serif text-soft-white">Time Command</h3>
            <p className="text-muted-text text-sm leading-relaxed">
              Advanced focus timers and consistency analytics to master your schedule.
            </p>
          </div>
          <div className="glass-card p-6 space-y-4 text-left hover:-translate-y-1 transition-transform duration-300">
            <BookOpen className="w-6 h-6 text-scholar-gold" />
            <h3 className="text-lg font-serif text-soft-white">Spiritual Grounding</h3>
            <p className="text-muted-text text-sm leading-relaxed">
              Daily reflective ayahs and journaling to align intention with action.
            </p>
          </div>
          <div className="glass-card p-6 space-y-4 text-left hover:-translate-y-1 transition-transform duration-300">
            <Shield className="w-6 h-6 text-soft-white/60" />
            <h3 className="text-lg font-serif text-soft-white">Officer Identity</h3>
            <p className="text-muted-text text-sm leading-relaxed">
              Built for the serious aspirant. Private stats, distraction logs, and elite tracking.
            </p>
          </div>
        </div>

      </main>

      <footer className="absolute bottom-6 text-center w-full text-xs text-muted-text/40 tracking-widest uppercase">
        © 2026 Sabr & Service. All Rights Reserved.
      </footer>
    </div>
  );
}
