"from client";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-indigo-500">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="font-extrabold text-xl text-white inline-flex items-center gap-2">
            🚀 Aryan Tomar
          </Link>
          <p className="text-slate-400 text-xs">Restricted Access • Admin Authorization Required</p>
        </div>

        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-white">🔐 Security Authentication</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Enter your master password to access the dashboard and message inbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
                  ✕ {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase">Master Password</label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/25"
              >
                {loading ? "Authenticating..." : "Authorize Session →"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
