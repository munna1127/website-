"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MAGIC_DELIMITER = "::STEGO_EOF::";

export default function StegoPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  // Encode State
  const [encodeImg, setEncodeImg] = useState<string | null>(null);
  const [payloadText, setPayloadText] = useState("CONFIDENTIAL: Vector operational at 28.6139, 77.2090. Key: 0x9F41");
  const [capacityBytes, setCapacityBytes] = useState(0);
  const [encodedResultUrl, setEncodedResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Decode State
  const [decodeImg, setDecodeImg] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle Encode Image Upload
  const handleEncodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setEncodeImg(url);
    setEncodedResultUrl(null);

    const img = new Image();
    img.onload = () => {
      // 3 channels (RGB) per pixel, 1 bit per channel = 3 bits per pixel = (W * H * 3) / 8 bytes
      const maxBytes = Math.floor((img.width * img.height * 3) / 8);
      setCapacityBytes(maxBytes);
    };
    img.src = url;
  };

  // Perform LSB Encoding
  const handleEncode = () => {
    if (!encodeImg || !payloadText.trim()) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      // Encode Payload + Delimiter to binary string
      const fullPayload = payloadText + MAGIC_DELIMITER;
      const encoder = new TextEncoder();
      const bytes = encoder.encode(fullPayload);

      let bitIndex = 0;
      const totalBits = bytes.length * 8;

      if (totalBits > (data.length / 4) * 3) {
        alert("Payload exceeds maximum pixel capacity of this image!");
        setIsProcessing(false);
        return;
      }

      for (let i = 0; i < data.length && bitIndex < totalBits; i++) {
        // Skip Alpha channel (every 4th byte)
        if ((i + 1) % 4 === 0) continue;

        const byteIndex = Math.floor(bitIndex / 8);
        const bitOffset = 7 - (bitIndex % 8);
        const bit = (bytes[byteIndex] >> bitOffset) & 1;

        // Replace LSB (Least Significant Bit)
        data[i] = (data[i] & ~1) | bit;
        bitIndex++;
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setEncodedResultUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
      }, "image/png"); // PNG format preserves lossless LSB bits
    };
    img.src = encodeImg;
  };

  // Handle Decode Image Upload
  const handleDecodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setDecodeImg(url);
    setExtractedMessage(null);
    setDecodeError(null);
  };

  // Perform LSB Decoding
  const handleDecode = () => {
    if (!decodeImg) return;
    setIsProcessing(true);
    setDecodeError(null);
    setExtractedMessage(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      const rawBytes: number[] = [];
      let currentByte = 0;
      let bitCount = 0;
      let decodedStr = "";

      for (let i = 0; i < data.length; i++) {
        if ((i + 1) % 4 === 0) continue; // Skip Alpha

        const bit = data[i] & 1;
        currentByte = (currentByte << 1) | bit;
        bitCount++;

        if (bitCount === 8) {
          rawBytes.push(currentByte);
          bitCount = 0;
          currentByte = 0;

          // Check for delimiter every 16 bytes for efficiency
          if (rawBytes.length % 16 === 0 || rawBytes.length > 500000) {
            const tempStr = new TextDecoder().decode(new Uint8Array(rawBytes));
            if (tempStr.includes(MAGIC_DELIMITER)) {
              decodedStr = tempStr.split(MAGIC_DELIMITER)[0];
              break;
            }
          }
        }
      }

      if (!decodedStr && rawBytes.length > 0) {
        const fullStr = new TextDecoder().decode(new Uint8Array(rawBytes));
        if (fullStr.includes(MAGIC_DELIMITER)) {
          decodedStr = fullStr.split(MAGIC_DELIMITER)[0];
        }
      }

      if (decodedStr) {
        setExtractedMessage(decodedStr);
      } else {
        setDecodeError("No valid steganographic payload detected with standard delimiter header.");
      }
      setIsProcessing(false);
    };
    img.src = decodeImg;
  };

  const copyPayload = () => {
    if (!extractedMessage) return;
    navigator.clipboard.writeText(extractedMessage);
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
            🕵️ Low-Level Binary Forensics & Covert Comms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            LSB Image Steganography Engine
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Conceal and extract encrypted or plaintext payloads inside uncompressed pixel bitplanes using Least Significant Bit (LSB) carrier encoding.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 font-mono text-xs">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              mode === "encode"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            🔒 Conceal Payload (Encode)
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              mode === "decode"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            🔓 Extract Secret (Decode)
          </button>
        </div>

        {/* ENCODE MODE */}
        {mode === "encode" && (
          <div className="space-y-6 animate-in fade-in duration-200 font-mono text-xs">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white font-bold uppercase">1. Carrier Image Selection</CardTitle>
                <CardDescription className="text-xs text-slate-400 font-sans">
                  Upload a cover PNG/JPG image to serve as the carrier steganogram.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEncodeUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />

                {encodeImg && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Carrier Bitplane Capacity:</span>
                    <span className="text-emerald-400 font-bold">{(capacityBytes / 1024).toFixed(1)} KB ({capacityBytes.toLocaleString()} bytes)</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white font-bold uppercase">2. Secret Text / Key Payload</CardTitle>
                <CardDescription className="text-xs text-slate-400 font-sans">
                  Enter confidential telemetry, credentials, or coordinates to hide into pixel bytes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  rows={4}
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.target.value)}
                  placeholder="Type secret payload message..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />

                <Button
                  onClick={handleEncode}
                  disabled={!encodeImg || !payloadText.trim() || isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 shadow-lg shadow-indigo-600/30"
                >
                  {isProcessing ? "Injecting Payload into Bitplane..." : "⚡ Embed Payload & Generate Steganogram"}
                </Button>
              </CardContent>
            </Card>

            {encodedResultUrl && (
              <Card className="bg-gradient-to-r from-emerald-950/30 via-slate-900/70 to-slate-900/70 border-emerald-500/40 shadow-2xl p-4 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">✓ Steganogram Ready</h3>
                    <p className="text-[11px] text-emerald-400">Payload imperceptibly infused into RGB LSB plane.</p>
                  </div>
                  <a
                    href={encodedResultUrl}
                    download={`stego_carrier_${Date.now()}.png`}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition inline-flex items-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    📥 Download Lossless PNG
                  </a>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* DECODE MODE */}
        {mode === "decode" && (
          <div className="space-y-6 animate-in fade-in duration-200 font-mono text-xs">
            <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white font-bold uppercase">Upload Steganogram Carrier</CardTitle>
                <CardDescription className="text-xs text-slate-400 font-sans">
                  Select the PNG stego file to reconstruct hidden bitplanes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  accept="image/png,image/*"
                  onChange={handleDecodeUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />

                <Button
                  onClick={handleDecode}
                  disabled={!decodeImg || isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 shadow-lg shadow-indigo-600/30"
                >
                  {isProcessing ? "Scanning Bitplanes..." : "🔍 Extract & Decode Hidden Payload"}
                </Button>
              </CardContent>
            </Card>

            {decodeError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                ✕ {decodeError}
              </div>
            )}

            {extractedMessage && (
              <Card className="bg-slate-900/60 border-indigo-500/40 shadow-2xl overflow-hidden animate-in fade-in">
                <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs text-emerald-400 uppercase font-bold">
                    ✓ Decoded Hidden Payload
                  </CardTitle>
                  <Button
                    onClick={copyPayload}
                    size="sm"
                    variant="outline"
                    className="border-slate-800 bg-slate-900 text-[10px] h-7 px-2.5 text-slate-300"
                  >
                    {copied ? "✓ Copied" : "Copy Payload"}
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-white font-mono text-xs whitespace-pre-wrap break-all leading-relaxed">
                    {extractedMessage}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Client-Side Pixel LSB Carrier Engine.</p>
      </footer>
    </div>
  );
}
