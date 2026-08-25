import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  const experiences = [
    {
      period: "2025 - Present",
      role: "Systems & Security Software Engineer",
      description: "Designing and deploying production-grade web applications, asynchronous threat telemetry engines, and automated webhook notification pipelines entirely within mobile POSIX sandboxes.",
      highlights: ["Next.js App Router & Tailwind CSS", "Neon Serverless PostgreSQL & Prisma ORM", "Telegram Bot API Webhooks & Security Middleware"]
    },
    {
      period: "Full-Stack Development",
      role: "Platform Architect & Creator",
      description: "Engineered scalable web systems including 'Safalta Quiz Bhagalpur' featuring custom timer logic, student leaderboards, and automated subject analysis reports.",
      highlights: ["Node.js & Express / Python Flask Backends", "DOM Parsers & Asynchronous REST Pipelines", "Zero-laptop mobile deployment workflows"]
    },
    {
      period: "Leadership & Discipline",
      role: "Captaincy & Cadete Honors",
      description: "Demonstrated team leadership and tactical coordination as a two-time state and regional hockey team captain, school house captain, and active participant in NCC and NSS service initiatives.",
      highlights: ["State & Regional Hockey Team Captain", "School House Captain", "NCC & NSS Community Engagement"]
    }
  ];

  const coreSkills = [
    { category: "Languages & Core", skills: ["JavaScript (ESNext)", "TypeScript", "Python 3.x", "SQL", "Shell Scripting"] },
    { category: "Backend & Web", skills: ["Node.js", "Express", "Flask", "Next.js App Router", "REST APIs", "Webhooks"] },
    { category: "Databases & ORM", skills: ["PostgreSQL", "Neon Cloud", "Prisma ORM", "Database Migrations"] },
    { category: "Security & POSIX", skills: ["Information Theory (Shannon Entropy)", "OSINT Recon", "Linux POSIX Environment", "Git Version Control"] }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 w-full space-y-12">
        
        {/* Header Hero */}
        <div className="space-y-4 border-b border-slate-800/80 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🎓 Professional Profile & Background
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            System Architecture & Leadership
          </h1>
          <p className="text-slate-400 text-base max-w-3xl leading-relaxed">
            Combining rigorous backend engineering, protocol analysis, and tactical leadership honed through competitive sports and disciplined community service.
          </p>
        </div>

        {/* Experience & Timeline Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            💼 Journey & Key Milestones
          </h2>
          
          <div className="space-y-6 border-l-2 border-indigo-500/30 pl-4 sm:pl-6 ml-2">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative space-y-3">
                {/* Timeline Node Dot */}
                <span className="absolute -left-[21px] sm:-left-[29px] top-1.5 h-3.5 w-3.5 rounded-full bg-indigo-500 ring-4 ring-slate-950"></span>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 w-fit">
                    {exp.period}
                  </span>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {exp.highlights.map((item, hIdx) => (
                    <span key={hIdx} className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Competencies Matrix */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            ⚡ Technical Competencies
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreSkills.map((group, idx) => (
              <Card key={idx} className="bg-slate-900/60 border-slate-800 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-indigo-400 uppercase font-mono tracking-wider">
                    {group.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {group.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-200 font-medium">
                      {skill}
                    </span>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/60 border-indigo-500/30 p-6 sm:p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Let's Build Resilient Systems Together</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Looking to collaborate on systems programming, security tooling, or backend architecture? Get in touch directly.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/contact">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 shadow-lg shadow-indigo-600/25">
                ✉️ Send Transmission
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
                Explore Vault →
              </Button>
            </Link>
          </div>
        </Card>

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Engineered with Next.js, PostgreSQL & Vercel.</p>
      </footer>
    </div>
  );
}
