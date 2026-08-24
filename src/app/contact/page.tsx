"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    subject: "Security / Systems Collaboration",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFeedback("Message dispatched securely. I will respond to your channel shortly.");
        setFormData({
          name: "",
          contact: "",
          subject: "Security / Systems Collaboration",
          message: "",
        });
      } else {
        setStatus("error");
        setFeedback(data.error || "Failed to dispatch payload.");
      }
    } catch {
      setStatus("error");
      setFeedback("Network error. Please reach out directly via Telegram or Email.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 md:p-12 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
            🚀 Aryan Tomar
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/about">
              <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300">
                About Me
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
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            📡 Direct Transmission Channel
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Initiate Contact & Collaboration
          </h1>
          <p className="text-slate-400 text-sm">
            For security audits, systems automation architecture, or open-source engineering inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Direct Channels Sidebar */}
          <div className="space-y-4">
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-4">
                <CardDescription className="text-xs text-indigo-400 font-semibold uppercase">Telegram</CardDescription>
                <CardTitle className="text-sm text-white mt-1">
                  <a href="https://t.me/tomar_ji_99" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    @tomar_ji_99
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-4">
                <CardDescription className="text-xs text-indigo-400 font-semibold uppercase">Email Channel</CardDescription>
                <CardTitle className="text-sm text-white mt-1">
                  <a href="mailto:aryantomar4327@gmail.com" className="hover:underline text-xs break-all">
                    aryantomar4327@gmail.com
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader className="p-4">
                <CardDescription className="text-xs text-indigo-400 font-semibold uppercase">GitHub Repositories</CardDescription>
                <CardTitle className="text-sm text-white mt-1">
                  <a href="https://github.com/munna1127" target="_blank" rel="noopener noreferrer" className="hover:underline block">
                    munna1127
                  </a>
                  <a href="https://github.com/tomar-ji" target="_blank" rel="noopener noreferrer" className="hover:underline block text-xs text-slate-400 mt-1">
                    tomar-ji
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Contact Transmission Form */}
          <Card className="md:col-span-2 bg-slate-900/60 border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Send Message Payload</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Fill the transmission form below for priority direct response.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === "success" && (
                  <div className="p-3 text-xs rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                    ✓ {feedback}
                  </div>
                )}
                {status === "error" && (
                  <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
                    ✕ {feedback}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase">Your Name *</label>
                    <Input
                      required
                      placeholder="e.g. Alex Miller"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase">Email / Telegram *</label>
                    <Input
                      required
                      placeholder="email@example.com or @handle"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Message Payload *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe project requirements, security scope, or inquiry details..."
                    className="w-full rounded-md bg-slate-950 border border-slate-800 p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/25"
                >
                  {status === "sending" ? "Dispatching Payload..." : "Transmit Message →"}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>

      </div>
    </main>
  );
}
