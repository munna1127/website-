import Link from "next/link";
import Terminal from "@/components/Terminal";

export default function Home() {
  const features = [
    {
      title: "Security & Systems Engineering",
      desc: "Built entirely in Termux POSIX sandbox with zero laptop dependency.",
      icon: "🛡️"
    },
    {
      title: "Projects & Tooling Vault",
      desc: "Open source threat telemetry, OSINT processors, and memory forensics modules.",
      icon: "📂"
    },
    {
      title: "Live Telemetry & Diagnostics",
      desc: "Real-time PostgreSQL round-trip latency and edge server health monitoring.",
      icon: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 sticky top-0 z-50 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="font-bold text-base sm:text-lg text-white flex items-center gap-1.5 shrink-0">
            🚀 Aryan Tomar
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/projects" className="text-xs sm:text-sm text-slate-300 hover:text-white transition px-2 py-1">
              Projects
            </Link>
            <Link href="/about" className="text-xs sm:text-sm text-slate-300 hover:text-white transition px-2 py-1">
              About
            </Link>
            <Link href="/tools/entropy" className="text-xs sm:text-sm text-slate-300 hover:text-white transition px-2 py-1">
              Tools
            </Link>
            <Link href="/status" className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 transition px-2 py-1">
              ● Status
            </Link>
            <Link href="/contact" className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 transition px-2 py-1">
              Contact
            </Link>
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-md font-medium transition shadow-md shadow-indigo-500/20">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-20 text-center w-full space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-medium">
          ✨ Security Researcher & Systems Automation Engineer
        </div>
        
        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Engineering Resilient <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Software & Defense Systems
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Problem-driven backend architecture, protocol research, and cloud automation built entirely via mobile POSIX subsystems.
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/projects" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm shadow-xl shadow-indigo-600/25 transition">
            Explore Projects
          </Link>
          <Link href="/contact" className="border border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 px-6 py-2.5 rounded-lg text-sm transition">
            ✉️ Contact
          </Link>
        </div>

        {/* Terminal Component */}
        <div className="pt-4 text-left">
          <Terminal />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 text-left">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition p-5 rounded-xl">
              <div className="text-2xl mb-2">{feat.icon}</div>
              <h3 className="text-base text-white font-semibold">{feat.title}</h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Built with Next.js, TypeScript & Vercel.</p>
      </footer>
    </div>
  );
}
