"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CvssCalculatorPage() {
  const [av, setAv] = useState<"N" | "A" | "L" | "P">("N"); // Attack Vector
  const [ac, setAc] = useState<"L" | "H">("L");             // Attack Complexity
  const [pr, setPr] = useState<"N" | "L" | "H">("N");       // Privileges Required
  const [ui, setUi] = useState<"N" | "R">("N");             // User Interaction
  const [scope, setScope] = useState<"U" | "C">("U");       // Scope
  const [c, setC] = useState<"H" | "L" | "N">("H");         // Confidentiality
  const [i, setI] = useState<"H" | "L" | "N">("H");         // Integrity
  const [a, setA] = useState<"H" | "L" | "N">("H");         // Availability
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // CVSS v3.1 Scoring Algorithm
  const calculation = useMemo(() => {
    const weights = {
      av: { N: 0.85, A: 0.62, L: 0.55, P: 0.2 },
      ac: { L: 0.77, H: 0.44 },
      pr: {
        U: { N: 0.85, L: 0.62, H: 0.27 },
        C: { N: 0.85, L: 0.68, H: 0.50 },
      },
      ui: { N: 0.85, R: 0.62 },
      cia: { H: 0.56, L: 0.22, N: 0 },
    };

    const vector = `CVSS:3.1/AV:${av}/AC:${ac}/PR:${pr}/UI:${ui}/S:${scope}/C:${c}/I:${i}/A:${a}`;

    const iss = 1 - (1 - weights.cia[c]) * (1 - weights.cia[i]) * (1 - weights.cia[a]);

    let impact = 0;
    if (scope === "U") {
      impact = 6.42 * iss;
    } else {
      impact = 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    }

    const exploitability = 8.22 * weights.av[av] * weights.ac[ac] * weights.pr[scope][pr] * weights.ui[ui];

    let baseScore = 0;
    if (impact > 0) {
      if (scope === "U") {
        baseScore = Math.min(impact + exploitability, 10);
      } else {
        baseScore = Math.min(1.08 * (impact + exploitability), 10);
      }
      // Official CVSS round-up to 1 decimal place
      baseScore = Math.ceil(baseScore * 10) / 10;
    }

    let severity = "NONE";
    let color = "text-slate-400";
    let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";

    if (baseScore >= 9.0) {
      severity = "CRITICAL";
      color = "text-red-400";
      badgeColor = "bg-red-500/20 text-red-400 border-red-500/40";
    } else if (baseScore >= 7.0) {
      severity = "HIGH";
      color = "text-orange-400";
      badgeColor = "bg-orange-500/20 text-orange-400 border-orange-500/40";
    } else if (baseScore >= 4.0) {
      severity = "MEDIUM";
      color = "text-amber-400";
      badgeColor = "bg-amber-500/20 text-amber-400 border-amber-500/40";
    } else if (baseScore >= 0.1) {
      severity = "LOW";
      color = "text-yellow-400";
      badgeColor = "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
    }

    return {
      vector,
      baseScore: baseScore.toFixed(1),
      impactScore: (Math.ceil(impact * 10) / 10).toFixed(1),
      exploitabilityScore: (Math.ceil(exploitability * 10) / 10).toFixed(1),
      severity,
      color,
      badgeColor,
    };
  }, [av, ac, pr, ui, scope, c, i, a]);

  const setPreset = (preset: "log4j" | "eternalblue" | "xss" | "privesc") => {
    if (preset === "log4j") {
      setAv("N"); setAc("L"); setPr("N"); setUi("N"); setScope("C"); setC("H"); setI("H"); setA("H");
    } else if (preset === "eternalblue") {
      setAv("N"); setAc("L"); setPr("N"); setUi("N"); setScope("U"); setC("H"); setI("H"); setA("H");
    } else if (preset === "xss") {
      setAv("N"); setAc("L"); setPr("N"); setUi("R"); setScope("C"); setC("L"); setI("L"); setA("N");
    } else if (preset === "privesc") {
      setAv("L"); setAc("L"); setPr("L"); setUi("N"); setScope("U"); setC("H"); setI("H"); setA("H");
    }
  };

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const markdownSnippet = `### Vulnerability Severity Assessment
- **CVSS v3.1 Base Score:** \`${calculation.baseScore}\` (${calculation.severity})
- **Vector String:** \`${calculation.vector}\`
- **Impact Sub-score:** \`${calculation.impactScore}\`
- **Exploitability Sub-score:** \`${calculation.exploitabilityScore}\``;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            ⚖️ Common Vulnerability Scoring System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            CVSS v3.1 Vulnerability Calculator
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Deterministic vulnerability base scoring, vector string generation, and impact assessment based on FIRST.org mathematical standards.
          </p>
        </div>

        {/* Quick Exploit Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Preset Vectors:</span>
          <button onClick={() => setPreset("log4j")} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-red-400 hover:border-red-500/50 font-mono">Log4Shell (10.0)</button>
          <button onClick={() => setPreset("eternalblue")} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-orange-400 hover:border-orange-500/50 font-mono">EternalBlue (9.8)</button>
          <button onClick={() => setPreset("xss")} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/50 font-mono">Reflected XSS (6.1)</button>
          <button onClick={() => setPreset("privesc")} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-indigo-300 hover:border-indigo-500/50 font-mono">Local PrivEsc (7.8)</button>
        </div>

        {/* Real-Time Assessment KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Base Severity</CardDescription>
              <div className="flex items-center gap-3 mt-1">
                <CardTitle className={`text-3xl font-black ${calculation.color}`}>{calculation.baseScore}</CardTitle>
                <span className={`px-2.5 py-0.5 rounded border text-[11px] font-bold ${calculation.badgeColor}`}>
                  {calculation.severity}
                </span>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Exploitability Sub-score</CardDescription>
              <CardTitle className="text-2xl font-bold text-indigo-400 mt-1">{calculation.exploitabilityScore} / 10</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Impact Sub-score</CardDescription>
              <CardTitle className="text-2xl font-bold text-pink-400 mt-1">{calculation.impactScore} / 10</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Vector String Card */}
        <Card className="bg-slate-900/60 border-slate-800 font-mono text-xs">
          <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-indigo-300 uppercase font-bold">Standardized CVSS:3.1 Vector</CardTitle>
            <Button onClick={() => copy(calculation.vector, "vector")} size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-[10px] h-7 px-2.5 text-slate-300">
              {copiedKey === "vector" ? "✓ Copied" : "Copy Vector"}
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-white select-all break-all">
              {calculation.vector}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Metric Selection Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Exploitability Metrics */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-indigo-400 uppercase font-mono tracking-wider">
              1. Exploitability Metrics
            </h2>

            {/* Attack Vector */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-3 pb-2"><CardTitle className="text-xs text-white">Attack Vector (AV)</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 grid grid-cols-2 gap-2 text-xs">
                {[
                  { k: "N", label: "Network (AV:N)" },
                  { k: "A", label: "Adjacent (AV:A)" },
                  { k: "L", label: "Local (AV:L)" },
                  { k: "P", label: "Physical (AV:P)" },
                ].map((item) => (
                  <button key={item.k} onClick={() => setAv(item.k as any)} className={`p-2 rounded font-mono text-xs border text-left transition ${av === item.k ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.label}</button>
                ))}
              </CardContent>
            </Card>

            {/* Attack Complexity & Privileges */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-3 pb-2"><CardTitle className="text-xs text-white">Attack Complexity & Privileges</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 space-y-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Complexity (AC):</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ k: "L", l: "Low (AC:L)" }, { k: "H", l: "High (AC:H)" }].map((item) => (
                      <button key={item.k} onClick={() => setAc(item.k as any)} className={`p-2 rounded font-mono text-xs border transition ${ac === item.k ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Privileges Required (PR):</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ k: "N", l: "None (PR:N)" }, { k: "L", l: "Low (PR:L)" }, { k: "H", l: "High (PR:H)" }].map((item) => (
                      <button key={item.k} onClick={() => setPr(item.k as any)} className={`p-2 rounded font-mono text-xs border transition ${pr === item.k ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.l}</button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Interaction & Scope */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-3 pb-2"><CardTitle className="text-xs text-white">User Interaction & Scope</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  {[{ k: "N", l: "None (UI:N)" }, { k: "R", l: "Required (UI:R)" }].map((item) => (
                    <button key={item.k} onClick={() => setUi(item.k as any)} className={`p-2 rounded font-mono text-xs border transition ${ui === item.k ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.l}</button>
                  ))}
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 block">Scope Boundary (S):</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ k: "U", l: "Unchanged (S:U)" }, { k: "C", l: "Changed (S:C)" }].map((item) => (
                      <button key={item.k} onClick={() => setScope(item.k as any)} className={`p-2 rounded font-mono text-xs border transition ${scope === item.k ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.l}</button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Impact Metrics (CIA Triad) */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-pink-400 uppercase font-mono tracking-wider">
              2. Impact Metrics (CIA Triad)
            </h2>

            {/* Confidentiality */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-3 pb-2"><CardTitle className="text-xs text-white">Confidentiality Impact (C)</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 grid grid-cols-3 gap-2 text-xs">
                {[{ k: "H", l: "High (C:H)" }, { k: "L", l: "Low (C:L)" }, { k: "N", l: "None (C:N)" }].map((item) => (
                  <button key={item.k} onClick={() => setC(item.k as any)} className={`p-2 rounded font-mono text-xs border transition ${c === item.k ? "bg-pink-600 border-pink-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.l}</button>
                ))}
              </CardContent>
            </Card>

            {/* Integrity */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-3 pb-2"><CardTitle className="text-xs text-white">Integrity Impact (I)</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 grid grid-cols-3 gap-2 text-xs">
                {[{ k: "H", l: "High (I:H)" }, { k: "L", l: "Low (I:L)" }, { k: "N", l: "None (I:N)" }].map((item) => (
                  <button key={item.k} onClick={() => setI(item.k as any)} className={`p-2 rounded font-mono text-xs border transition ${i === item.k ? "bg-pink-600 border-pink-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.l}</button>
                ))}
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-3 pb-2"><CardTitle className="text-xs text-white">Availability Impact (A)</CardTitle></CardHeader>
              <CardContent className="p-3 pt-0 grid grid-cols-3 gap-2 text-xs">
                {[{ k: "H", l: "High (A:H)" }, { k: "L", l: "Low (A:L)" }, { k: "N", l: "None (A:N)" }].map((item) => (
                  <button key={item.k} onClick={() => setA(item.k as any)} className={`p-2 rounded font-mono text-xs border transition ${a === item.k ? "bg-pink-600 border-pink-500 text-white" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{item.l}</button>
                ))}
              </CardContent>
            </Card>

            {/* Advisory Markdown Export */}
            <Card className="bg-slate-900/60 border-slate-800 font-mono text-xs">
              <CardHeader className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-xs text-slate-300 uppercase font-bold">Advisory Markdown</CardTitle>
                <Button onClick={() => copy(markdownSnippet, "md")} size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-[10px] h-6 px-2 text-slate-300">
                  {copiedKey === "md" ? "✓ Copied" : "Copy MD"}
                </Button>
              </CardHeader>
              <CardContent className="p-3">
                <pre className="text-slate-400 whitespace-pre-wrap text-[11px] leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800">
                  {markdownSnippet}
                </pre>
              </CardContent>
            </Card>

          </div>

        </div>

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. FIRST.org CVSS v3.1 Standards Compliant.</p>
      </footer>
    </div>
  );
}
