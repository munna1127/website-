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
      title: "Live Forensics Tools",
      desc: "Interactive Shannon Entropy mathematical scanner for encrypted anomaly detection.",
      icon: "🔬"
    },
    {
      title: "Secure Auth & Dashboard",
      desc: "Password-protected live CRUD management panel direct database sync ke sath.",
      icon: "⚡"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            🚀 Aryan Tomar
          </span>
          <nav className="flex items-center gap-3">
            <Link href="/about">
              <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900">
                About Me
              </Button>
            </Link>
            <Link href="/tools/entropy">
              <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-indigo-400">
                Entropy Tool
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" variant="outline" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
          ✨ Security Researcher & Systems Automation Engineer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Engineering Resilient <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Software & Defense Systems
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Problem-driven backend architecture, protocol research, and cloud automation built entirely via mobile POSIX subsystems.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          <Link href="/about">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 shadow-xl shadow-indigo-600/25">
              Explore Profile
            </Button>
          </Link>
          <Link href="/tools/entropy">
            <Button size="lg" variant="outline" className="border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-medium px-8">
              🔬 Test Entropy Tool
            </Button>
          </Link>
        </div>

        {/* Interactive POSIX Shell */}
        <div className="mt-4">
          <Terminal />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 w-full">
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
      <footer className="border-t border-slate-800/80 py-8 text-center text-sm text-slate-500">
        <p>© 2026 Aryan Tomar. Built with Next.js, TypeScript & Vercel.</p>
      </footer>
    </main>
  );
}
