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
  const [outputTab, setOutputTab] = useState<"text" | "html" | "preview">("html");
  const [copied, setCopied] = useState(false);

  // Convert raw text into structured HTML elements
  const textToHtml = (text: string) => {
    if (!text.trim()) return "";
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const htmlLines = lines.map((line) => {
      if (line.length < 40 && (line.toUpperCase() === line || !line.endsWith("."))) {
        return `<h2>${line}</h2>`;
      }
      if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ")) {
        return `<li>${line.replace(/^[-*•]\s*/, "")}</li>`;
      }
      return `<p>${line}</p>`;
    });
    return htmlLines.join("\n");
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
            setStatusText(`Recognizing glyphs: ${Math.round(m.progress * 100)}%`);
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
      setStatusText("OCR Processing Error. Please try another image.");
    } finally {
      setLoading(false);
    }
  };

  const generatedHtml = textToHtml(extractedText);

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
            🧠 Neural OCR & Document Digitization
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Image to Text & HTML Converter
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Client-side optical character recognition engine that converts screenshots, documents, and book pages into structured semantic HTML or plaintext.
          </p>
        </div>

        {/* Upload & Controls */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white">Upload Target Document or Screenshot</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Supports PNG, JPG, WebP, and document captures. Processed locally in-browser.
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
                      {loading ? "Processing OCR..." : "⚡ Extract Text & Generate HTML"}
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
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex gap-2">
                {[
                  { id: "html", label: "Semantic HTML Code" },
                  { id: "preview", label: "Live HTML Preview" },
                  { id: "text", label: "Raw Plain Text" },
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

              <Button
                onClick={() => copyContent(outputTab === "html" ? generatedHtml : extractedText)}
                size="sm"
                variant="outline"
                className="border-slate-800 bg-slate-900 text-[10px] h-7 px-2.5 text-slate-300"
              >
                {copied ? "✓ Copied" : "Copy Output"}
              </Button>
            </div>

            {/* Tab 1: HTML Source */}
            {outputTab === "html" && (
              <Card className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden">
                <CardContent className="p-4">
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {generatedHtml}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Tab 2: Live HTML Preview */}
            {outputTab === "preview" && (
              <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
                <CardContent className="p-6 font-sans text-slate-200 prose prose-invert max-w-none space-y-3 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
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
        <p>© 2026 Aryan Tomar. Client-Side Neural OCR & Document Digitization Engine.</p>
      </footer>
    </div>
  );
}
