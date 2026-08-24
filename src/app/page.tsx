import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      title: "Fullstack Architecture",
      desc: "Next.js App Router ke sath server actions aur scalable modular structure.",
      icon: "⚡"
    },
    {
      title: "Cloud Database Ready",
      desc: "PostgreSQL & Prisma ORM integrated jo zero latency aur auto-scaling provide karta hai.",
      icon: "🗄️"
    },
    {
      title: "Customizable & Modular",
      desc: "Naye dynamic routes, APIs, auth, aur dashboards bina kisi extra setup ke add karo.",
      icon: "🛠️"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/70">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            🚀 MyPlatform
          </span>
          <nav className="flex items-center gap-4">
            <Link href="/api/users" target="_blank" className="text-sm font-medium text-slate-400 hover:text-white transition">
              API Status
            </Link>
            <Link href="#features">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-6">
          ✨ Next.js + Tailwind + PostgreSQL Live
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Next-Gen Modular <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Web Application Platform
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Production-ready architecture jisme authentication, cloud database, aur reusable UI components pre-configured hain.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 shadow-xl shadow-indigo-600/25">
            Launch Dashboard
          </Button>
          <Button size="lg" variant="outline" className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200">
            Documentation
          </Button>
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
        <p>© 2026 MyPlatform. Built with Next.js & Vercel.</p>
      </footer>
    </main>
  );
}
