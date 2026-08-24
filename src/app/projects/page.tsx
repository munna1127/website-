"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ProjectItem {
  title: string;
  category: "Access Control" | "OSINT & Threat Intel" | "Forensics & Automation";
  desc: string;
  techs: string[];
  repoUrl: string;
  badge: string;
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const projects: ProjectItem[] = [
    {
      title: "Secure-AuthSim Core",
      category: "Access Control",
      desc: "Multi-factor identity validation framework simulating out-of-band token structures, volatile session cleanups, and automated rate-throttling exhaustion triggers.",
      techs: ["Python", "Flask", "Session Routing", "Cryptography"],
      repoUrl: "https://github.com/munna1127/secure-authsim-core",
      badge: "🛡️ Access Defense"
    },
    {
      title: "OSINT-Nexus Core",
      category: "OSINT & Threat Intel",
      desc: "Non-blocking multi-threaded asynchronous framework consolidating BGP carrier routes, public telemetry, and network carrier registries into standardized profiles.",
      techs: ["Node.js", "Asynchronous Pipelines", "BGP Protocol", "REST API"],
      repoUrl: "https://github.com/munna1127/osint-nexus-core",
      badge: "📡 Recon & Intelligence"
    },
    {
      title: "GeoAudit Telemetry Sim",
      category: "Access Control",
      desc: "Compliance audit architecture evaluating browser-level access controls, proxy anomaly triggers, and asynchronous Layer-3 infrastructure validation logs.",
      techs: ["TypeScript", "Network Logs", "Compliance Audit", "Next.js"],
      repoUrl: "https://github.com/munna1127/geoaudit-telemetry-sim",
      badge: "🛰️ Network Audit"
    },
    {
      title: "InstaLens OSINT Harvester",
      category: "OSINT & Threat Intel",
      desc: "Automated schema extraction utility auditing endpoint data disclosure boundaries, rate-limit elasticity, and platform state mutations.",
      techs: ["Python 3.x", "DOM Parser", "Reverse Engineering", "State Machines"],
      repoUrl: "https://github.com/munna1127/instalens-osint-harvester",
      badge: "🔍 Endpoint Forensics"
    },
    {
      title: "Shannon Entropy Threat Defense",
      category: "Forensics & Automation",
      desc: "Signature-less mathematical information-theory engine calculating real-time byte randomness velocities to detect packed ransomware payloads and obfuscation.",
      techs: ["Mathematics", "Information Theory", "Forensics", "JavaScript"],
      repoUrl: "/tools/entropy",
      badge: "🔬 Active Anomaly Engine"
    },
    {
      title: "Ephemeral Media Forensics",
      category: "Forensics & Automation",
      desc: "Prototype digital forensics wrapper monitoring asynchronous streaming connections to capture and archive volatile in-memory digital buffers securely.",
      techs: ["Linux POSIX", "Memory Buffers", "Stream Capture", "Shell Scripting"],
      repoUrl: "https://github.com/munna1127/ephemeral-media-forensics",
      badge: "💾 Memory Analysis"
    }
  ];

  const categories = ["All", "Access Control", "OSINT & Threat Intel", "Forensics & Automation"];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.techs.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 selection:bg-indigo-500 selection:text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
            🚀 Aryan Tomar
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/about">
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
                About Me
              </Button>
            </Link>
            <Link href="/tools/entropy">
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-indigo-400">
                Entropy Tool
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
                ← Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            📂 Production Engineering Repositories
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security Systems & Tooling Vault
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Custom security frameworks, asynchronous threat intelligence processors, and memory forensics modules built and maintained in native POSIX mobile environments.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold"
                    : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <Input
              placeholder="🔍 Search tech or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white text-xs placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p, idx) => (
            <Card key={idx} className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-xl">
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                    {p.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{p.category}</span>
                </div>
                <CardTitle className="text-lg font-bold text-white tracking-tight">{p.title}</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed pt-1">
                  {p.desc}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-0">
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.techs.map((t, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 border-t border-slate-800/60">
                  <a
                    href={p.repoUrl}
                    target={p.repoUrl.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                  >
                    {p.repoUrl.startsWith("http") ? "View Source Repository ↗" : "Launch Interactive Tool →"}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </main>
  );
}
