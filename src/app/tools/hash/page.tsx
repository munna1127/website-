"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HashToolPage() {
  const [input, setInput] = useState("admin:secret_payload_2026");
  const [hashes, setHashes] = useState<{ [key: string]: string }>({});
  const [verifyHash, setVerifyHash] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const computeHashes = async (text: string) => {
    if (!text) {
      setHashes({});
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const algorithms = [
      { name: "SHA-256", key: "sha256" },
      { name: "SHA-512", key: "sha512" },
      { name: "SHA-384", key: "sha384" },
      { name: "SHA-1", key: "sha1" },
    ];

    const results: { [key: string]: string } = {};

    for (const algo of algorithms) {
      const buffer = await crypto.subtle.digest(algo.name, data);
      const hashArray = Array.from(new Uint8Array(buffer));
      results[algo.name] = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    setHashes(results);
  };

  useEffect(() => {
    computeHashes(input);
  }, [input]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isMatched = (hashVal: string) => {
    if (!verifyHash.trim()) return null;
    return hashVal.toLowerCase() === verifyHash.trim().toLowerCase();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🔐 Cryptographic Checksums
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cryptographic Hash & Integrity Verifier
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Client-side cryptographic digest generator using native W3C Web Crypto Subsystem. Zero server transmission ensures complete payload privacy.
          </p>
        </div>

        {/* Payload Input */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-300 font-semibold uppercase">Source Payload</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Enter string or token data ({new TextEncoder().encode(input).length} bytes)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text or security payload to hash..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
            
            {/* Hash Verification Input */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="text-xs text-slate-400 block mb-1 font-medium">Verify Target Hash (Integrity Check):</label>
              <Input
                placeholder="Paste external checksum to compare match..."
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs font-mono text-white placeholder:text-slate-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Calculated Digests */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight">
            Generated Cryptographic Digests
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {Object.entries(hashes).map(([algo, hashVal]) => {
              const matched = isMatched(hashVal);
              return (
                <Card key={algo} className={`bg-slate-900/60 transition ${matched === true ? "border-emerald-500/60 bg-emerald-950/10" : "border-slate-800"}`}>
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-indigo-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                        {algo}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {hashVal.length * 4} bits ({hashVal.length} chars)
                      </span>
                    </div>

                    {matched === true && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                        ● Checksum Verified Match
                      </span>
                    )}
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs font-mono text-slate-300 break-all bg-slate-950/80 p-2.5 rounded-md border border-slate-800/80 w-full">
                      {hashVal}
                    </span>
                    <Button
                      onClick={() => copyToClipboard(hashVal, algo)}
                      size="sm"
                      variant="outline"
                      className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 shrink-0 h-9"
                    >
                      {copiedKey === algo ? "✓ Copied!" : "Copy"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Client-Side Web Crypto Subsystem.</p>
      </footer>
    </div>
  );
}
