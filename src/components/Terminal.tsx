"use client";

import { useState, useRef, useEffect } from "react";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Aryan Tomar POSIX Shell v1.0.4 (Android Termux)",
    "Type 'help' to view available system commands or 'cli' for remote cURL output.",
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, `aryan@termux:~$ ${input}`];

    switch (cmd) {
      case "help":
        newHistory.push(
          "Available Commands:",
          "  whoami       - Display current researcher profile",
          "  skills       - Print verified systems engineering stack",
          "  projects     - List production repositories",
          "  cli / curl   - Fetch raw ANSI cURL endpoint output",
          "  status       - View live database & edge engine ping",
          "  clear        - Flush console screen"
        );
        break;
      case "whoami":
        newHistory.push(
          "Aryan Tomar - Security Researcher & Systems Automation Engineer.",
          "Building defense architectures, threat telemetry, and backend systems via mobile POSIX."
        );
        break;
      case "skills":
        newHistory.push(
          "Languages: JavaScript (ESNext), TypeScript, Python 3.x, SQL, POSIX Shell",
          "Backend:   Next.js 16 (App Router), Node.js, Express, Flask, REST APIs",
          "Database:  Neon Serverless PostgreSQL, Prisma ORM, Raw pg-pool"
        );
        break;
      case "projects":
        newHistory.push(
          "• Secure-AuthSim Core (github.com/munna1127/secure-authsim-core)",
          "• OSINT-Nexus Telemetry (github.com/munna1127/osint-nexus-core)",
          "• Shannon Entropy Defense (/tools/entropy)",
          "• DNS Security Recon (/tools/recon)"
        );
        break;
      case "status":
        newHistory.push("Live Telemetry: All Systems Operational. Check /status for real-time latency.");
        break;
      case "cli":
      case "curl":
        newHistory.push("Terminal Endpoint: Run 'curl https://website-beta-rose-83.vercel.app/api/cli' from any bash terminal.");
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        newHistory.push(`sh: command not found: ${cmd}. Type 'help' for valid commands.`);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl font-mono text-xs text-left">
      {/* Shell Titlebar */}
      <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
        </div>
        <span className="text-[11px] text-slate-400">aryan@termux-posix:~</span>
        <div className="w-10"></div>
      </div>

      {/* Output Screen */}
      <div className="p-4 space-y-1.5 min-h-[160px] max-h-[260px] overflow-y-auto leading-relaxed">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={
              line.startsWith("aryan@termux")
                ? "text-emerald-400 font-semibold"
                : line.startsWith("sh:")
                ? "text-red-400"
                : "text-slate-300"
            }
          >
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Prompt */}
      <form onSubmit={handleCommand} className="border-t border-slate-800/80 px-4 py-2 bg-slate-950 flex items-center gap-2">
        <span className="text-emerald-400 font-bold">aryan@termux:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type 'help' or command..."
          className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-slate-600 font-mono text-xs"
        />
      </form>
    </div>
  );
}
