"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TelemetryData {
  timestamp: string;
  services: {
    database: { provider: string; status: string; latencyMs: number };
    edgeRuntime: { provider: string; status: string; region: string; nodeEnv: string };
    apiGateway: { status: string; roundTripMs: number };
  };
}

export default function StatusPage() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/status");
      const json = await res.json();
      if (json.success) {
        setData(json);
        setLastCheck(new Date());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkTelemetry();
    const interval = setInterval(checkTelemetry, 15000); // auto-poll every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 selection:bg-indigo-500 selection:text-white font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
            🚀 Aryan Tomar
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/projects">
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
                Projects
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
                ← Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Systems Health & Telemetry
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live serverless diagnostics and PostgreSQL database ping metrics.
            </p>
          </div>
          <Button
            onClick={checkTelemetry}
            disabled={loading}
            variant="outline"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white self-start sm:self-auto text-xs"
          >
            {loading ? "Probing Endpoints..." : "↻ Ping Diagnostics"}
          </Button>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Database Card */}
          <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs text-slate-400 uppercase font-semibold">PostgreSQL Engine</CardDescription>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              </div>
              <CardTitle className="text-xl text-white font-mono mt-1">
                {data?.services.database.latencyMs ?? "--"} <span className="text-xs text-slate-500 font-sans">ms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-400 space-y-1">
              <p>Provider: <span className="text-slate-200">Neon Cloud</span></p>
              <p>Status: <span className="text-emerald-400">{data?.services.database.status || "Checking..."}</span></p>
            </CardContent>
          </Card>

          {/* Edge Serverless */}
          <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs text-slate-400 uppercase font-semibold">Serverless Edge</CardDescription>
                <span className="h-2.5 w-2.5 rounded-full bg-teal-400"></span>
              </div>
              <CardTitle className="text-xl text-white font-mono mt-1">
                {data?.services.edgeRuntime.region ?? "Edge Global"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-400 space-y-1">
              <p>Host: <span className="text-slate-200">Vercel Global CDN</span></p>
              <p>Status: <span className="text-teal-400">{data?.services.edgeRuntime.status || "Operational"}</span></p>
            </CardContent>
          </Card>

          {/* API Gateway */}
          <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs text-slate-400 uppercase font-semibold">API Round-Trip</CardDescription>
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
              </div>
              <CardTitle className="text-xl text-white font-mono mt-1">
                {data?.services.apiGateway.roundTripMs ?? "--"} <span className="text-xs text-slate-500 font-sans">ms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-400 space-y-1">
              <p>Protocol: <span className="text-slate-200">HTTPS / HTTP/2</span></p>
              <p>Status: <span className="text-indigo-400">Live Synchronized</span></p>
            </CardContent>
          </Card>

        </div>

        {/* Telemetry Diagnostics Output */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl overflow-hidden font-mono">
          <CardHeader className="bg-slate-950/60 border-b border-slate-800/80 py-3 px-4 flex flex-row items-center justify-between">
            <span className="text-xs text-slate-400 font-bold uppercase">Raw Diagnostic Buffer</span>
            <span className="text-[11px] text-slate-500">Auto-poll: 15s | Last: {lastCheck.toLocaleTimeString()}</span>
          </CardHeader>
          <CardContent className="p-4 text-xs text-slate-300">
            <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-indigo-300/90 bg-slate-950/80 p-4 rounded-lg border border-slate-800/80">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
