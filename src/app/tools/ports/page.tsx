"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PortScannerPage() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  const [error, setError] = useState("");

  const sampleTargets = ["scanme.nmap.org", "github.com", "cloudflare.com"];

  const handleScan = async (domainToScan?: string) => {
    const domain = domainToScan || target;
    if (!domain) return;
    setLoading(true);
    setError("");
    setScanData(null);

    try {
      const res = await fetch("/api/ports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: domain }),
      });
      const result = await res.json();
      if (result.success) {
        setScanData(result);
      } else {
        setError(result.error || "Port scanning failed");
      }
    } catch {
      setError("Network timeout or connection failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            ⚡ Asynchronous TCP Prober
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Network Port & Service Fingerprinter
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Parallel TCP connect socket probing for high-risk service ports, banner analysis, and responsive network footprinting.
          </p>
        </div>

        {/* Input Card */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter target (e.g., scanme.nmap.org)..."
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500 font-mono text-xs"
              />
              <Button
                onClick={() => handleScan()}
                disabled={loading || !target.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 shrink-0 shadow-lg shadow-indigo-600/25"
              >
                {loading ? "Probing Ports..." : "🔍 Run Port Scan"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono">Sample Targets:</span>
              {sampleTargets.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setTarget(d);
                    handleScan(d);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  {d}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            ✕ {error}
          </div>
        )}

        {/* Results Stream */}
        {scanData && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Target Host</CardDescription>
                  <CardTitle className="text-base font-bold text-white mt-1 truncate">{scanData.target}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Open Ports Discovered</CardDescription>
                  <CardTitle className="text-xl font-bold text-emerald-400 mt-1">{scanData.openCount} / {scanData.results.length}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Execution Speed</CardDescription>
                  <CardTitle className="text-xl font-bold text-indigo-400 mt-1">{scanData.totalExecutionMs} ms</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Port Table */}
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
              <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800">
                <CardTitle className="text-xs text-white uppercase font-bold">TCP Socket Probing Matrix</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                      <th className="p-3 pl-4">Port</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">State Status</th>
                      <th className="p-3 pr-4 text-right">Handshake Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {scanData.results.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 pl-4 font-bold text-white">TCP/{r.port}</td>
                        <td className="p-3 text-indigo-300">{r.service}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            r.status === "OPEN"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                              : "bg-slate-950 text-slate-500 border-slate-800"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 pr-4 text-right text-slate-400">
                          {r.status === "OPEN" ? `${r.latencyMs} ms` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Asynchronous TCP Socket Prober.</p>
      </footer>
    </div>
  );
}
