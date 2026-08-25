"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MediaToolsPage() {
  const [activeTab, setActiveTab] = useState<"img2pdf" | "transcode" | "magicbyte" | "metadata">("img2pdf");

  // Image to PDF State
  const [pdfImages, setPdfImages] = useState<{ name: string; dataUrl: string; width: number; height: number }[]>([]);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Transcoder State
  const [transcodeFile, setTranscodeFile] = useState<{ name: string; url: string; raw: File; size: number } | null>(null);
  const [targetFormat, setTargetFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/webp");
  const [quality, setQuality] = useState<number>(0.9);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);

  // Magic Byte State
  const [magicHex, setMagicHex] = useState<string>("");
  const [detectedType, setDetectedType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  // Metadata Stripper State
  const [strippedUrl, setStrippedUrl] = useState<string | null>(null);

  // 1. Image to PDF Logic (Client-Side Vector/Raster PDF 1.4 Builder)
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          setPdfImages((prev) => [
            ...prev,
            { name: file.name, dataUrl: ev.target?.result as string, width: img.width, height: img.height },
          ]);
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const generatePDF = async () => {
    if (pdfImages.length === 0) return;
    setGeneratingPdf(true);

    try {
      // Build pure client-side PDF document stream
      let pdfContent = `%PDF-1.4\n`;
      const objectOffsets: number[] = [];
      let currentOffset = 0;

      const addObject = (content: string) => {
        objectOffsets.push(pdfContent.length);
        pdfContent += content + "\n";
      };

      // 1: Catalog
      addObject(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);

      // Kids string & Page Objects
      const pageObjIds: number[] = [];
      let objCounter = 3;

      const pageDetails: { pageId: number; imageObjId: number; streamObjId: number; img: typeof pdfImages[0] }[] = [];

      for (const img of pdfImages) {
        const pageId = objCounter++;
        const imageObjId = objCounter++;
        const streamObjId = objCounter++;
        pageObjIds.push(pageId);
        pageDetails.push({ pageId, imageObjId, streamObjId, img });
      }

      // 2: Pages tree
      addObject(`2 0 obj\n<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pdfImages.length} >>\nendobj`);

      for (const item of pageDetails) {
        const w = 595.28; // A4 Width in pts
        const h = (item.img.height * w) / item.img.width; // Proportional Height

        // Page Object
        addObject(`${item.pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w.toFixed(2)} ${h.toFixed(2)}] /Contents ${item.streamObjId} 0 R /Resources << /XObject << /Im1 ${item.imageObjId} 0 R >> >> >>\nendobj`);

        // Image XObject (Extract clean JPEG data)
        const canvas = document.createElement("canvas");
        canvas.width = item.img.width;
        canvas.height = item.img.height;
        const ctx = canvas.getContext("2d");
        const baseImg = new Image();
        baseImg.src = item.img.dataUrl;
        await new Promise((res) => { baseImg.onload = res; });
        ctx?.drawImage(baseImg, 0, 0);
        const jpegData = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
        const binaryJpeg = atob(jpegData);

        addObject(`${item.imageObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${item.img.width} /Height ${item.img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${binaryJpeg.length} >>\nstream\n${binaryJpeg}\nendstream\nendobj`);

        // Content Stream for Page Drawing
        const streamData = `q\n${w.toFixed(2)} 0 0 ${h.toFixed(2)} 0 0 cm\n/Im1 Do\nQ`;
        addObject(`${item.streamObjId} 0 obj\n<< /Length ${streamData.length} >>\nstream\n${streamData}\nendstream\nendobj`);
      }

      // XRef Table
      const xrefOffset = pdfContent.length;
      pdfContent += `xref\n0 ${objectOffsets.length + 1}\n0000000000 65535 f \n`;
      for (const offset of objectOffsets) {
        pdfContent += `${offset.toString().padStart(10, "0")} 00000 n \n`;
      }

      // Trailer
      pdfContent += `trailer\n<< /Size ${objectOffsets.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

      // Trigger Download
      const blob = new Blob([pdfContent], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compiled_document_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF stream.");
    } finally {
      setGeneratingPdf(false);
    }
  };

  // 2. Transcode Engine
  const handleTranscodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    setTranscodeFile({
      name: f.name,
      url: URL.createObjectURL(f),
      raw: f,
      size: f.size,
    });
    setConvertedUrl(null);
  };

  const processTranscode = () => {
    if (!transcodeFile) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setConvertedUrl(URL.createObjectURL(blob));
          setConvertedSize(blob.size);
        },
        targetFormat,
        quality
      );
    };
    img.src = transcodeFile.url;
  };

  // 3. Magic Byte Analyzer
  const handleMagicByteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    setFileName(f.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const buffer = ev.target?.result as ArrayBuffer;
      const uint = new Uint8Array(buffer.slice(0, 16));
      const hex = Array.from(uint).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
      setMagicHex(hex);

      // Signature Matching
      if (hex.startsWith("89 50 4E 47 0D 0A 1A 0A")) setDetectedType("PNG Image (.png)");
      else if (hex.startsWith("FF D8 FF")) setDetectedType("JPEG / JPG Image (.jpg)");
      else if (hex.startsWith("25 50 44 46")) setDetectedType("Adobe PDF Document (.pdf)");
      else if (hex.startsWith("50 4B 03 04")) setDetectedType("ZIP Archive / DOCX / XLSX / APK (.zip)");
      else if (hex.startsWith("52 61 72 21 1A 07")) setDetectedType("RAR Compressed Archive (.rar)");
      else if (hex.startsWith("47 49 46 38")) setDetectedType("GIF Animation (.gif)");
      else if (hex.startsWith("52 49 46 46") && hex.includes("57 45 42 50")) setDetectedType("WebP Image (.webp)");
      else if (hex.startsWith("4D 5A")) setDetectedType("Windows Executable / DLL (.exe, .dll)");
      else if (hex.startsWith("7F 45 4C 46")) setDetectedType("Linux ELF Binary (.bin, .elf)");
      else setDetectedType("Unknown Binary Stream / Generic Data");
    };
    reader.readAsArrayBuffer(f.slice(0, 32));
  };

  // 4. Metadata Stripper
  const handleMetadataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      // Repaint onto clean canvas wipes all EXIF/GPS tags
      canvas.toBlob((blob) => {
        if (!blob) return;
        setStrippedUrl(URL.createObjectURL(blob));
      }, "image/png");
    };
    img.src = url;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            ⚡ Zero-Server Client Media Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Universal Media & File Suite
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Client-side image-to-PDF compilation, format transcoding, binary magic-byte detection, and privacy sanitization.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-slate-800 pb-3">
          {[
            { id: "img2pdf", label: "📄 Image to PDF" },
            { id: "transcode", label: "🔄 Image Converter" },
            { id: "magicbyte", label: "🔍 Magic Byte ID" },
            { id: "metadata", label: "🛡️ EXIF Stripper" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. Image to PDF Studio */}
        {activeTab === "img2pdf" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base text-white">Select Images to Compile</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Select one or more PNG, JPG, or WebP files to bundle into a single PDF document.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePdfUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />

                {pdfImages.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Pages Queued: {pdfImages.length}</span>
                      <button onClick={() => setPdfImages([])} className="text-red-400 hover:underline">
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {pdfImages.map((img, i) => (
                        <div key={i} className="relative rounded-lg border border-slate-800 overflow-hidden bg-slate-950 p-2 space-y-1">
                          <img src={img.dataUrl} alt={img.name} className="h-24 w-full object-cover rounded" />
                          <p className="text-[10px] text-slate-300 truncate font-mono">Page {i + 1}: {img.name}</p>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={generatePDF}
                      disabled={generatingPdf}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 shadow-lg shadow-indigo-600/25"
                    >
                      {generatingPdf ? "Compiling PDF Stream..." : "📥 Download Compiled PDF"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 2. Image Transcoder & Compressor */}
        {activeTab === "transcode" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base text-white">Universal Image Transcoder</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Convert between PNG, JPG, and WebP with real-time compression optimization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTranscodeUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />

                {transcodeFile && (
                  <div className="space-y-4 pt-3 border-t border-slate-800 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-400">Target Output Format:</label>
                        <select
                          value={targetFormat}
                          onChange={(e) => setTargetFormat(e.target.value as any)}
                          className="w-full h-9 rounded bg-slate-950 border border-slate-800 text-white px-3 focus:outline-none"
                        >
                          <option value="image/webp">WebP (Optimized Modern Web)</option>
                          <option value="image/png">PNG (Lossless Transparent)</option>
                          <option value="image/jpeg">JPEG (Universal Compact)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-400">Quality Compression ({Math.round(quality * 100)}%):</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={quality}
                          onChange={(e) => setQuality(parseFloat(e.target.value))}
                          className="w-full accent-indigo-500 mt-2"
                        />
                      </div>
                    </div>

                    <Button onClick={processTranscode} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                      ⚡ Convert & Process
                    </Button>

                    {convertedUrl && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span>✓ Conversion Complete</span>
                          <span>{(convertedSize / 1024).toFixed(1)} KB ({(100 - (convertedSize / transcodeFile.size) * 100).toFixed(0)}% saved)</span>
                        </div>
                        <a
                          href={convertedUrl}
                          download={`converted_${Date.now()}.${targetFormat.split("/")[1]}`}
                          className="block text-center w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                        >
                          📥 Download {targetFormat.split("/")[1].toUpperCase()}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 3. Magic Byte ID */}
        {activeTab === "magicbyte" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base text-white">Magic Byte Header Inspector</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Upload any file to read its hexadecimal binary header and determine its true unmasked format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  onChange={handleMagicByteUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />

                {magicHex && (
                  <div className="space-y-4 pt-3 font-mono text-xs">
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-slate-500">File Analyzed: <span className="text-white">{fileName}</span></div>
                      <div className="text-slate-500">First 16 Bytes (Hex Header):</div>
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-indigo-300 tracking-wider">
                        {magicHex}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
                      <span className="text-slate-400">Verified Format Signature:</span>
                      <span className="text-indigo-300 font-bold">{detectedType}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 4. Privacy EXIF Stripper */}
        {activeTab === "metadata" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-base text-white">EXIF & Geo-Location Stripper</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Strip camera serials, lens parameters, timestamps, and GPS tracking coordinates prior to publishing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMetadataUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />

                {strippedUrl && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 text-xs font-mono">
                    <div className="text-emerald-400 font-bold">✓ Privacy Scrub Completed: GPS & Device EXIF Tags Purged</div>
                    <a
                      href={strippedUrl}
                      download={`sanitized_${Date.now()}.png`}
                      className="block text-center w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                    >
                      📥 Download Sanitized Image
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Client-Side Cryptographic & Media Engine.</p>
      </footer>
    </div>
  );
}
