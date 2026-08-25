import Link from "next/link";
import Navbar from "@/components/Navbar";
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
      {/* Dynamic Responsive Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-16 text-center w-full space-y-8">
        
        {/* Researcher Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
          ✨ Security Researcher & Systems Automation Engineer
        </div>
        
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Engineering Resilient <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Software & Defense Systems
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-2">
          Problem-driven backend architecture, protocol research, and cloud automation built entirely via mobile POSIX subsystems.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/projects"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow-xl shadow-indigo-600/25 transition"
          >
            Explore Projects
          </Link>
          <Link
            href="/contact"
            className="border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 px-5 py-2.5 rounded-lg text-sm transition"
          >
            ✉️ Contact Direct
          </Link>
        </div>

        {/* POSIX Terminal Shell */}
        <div className="pt-2 text-left w-full">
          <Terminal />
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6 text-left">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition p-5 rounded-xl shadow-lg"
            >
              <div className="text-2xl mb-2">{feat.icon}</div>
              <h3 className="text-base font-semibold text-white tracking-tight">{feat.title}</h3>
              <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Engineered with Next.js, PostgreSQL & Vercel.</p>
      </footer>
    </div>
  );
}
