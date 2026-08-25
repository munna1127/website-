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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
            🚀 Aryan Tomar
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/projects" className="text-xs sm:text-sm text-slate-300 hover:text-white px-2 py-1">
              Projects
            </Link>
            <Link href="/about" className="text-xs sm:text-sm text-slate-300 hover:text-white px-2 py-1">
              About
            </Link>
            <Link href="/status" className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 px-2 py-1">
              ● Status
            </Link>
            <Link href="/contact" className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 px-2 py-1">
              Contact
            </Link>
            <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-md font-medium shadow-md shadow-indigo-500/20">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-12 text-center w-full space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
          ✨ Security Researcher & Systems Automation Engineer
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Engineering Resilient <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Software & Defense Systems
          </span>
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Problem-driven backend architecture, protocol research, and cloud automation built entirely via mobile POSIX subsystems.
        </p>
        
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/projects" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition">
            Explore Projects
          </Link>
          <Link href="/contact" className="border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-5 py-2.5 rounded-lg text-sm transition">
            ✉️ Contact
          </Link>
        </div>

        {/* Terminal */}
        <div className="pt-4 text-left">
          <Terminal />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-base font-semibold text-white">{f.title}</h3>
              <p className="text-slate-400 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Built with Next.js & Vercel.</p>
      </footer>
    </div>
  );
}
