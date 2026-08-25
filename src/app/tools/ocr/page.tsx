"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createWorker } from "tesseract.js";

export default function OcrExtractorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [outputTab, setOutputTab] = useState<"page" | "code" | "text">("page");
  const [copied, setCopied] = useState(false);

  // Generate a Full Styled HTML Page Boilerplate with Tailwind CSS
  const generateCompleteHtmlPage = (text: string) => {
    if (!text.trim()) return "";
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    let contentHtml = "";
    let currentCardItems = "";

    lines.forEach((line, idx) => {
      const isHeader = line.length < 40 && (line.toUpperCase() === line || line.includes(":") || !line.endsWith("."));
      
      if (isHeader) {
        if (currentCardItems) {
          contentHtml += `<div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">${currentCardItems}</div>\n`;
          currentCardItems = "";
        }
        currentCardItems += `<h3 class="text-sm font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800/80 pb-2">${line}</h3>\n`;
      } else {
        currentCardItems += `<p class="text-xs text-slate-300 font-mono leading-relaxed">${line}</p>\n`;
      }
    });

    if (currentCardItems) {
      contentHtml += `<div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">${currentCardItems}</div>\n`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digitized OCR UI Report</title>
    <!-- Tailwind CSS CDN for instant styling -->
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white p-6 sm:p-10">
    <div class="max-w-4xl mx-auto space-y-8">
        
        <!-- Header Banner -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex items-center justify-between">
            <div class="space-y-1">
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-semibold">
                    ⚡ OCR Digitized UI Document
                </span>
                <h1 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Extracted Telemetry Report</h1>
                <p class="text-xs text-slate-400">Generated via Neural Vision Processing</p>
            </div>
            <div class="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>

        <!-- Content Grid Structure -->
        <div class="grid grid-cols-1 gap-4">
            ${contentHtml}
        </div>

        <!-- Footer -->
        <footer class="text-center text-xs text-slate-500 pt-6 border-t border-slate-800/80">
            <p>© 2026 Digitized Document Pipeline. Rendered with Tailwind CSS.</p>
        </footer>
    </div>
</body>
</html>`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    setExtractedText("");
    setProgress(0);
    setStatusText("");
  };

  const runOcr = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);
    setStatusText("Initializing neural OCR worker...");

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setStatusText(`Scanning glyphs: ${Math.round(m.progress * 100)}%`);
          } else {
            setStatusText(m.status);
          }
        },
      });

      const ret = await worker.recognize(image);
      setExtractedText(ret.data.text);
      await worker.terminate();
    } catch (err) {
      console.error(err);
      setStatusText("OCR Processing Error.");
    } finally {
      setLoading(false);
    }
  };

  const fullHtmlDocument = generateCompleteHtmlPage(extractedText);

  const downloadHtmlFile = () => {
    const blob = new Blob([fullHtmlDocument], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digitized_report_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🧠 Neural OCR & Styled UI Generator
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Image to Styled HTML Page Converter
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Convert screenshots and images into a fully styled, responsive HTML web page complete with modern card layouts and Tailwind CSS.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white">Upload Screenshot or Image</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Extract text and format it into a professional UI template instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />

            {image && (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={image}
                    alt="Upload Preview"
                    className="w-full sm:w-48 h-32 object-cover rounded-lg border border-slate-800 bg-slate-950"
                  />
                  <div className="w-full space-y-3">
                    <Button
                      onClick={runOcr}
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 shadow-lg shadow-indigo-600/30"
                    >
                      {loading ? "Extracting & Formatting..." : "⚡ Generate Styled HTML Page"}
                    </Button>

                    {loading && (
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>{statusText}</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-indigo-500 transition-all duration-200"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Showcase */}
        {extractedText && (
          <div className="space-y-4 animate-in fade-in duration-200 font-mono text-xs">
            
            {/* View Mode Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex gap-2">
                {[
                  { id: "page", label: "🖥️ Live UI Page Preview" },
                  { id: "code", label: "📄 HTML Source Code" },
                  { id: "text", label: "📝 Plain Text" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setOutputTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition text-xs ${
                      outputTab === t.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={downloadHtmlFile}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] h-7 px-3 font-bold"
                >
                  📥 Download .html File
                </Button>
                <Button
                  onClick={() => copyContent(outputTab === "code" ? fullHtmlDocument : extractedText)}
                  size="sm"
                  variant="outline"
                  className="border-slate-800 bg-slate-900 text-[11px] h-7 px-3 text-slate-300"
                >
                  {copied ? "✓ Copied" : "Copy Code"}
                </Button>
              </div>
            </div>

            {/* Tab 1: Live UI Page Preview inside sandboxed iframe */}
            {outputTab === "page" && (
              <Card className="bg-slate-900/60 border-slate-800 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-slate-950 p-2 border-b border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                    <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="ml-2 font-mono text-slate-500">sandbox://digitized-preview.html</span>
                  </div>
                  <iframe
                    srcDoc={fullHtmlDocument}
                    className="w-full h-[500px] bg-slate-950 border-0"
                    title="Live UI Preview"
                  />
                </CardContent>
              </Card>
            )}

            {/* Tab 2: Full HTML Source Code */}
            {outputTab === "code" && (
              <Card className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden">
                <CardContent className="p-4">
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed text-[11px]">
                    {fullHtmlDocument}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Tab 3: Raw Text */}
            {outputTab === "text" && (
              <Card className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden">
                <CardContent className="p-4">
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {extractedText}
                  </pre>
                </CardContent>
              </Card>
            )}

          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Client-Side Neural OCR & Styled UI Generator.</p>
      </footer>
    </div>
  );
}
