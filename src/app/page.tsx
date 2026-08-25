import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Mobile-Optimized Responsive Navbar */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="font-bold text-base sm:text-xl tracking-tight text-white whitespace-nowrap flex items-center gap-1.5 shrink-0">
            🚀 Aryan Tomar
          </Link>
          
          {/* Scrollable nav menu for smaller mobile screens */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            <Link href="/projects" className="shrink-0">
              <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white text-xs px-2 sm:px-3 h-8">
                Projects
              </Button>
            </Link>
            <Link href="/about" className="shrink-0">
              <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white text-xs px-2 sm:px-3 h-8">
                About
              </Button>
            </Link>
            <Link href="/tools/entropy" className="shrink-0">
              <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white text-xs px-2 sm:px-3 h-8">
                Tools
              </Button>
            </Link>
            <Link href="/status" className="shrink-0">
              <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 text-xs px-2 sm:px-3 h-8">
                ● Status
              </Button>
            </Link>
            <Link href="/contact" className="shrink-0">
              <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-indigo-400 text-xs px-2.5 sm:px-3 h-8">
                Contact
              </Button>
            </Link>
            <Link href="/dashboard" className="shrink-0">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 h-8 shadow-md shadow-indigo-500/20">
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
          ✨ Security Researcher & Systems Automation Engineer
        </div>
        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Engineering Resilient <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Software & Defense Systems
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Problem-driven backend architecture, protocol research, and cloud automation built entirely via mobile POSIX subsystems.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          <Link href="/projects">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 sm:px-8 text-sm sm:text-base shadow-xl shadow-indigo-600/25">
              Explore Projects
            </Button>
          </Link>
          <Link href="/status">
            <Button size="lg" variant="outline" className="border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium px-6 sm:px-8 text-sm sm:text-base">
              ● Live Status Ping
            </Button>
          </Link>
        </div>

        {/* Interactive POSIX Shell */}
        <div className="mt-4 w-full">
          <Terminal />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <Card key={idx} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition duration-300">
              <CardHeader>
                <div className="text-3xl mb-2">{feat.icon}</div>
                <CardTitle className="text-lg text-white font-semibold">{feat.title}</CardTitle>
                <CardDescription className="text-slate-400 text-sm mt-1 leading-relaxed">
                  {feat.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs sm:text-sm text-slate-500 w-full">
        <p>© 2026 Aryan Tomar. Built with Next.js, TypeScript & Vercel.</p>
      </footer>
    </main>
  );
}
