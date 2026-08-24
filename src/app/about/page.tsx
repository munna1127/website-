import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  const skills = [
    { domain: "Languages & Scripting", techs: "Python 3.x, JavaScript (Node.js runtime), HTML5, CSS3" },
    { domain: "Backend & Architecture", techs: "Flask Web Framework, RESTful APIs, Session Cookie Routing" },
    { domain: "Subsystems & Environments", techs: "Termux Native POSIX Sandbox, Linux Command-Line (CLI), Android System Internals" },
    { domain: "Version Control & CI/CD", techs: "Git Directed Acyclic Graph (DAG) Trees, GitHub Automation Systems" },
    { domain: "Persistence & Telemetry", techs: "Telegram Bot API Webhooks, Cloud PaaS Automation (Render, Netlify)" },
    { domain: "Security & Threat Focus", techs: "Protocol Inversion Research, Information Theory (High-Entropy Storage Defense)" }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-12 md:p-16 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
            🚀 Aryan Tomar
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
                Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
                ← Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Profile Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🛡️ Security Researcher & Systems Automation Engineer
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Aryan Tomar
          </h1>
          <p className="text-indigo-300 font-medium text-lg">
            Self-Taught Developer | Cybersecurity Enthusiast
          </p>

          {/* Operational Resourcefulness Callout */}
          <Card className="bg-slate-900/60 border-indigo-500/30 backdrop-blur mt-6 text-left">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                📱 Operational Resourcefulness
              </CardTitle>
              <CardDescription className="text-slate-300 text-sm leading-relaxed mt-1">
                All core frameworks, security auditing utilities, and backend systems in my portfolio were built and deployed entirely on an Android smartphone using the Termux POSIX subsystem without relying on a traditional laptop-based development environment.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Connect & Direct Channels Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">📬 Connect & Direct Channels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition">
              <CardHeader className="p-4">
                <CardDescription className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Official Email</CardDescription>
                <CardTitle className="text-sm font-medium text-white mt-1">
                  <a href="mailto:aryantomar4327@gmail.com" className="text-indigo-400 hover:underline">
                    aryantomar4327@gmail.com
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition">
              <CardHeader className="p-4">
                <CardDescription className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Telegram Channel</CardDescription>
                <CardTitle className="text-sm font-medium text-white mt-1">
                  <a href="https://t.me/tomar_ji_99" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                    @tomar_ji_99
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition">
              <CardHeader className="p-4">
                <CardDescription className="text-xs text-slate-400 uppercase tracking-wider font-semibold">GitHub (Primary)</CardDescription>
                <CardTitle className="text-sm font-medium text-white mt-1">
                  <a href="https://github.com/munna1127" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                    github.com/munna1127
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition">
              <CardHeader className="p-4">
                <CardDescription className="text-xs text-slate-400 uppercase tracking-wider font-semibold">GitHub (Secondary)</CardDescription>
                <CardTitle className="text-sm font-medium text-white mt-1">
                  <a href="https://github.com/tomar-ji" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                    github.com/tomar-ji
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>

          </div>
        </div>

        {/* About Me Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">👤 About Me</h2>
          <p className="text-slate-300 leading-relaxed">
            I am a self-taught systems programmer who started engineering application logic during high school out of sheer curiosity and a drive to break down complex computing barriers.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Unlike traditional structured academic paths, my development workflow is entirely <strong>problem-driven</strong>. My software structures do not originate from passive tutorials; they are built as custom internal utilities designed to dissect everyday edge cases, map public API behavior, and explore localized transport vulnerabilities.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Operating strictly within an isolated mobile environment, I independently mastered advanced Linux command-line architecture, decentralized Git version control trees, asynchronous data parsing, and backend service persistence. Over time, my engineering scope has naturally pivoted towards core network threat intelligence, system memory forensics, protocol abuse vulnerabilities, and secure software development.
          </p>
        </div>

        {/* Technical Skill Matrix */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">🛠️ Deep Technical Skill Matrix</h2>
          <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                      <th className="py-3 px-4 font-semibold">Capability Domain</th>
                      <th className="py-3 px-4 font-semibold">Technologies & Operational Frameworks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {skills.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 px-4 font-medium text-white">{item.domain}</td>
                        <td className="py-3 px-4 text-slate-300">{item.techs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Practical Engineering Highlights */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">🚀 Key Practical Engineering Highlights</h2>
          <ul className="space-y-3 text-slate-300 list-disc list-inside leading-relaxed">
            <li><strong>Local-First Version Control Execution:</strong> Complete backend version control tracking managed locally inside native terminal sandboxes (`/data/data/com.termux/`) before remote public distribution.</li>
            <li><strong>Cloud Instance Persistence Optimization:</strong> Engineered custom low-overhead heartbeat daemons executing synthetic HTTP request loops to legally bypass free-tier cloud idle constraints, ensuring stable 24/7 endpoint availability.</li>
            <li><strong>Signature-less Storage Anomaly Detection:</strong> Implemented mathematical information-theory algorithms (Shannon Entropy calculations) to monitor real-time file mutation velocities and track high-entropy indicators.</li>
          </ul>
        </div>

        {/* Professional Core Domains */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">📂 Core Engineering Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base text-white">🛡️ Infrastructure & Access Control</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">
                  Multi-factor identity validation frameworks, out-of-band token structures, volatile session cleanups, and compliance audit architectures.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base text-white">📡 Threat Intelligence & Forensics</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">
                  Non-blocking multi-threaded asynchronous frameworks, schema extraction utilities, and digital forensics wrappers monitoring streaming connections.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Active Strategic Milestones */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">🎯 Active Strategic Milestones</h2>
          <ul className="space-y-3 text-slate-300 list-disc list-inside leading-relaxed">
            <li><strong>Advanced Cyber Defense:</strong> Deepening structural research into defensive network layer security, automated vulnerability remediation, and application-layer cryptographic models.</li>
            <li><strong>Open Source Contribution:</strong> Designing highly resilient, low-resource processing frameworks optimized for constraint-heavy operating environments.</li>
            <li><strong>Academic Research:</strong> Preparing to scale localized security prototypes into robust enterprise-grade network protection frameworks at <strong>IIT Kanpur</strong>.</li>
          </ul>
        </div>

        {/* Footer CTA */}
        <div className="pt-8 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 Aryan Tomar. All rights reserved.</p>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
