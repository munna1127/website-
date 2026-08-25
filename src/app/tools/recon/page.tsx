"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ReconToolPage() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const handleScan = async (domainToScan?: string) => {
    const domain = domainToScan || target;
    if (!domain) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/recon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: domain }),
      });
      const result = await res.json();
      if (result.success) {
        setData(result);
      } else {
        setError(result.error || "Telemetry probing failed");
      }
    } catch {
      setError("Network timeout or connection failure");
    } finally {
      setLoading(false);
    }
  };

  const sampleTargets = ["cloudflare.com", "github.com", "vercel.com"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            📡 Live OSINT Telemetry
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Domain & Security Recon Analyzer
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Asynchronous multi-record DNS resolution, server response latency metrics, and defensive HTTP security header auditing.
          </p>
        </div>

        {/* Input Bar */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter domain (e.g., target.com)..."
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
              />
              <Button
                onClick={() => handleScan()}
                disabled={loading || !target.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 shrink-0 shadow-lg shadow-indigo-600/25"
              >
                {loading ? "Probing Target..." : "⚡ Execute Recon"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Quick Audit Chips:</span>
              {sampleTargets.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setTarget(d);
                    handleScan(d);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition font-mono"
                >
                  {d}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            ✕ {error}
          </div>
        )}

        {/* Telemetry Results */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-xs text-slate-400 font-sans uppercase font-semibold">Response Status</CardDescription>
                  <CardTitle className="text-xl text-white mt-1">
                    {data.http.statusCode ? `HTTP ${data.http.statusCode}` : "Unreachable"}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-xs text-slate-400 font-sans uppercase font-semibold">HTTP Latency</CardDescription>
                  <CardTitle className="text-xl text-indigo-400 mt-1">
                    {data.http.latencyMs} <span className="text-xs text-slate-500 font-sans">ms</span>
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-xs text-slate-400 font-sans uppercase font-semibold">Total Query Speed</CardDescription>
                  <CardTitle className="text-xl text-emerald-400 mt-1">
                    {data.totalExecutionMs} <span className="text-xs text-slate-500 font-sans">ms</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Security Posture Audit */}
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
              <CardHeader className="p-4 sm:p-6 border-b border-slate-800/80">
                <CardTitle className="text-base text-white">🛡️ HTTP Defensive Posture</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Strict-Transport-Security (HSTS):</span>
                  <span className={data.http.securityAudit.hsts ? "text-emerald-400 font-bold" : "text-red-400"}>
                    {data.http.securityAudit.hsts ? "● ENFORCED" : "✕ MISSING"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Content-Security-Policy (CSP):</span>
                  <span className={data.http.securityAudit.csp ? "text-emerald-400 font-bold" : "text-red-400"}>
                    {data.http.securityAudit.csp ? "● ACTIVE" : "✕ MISSING"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">X-Frame-Options:</span>
                  <span className="text-indigo-300">{data.http.securityAudit.xFrame}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">X-Content-Type-Options:</span>
                  <span className="text-indigo-300">{data.http.securityAudit.xContentType}</span>
                </div>
              </CardContent>
            </Card>

            {/* DNS Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800/80">
                  <CardTitle className="text-sm text-white">IPv4 (A Records)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs font-mono space-y-1 text-slate-300">
                  {data.dns.ipv4.length ? (
                    data.dns.ipv4.map((ip: string, i: number) => <div key={i}>• {ip}</div>)
                  ) : (
                    <span className="text-slate-500">No A records returned.</span>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800/80">
                  <CardTitle className="text-sm text-white">Mail Exchange (MX Records)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs font-mono space-y-1 text-slate-300">
                  {data.dns.mx.length ? (
                    data.dns.mx.map((m: any, i: number) => (
                      <div key={i}>• [{m.priority}] {m.exchange}</div>
                    ))
                  ) : (
                    <span className="text-slate-500">No MX records returned.</span>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Raw HTTP Headers JSON Output */}
            <Card className="bg-slate-900/60 border-slate-800 overflow-hidden font-mono text-xs">
              <CardHeader className="bg-slate-950/60 border-b border-slate-800 p-4">
                <CardTitle className="text-xs text-slate-400 uppercase font-bold">Raw Telemetry Dump</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <pre className="overflow-x-auto whitespace-pre-wrap text-indigo-300 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  {JSON.stringify(data.http.headers, null, 2)}
                </pre>
              </CardContent>
            </Card>

          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. POSIX-Powered Security Research Architecture.</p>
      </footer>
    </div>
  );
}
