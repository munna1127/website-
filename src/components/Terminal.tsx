"use client";

import { useState, useRef, useEffect } from "react";

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: "welcome",
      output: (
        <div className="text-slate-300 space-y-1">
          <p className="text-emerald-400 font-bold"> Aryan Tomar POSIX Shell v1.0.4 (Android Termux)</p>
          <p className="text-slate-400 text-xs">Type <span className="text-indigo-400 font-mono">help</span> to view available system commands.</p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    switch (cmd) {
      case "help":
        output = (
          <div className="text-slate-300 text-xs space-y-1">
            <p className="text-indigo-300 font-semibold">Available Commands:</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">whoami</span> - Display developer profile summary</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">skills</span> - Dump full technical skill matrix</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">projects</span> - List major security & automation systems</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">contact</span> - Output direct communication channels</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">clear</span> - Flush terminal screen buffer</p>
          </div>
        );
        break;

      case "whoami":
        output = (
          <div className="text-slate-300 text-xs leading-relaxed space-y-1">
            <p className="text-white font-semibold">Aryan Tomar</p>
            <p className="text-indigo-400">Security Researcher & Systems Automation Engineer</p>
            <p className="text-slate-400">Self-taught systems programmer engineering core frameworks & utilities strictly inside mobile Termux sandboxes.</p>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="text-slate-300 text-xs space-y-1 font-mono">
            <p><span className="text-indigo-400">[Languages]</span> Python 3.x, JavaScript (Node.js), TypeScript</p>
            <p><span className="text-indigo-400">[Backend]</span> Flask, Next.js App Router, REST APIs, Session Routing</p>
            <p><span className="text-indigo-400">[Environments]</span> Termux POSIX Sandbox, Linux CLI, Android Internals</p>
            <p><span className="text-indigo-400">[Defense]</span> Shannon Entropy Modeling, Protocol Forensics, Automation</p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="text-slate-300 text-xs space-y-1.5">
            <p>🛡️ <span className="text-indigo-400 font-semibold">Secure-AuthSim Core:</span> Identity validation & token exhaustion sim.</p>
            <p>📡 <span className="text-indigo-400 font-semibold">OSINT-Nexus:</span> Multi-threaded asynchronous BGP & routing consolidator.</p>
            <p>🛰️ <span className="text-indigo-400 font-semibold">GeoAudit Telemetry:</span> Asynchronous Layer-3 compliance log auditor.</p>
            <p>⚡ <span className="text-indigo-400 font-semibold">Entropy Defense Core:</span> Signature-less high-entropy storage anomaly detector.</p>
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="text-slate-300 text-xs space-y-1">
            <p>📧 Email: <a href="mailto:aryantomar4327@gmail.com" className="text-indigo-400 hover:underline">aryantomar4327@gmail.com</a></p>
            <p>✈️ Telegram: <a href="https://t.me/tomar_ji_99" target="_blank" className="text-indigo-400 hover:underline">@tomar_ji_99</a></p>
            <p>🐙 GitHub: <a href="https://github.com/munna1127" target="_blank" className="text-indigo-400 hover:underline">munna1127</a> | <a href="https://github.com/tomar-ji" target="_blank" className="text-indigo-400 hover:underline">tomar-ji</a></p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "sudo":
        output = <p className="text-red-400 text-xs font-mono">permission denied: guest does not have root privilege.</p>;
        break;

      default:
        output = <p className="text-red-400 text-xs font-mono">bash: command not found: {cmd}. Type &apos;help&apos; for command list.</p>;
        break;
    }

    setHistory((prev) => [...prev, { command: input, output }]);
    setInput("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur font-mono">
      {/* Window Title Bar */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
        </div>
        <span className="text-xs text-slate-400 select-none">aryan@termux-posix:~</span>
        <div className="w-10"></div>
      </div>

      {/* Terminal Screen Body */}
      <div className="p-4 sm:p-6 min-h-[260px] max-h-[380px] overflow-y-auto space-y-4 text-sm">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-bold">aryan@termux:~$</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}

        {/* Live Prompt Input */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 font-bold text-xs select-none">aryan@termux:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help' or command..."
            className="flex-1 bg-transparent text-white text-xs focus:outline-none placeholder:text-slate-600 font-mono caret-indigo-400"
            autoFocus
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
