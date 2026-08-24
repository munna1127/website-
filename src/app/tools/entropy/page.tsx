"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EntropyToolPage() {
  const [inputData, setInputData] = useState(
    "AryanTomar::SecurityResearch::ProtocolAudit::2026"
  );

  // Shannon Entropy Calculation: H(X) = -sum(P(x) * log2(P(x)))
  const metrics = useMemo(() => {
    if (!inputData) {
      return { entropy: 0, length: 0, uniqueBytes: 0, threatLevel: "None", statusColor: "text-slate-400" };
    }

    const len = inputData.length;
    const freqMap: { [key: string]: number } = {};

    for (let i = 0; i < len; i++) {
      const char = inputData[i];
      freqMap[char] = (freqMap[char] || 0) + 1;
    }

    let entropy = 0;
    const uniqueBytes = Object.keys(freqMap).length;

    for (const char in freqMap) {
      const p = freqMap[char] / len;
      entropy -= p * Math.log2(p);
    }

    // Classification based on information theory threshold (0 - 8 bits)
    let threatLevel = "Low Entropy (Plaintext / Source Code)";
    let statusColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    let alertText = "Standard human readable or structured plain format.";

    if (entropy > 7.2) {
      threatLevel = "Critical Anomaly (High Entropy / Ransomware Payload / Strong Crypto)";
      statusColor = "text-red-400 border-red-500/30 bg-red-500/10";
      alertText = "Warning: High randomness detected. Matches encrypted cipher stream or packed ransomware payload characteristics.";
    } else if (entropy > 5.5) {
      threatLevel = "High Entropy (Base64 / Compressed / Obfuscated Data)";
      statusColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";
      alertText = "Elevated entropy. Matches serialized tokens, compressed archives, or obfuscated bytecode.";
    } else if (entropy > 3.5) {
      threatLevel = "Medium Entropy (JSON / Structured Logs / HTML)";
      statusColor = "text-indigo-400 border-indigo-500/30 bg-indigo-500/10";
      alertText = "Normal distribution for structured formats, configuration files, and code structures.";
    }

    return {
      entropy: entropy.toFixed(4),
      length: len,
      uniqueBytes,
      threatLevel,
      statusColor,
      alertText,
      freqMap,
    };
  }, [inputData]);

  const loadSample = (type: string) => {
    switch (type) {
      case "plain":
        setInputData("The quick brown fox jumps over the lazy dog. Systems Automation and Linux POSIX environments.");
        break;
      case "code":
        setInputData('def analyze_stream(buffer):\n    return sum([b * 0x5f for b in buffer])');
        break;
      case "token":
        setInputData("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTI3IiwibmFtZSI6IkFyeWFuVG9tYXIifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
        break;
      case "encrypted":
        setInputData("9f8e7d6c5b4a3928170f9e8d7c6b5a4382910fae9d8c7b6a53421098e7d6c5b4a321");
        break;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 selection:bg-indigo-500 selection:text-white font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              🔬 Shannon Entropy Analyzer
            </h1>
            <p className="text-slate-400 text-sm mt-1">Information-Theory Threat Forensics & Anomaly Detector</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/about">
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
                About Researcher
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200">
                ← Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Calculated Entropy H(X)</CardDescription>
              <CardTitle className="text-3xl font-mono font-bold text-white mt-1">
                {metrics.entropy} <span className="text-xs text-slate-500 font-sans">bits/byte</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Payload Size</CardDescription>
              <CardTitle className="text-3xl font-mono font-bold text-indigo-400 mt-1">
                {metrics.length} <span className="text-xs text-slate-500 font-sans">characters</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Unique Alphabet Space</CardDescription>
              <CardTitle className="text-3xl font-mono font-bold text-emerald-400 mt-1">
                {metrics.uniqueBytes} <span className="text-xs text-slate-500 font-sans">symbols</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800 backdrop-blur">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Max Theoretical</CardDescription>
              <CardTitle className="text-3xl font-mono font-bold text-teal-400 mt-1">
                8.0000 <span className="text-xs text-slate-500 font-sans">bits/byte</span>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Threat Classification Banner */}
        <div className={`p-4 rounded-xl border ${metrics.statusColor} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider">Classification:</span>
            <p className="font-semibold text-base mt-0.5">{metrics.threatLevel}</p>
            <p className="text-xs text-slate-300 mt-1">{metrics.alertText}</p>
          </div>
          <div className="font-mono text-sm px-3 py-1.5 rounded bg-slate-950/60 border border-slate-800 self-start sm:self-auto">
            H(X): {metrics.entropy} / 8.00
          </div>
        </div>

        {/* Interactive Input Section */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
            <div>
              <CardTitle className="text-lg text-white">Live Data Buffer Input</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Paste raw payloads, base64 strings, or memory dumps to analyze in real time.
              </CardDescription>
            </div>
            {/* Sample Loaders */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => loadSample("plain")} size="sm" variant="outline" className="border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white">
                Plaintext
              </Button>
              <Button onClick={() => loadSample("code")} size="sm" variant="outline" className="border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white">
                Code
              </Button>
              <Button onClick={() => loadSample("token")} size="sm" variant="outline" className="border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white">
                JWT/Token
              </Button>
              <Button onClick={() => loadSample("encrypted")} size="sm" variant="outline" className="border-slate-800 bg-slate-950 text-xs text-slate-300 hover:text-white">
                Encrypted Dump
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              rows={6}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Paste binary dump, shellcode, or plain text buffer here..."
              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-4 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Theoretical Context Explanation */}
        <Card className="bg-slate-900/40 border-slate-800/80">
          <CardHeader>
            <CardTitle className="text-base text-white">📐 Theory & Mathematical Model</CardTitle>
            <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2 space-y-2">
              <p>
                In defensive systems forensics, <strong>Shannon Entropy</strong> measures the unpredictability of information content within a given byte sequence:
              </p>
              <p className="font-mono text-indigo-300 bg-slate-950/80 p-2.5 rounded border border-slate-800/80 text-xs">
                H(X) = - Σ [ P(x_i) * log₂(P(x_i)) ]
              </p>
              <p>
                Standard executable files and plaintext exhibit lower entropy (typically &lt; 5.0 bits/byte). In contrast, modern <strong>ransomware encryption sweeps</strong> and <strong>packed malicious payloads</strong> rapidly push entropy towards theoretical limits (~7.8+ bits/byte), enabling signature-less anomaly detection before disk-wide encryption completes.
              </p>
            </CardDescription>
          </CardHeader>
        </Card>

      </div>
    </main>
  );
}
