"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function EncoderToolPage() {
  const [activeTab, setActiveTab] = useState<"transforms" | "jwt">("transforms");
  const [inputPayload, setInputPayload] = useState("admin:session_token_xyz_2026");
  const [jwtInput, setJwtInput] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFyeWFuIFRvbWFyIiwicm9sZSI6InNlY3VyaXR5X2FkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.4-x2Q2X_example_signature_hash"
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Payload Encoders / Decoders
  const transforms = {
    "Base64 Encode": (() => {
      try { return btoa(unescape(encodeURIComponent(inputPayload))); } catch { return "Error encoding to Base64"; }
    })(),
    "Base64 Decode": (() => {
      try { return decodeURIComponent(escape(atob(inputPayload))); } catch { return "Invalid Base64 payload"; }
    })(),
    "URL Encoded": (() => {
      try { return encodeURIComponent(inputPayload); } catch { return "Error encoding URL"; }
    })(),
    "URL Decoded": (() => {
      try { return decodeURIComponent(inputPayload); } catch { return "Invalid URL encoded string"; }
    })(),
    "Hex Dump": (() => {
      try {
        return Array.from(new TextEncoder().encode(inputPayload))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");
      } catch { return "Error converting to Hex"; }
    })(),
    "Binary Stream": (() => {
      try {
        return Array.from(new TextEncoder().encode(inputPayload))
          .map((b) => b.toString(2).padStart(8, "0"))
          .join(" ");
      } catch { return "Error converting to Binary"; }
    })(),
  };

  // JWT Decoder Logic
  const parseJwt = (token: string) => {
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      return { error: "Invalid JWT format. Expected header.payload.signature" };
    }

    try {
      const decodePart = (str: string) => {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const jsonStr = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonStr);
      };

      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);

      let isExpired = false;
      let expDate = null;
      if (payload.exp) {
        expDate = new Date(payload.exp * 1000);
        isExpired = Date.now() > payload.exp * 1000;
      }

      return { header, payload, signature: parts[2], isExpired, expDate };
    } catch {
      return { error: "Failed to parse JWT JSON payloads." };
    }
  };

  const jwtParsed = parseJwt(jwtInput);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            ⚙️ Security Payload Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Payload Transcoder & JWT Inspector
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Multi-encoding format transformation, payload sanitization, and cryptographic JSON Web Token claim inspection.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("transforms")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "transforms"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            Multi-Format Transcoder
          </button>
          <button
            onClick={() => setActiveTab("jwt")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "jwt"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            JWT Token Inspector
          </button>
        </div>

        {/* Transcoder Mode */}
        {activeTab === "transforms" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300 font-semibold uppercase">Source Input</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Enter plain string, Base64 token, Hex, or URL payload
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  rows={3}
                  value={inputPayload}
                  onChange={(e) => setInputPayload(e.target.value)}
                  placeholder="Enter payload string..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(transforms).map(([name, value]) => (
                <Card key={name} className="bg-slate-900/60 border-slate-800 shadow-xl">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold text-indigo-400 font-mono">{name}</CardTitle>
                    <Button
                      onClick={() => copyToClipboard(value, name)}
                      size="sm"
                      variant="outline"
                      className="border-slate-800 bg-slate-950 hover:bg-slate-800 text-[11px] h-7 px-2.5 text-slate-300"
                    >
                      {copiedKey === name ? "✓ Copied" : "Copy"}
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 pt-1">
                    <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80 overflow-x-auto whitespace-pre-wrap break-all max-h-28">
                      {value}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* JWT Inspector Mode */}
        {activeTab === "jwt" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-300 font-semibold uppercase">JWT Encoded String</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Paste full JSON Web Token (Header.Payload.Signature)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  rows={3}
                  value={jwtInput}
                  onChange={(e) => setJwtInput(e.target.value)}
                  placeholder="Paste JWT token here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-purple-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed break-all"
                />
              </CardContent>
            </Card>

            {jwtParsed.error ? (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                ✕ {jwtParsed.error}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Expiration Banner */}
                {jwtParsed.expDate && (
                  <div className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                    jwtParsed.isExpired
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  }`}>
                    <span>Expiration Status: {jwtParsed.isExpired ? "EXPIRED" : "ACTIVE / VALID"}</span>
                    <span>Expiry: {jwtParsed.expDate.toUTCString()}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Header JSON */}
                  <Card className="bg-slate-900/60 border-slate-800">
                    <CardHeader className="p-4 border-b border-slate-800">
                      <CardTitle className="text-xs text-pink-400 font-bold uppercase">Header (Algorithm & Token Type)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <pre className="bg-slate-950 p-3 rounded border border-slate-800 text-pink-300 overflow-x-auto">
                        {JSON.stringify(jwtParsed.header, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>

                  {/* Payload Claims */}
                  <Card className="bg-slate-900/60 border-slate-800">
                    <CardHeader className="p-4 border-b border-slate-800">
                      <CardTitle className="text-xs text-indigo-400 font-bold uppercase">Payload (Data Claims)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <pre className="bg-slate-950 p-3 rounded border border-slate-800 text-indigo-300 overflow-x-auto">
                        {JSON.stringify(jwtParsed.payload, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Client-Side Cryptographic Inspection Engine.</p>
      </footer>
    </div>
  );
}
