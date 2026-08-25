"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ExifData {
  make?: string;
  model?: string;
  software?: string;
  dateTime?: string;
  iso?: number;
  fNumber?: number;
  exposureTime?: string;
  focalLength?: number;
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    latRef: string;
    lonRef: string;
    mapsUrl: string;
  };
  rawTags: { tag: string; value: string }[];
}

export default function ExifExtractorPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [exif, setExif] = useState<ExifData | null>(null);
  const [parsing, setParsing] = useState(false);
  const [noExifFound, setNoExifFound] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pure Client-Side Binary EXIF Parser
  const parseExif = (buffer: ArrayBuffer): ExifData | null => {
    const dataView = new DataView(buffer);
    if (dataView.getUint16(0, false) !== 0xffd8) {
      return null; // Not a valid JPEG
    }

    let offset = 2;
    const length = buffer.byteLength;
    let app1Offset = -1;

    while (offset < length - 1) {
      const marker = dataView.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        app1Offset = offset + 2;
        break;
      } else if ((marker & 0xff00) !== 0xff00 || marker === 0xffda || marker === 0xffd9) {
        break;
      } else {
        offset += dataView.getUint16(offset, false);
      }
    }

    if (app1Offset === -1) return null;

    // Check "Exif\0\0" Header
    const exifHeader = String.fromCharCode(
      dataView.getUint8(app1Offset),
      dataView.getUint8(app1Offset + 1),
      dataView.getUint8(app1Offset + 2),
      dataView.getUint8(app1Offset + 3)
    );

    if (exifHeader !== "Exif") return null;

    const tiffOffset = app1Offset + 6;
    const littleEndian = dataView.getUint16(tiffOffset, false) === 0x4949;

    const readTagValue = (type: number, valOffset: number, count: number) => {
      switch (type) {
        case 1: // Byte
        case 7: // Undefined
          return dataView.getUint8(valOffset);
        case 2: { // ASCII String
          let str = "";
          for (let i = 0; i < count - 1; i++) {
            str += String.fromCharCode(dataView.getUint8(valOffset + i));
          }
          return str;
        }
        case 3: // Short (16-bit)
          return dataView.getUint16(valOffset, littleEndian);
        case 4: // Long (32-bit)
          return dataView.getUint32(valOffset, littleEndian);
        case 5: { // Rational (2 Longs)
          const num = dataView.getUint32(valOffset, littleEndian);
          const den = dataView.getUint32(valOffset + 4, littleEndian);
          return den === 0 ? 0 : num / den;
        }
        default:
          return null;
      }
    };

    const getTags = (dirOffset: number) => {
      const tags: Record<number, any> = {};
      if (dirOffset + 2 > length) return tags;
      const entries = dataView.getUint16(dirOffset, littleEndian);
      let curr = dirOffset + 2;

      for (let i = 0; i < entries; i++) {
        if (curr + 12 > length) break;
        const tag = dataView.getUint16(curr, littleEndian);
        const type = dataView.getUint16(curr + 2, littleEndian);
        const count = dataView.getUint32(curr + 4, littleEndian);
        let valOffset = curr + 8;

        const typeSizes = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8];
        const valSize = (typeSizes[type] || 1) * count;
        if (valSize > 4) {
          const ptr = dataView.getUint32(curr + 8, littleEndian);
          valOffset = tiffOffset + ptr;
        }

        tags[tag] = readTagValue(type, valOffset, count);
        curr += 12;
      }
      return tags;
    };

    const firstIfd = tiffOffset + dataView.getUint32(tiffOffset + 4, littleEndian);
    const ifd0 = getTags(firstIfd);

    let exifSubIfd: Record<number, any> = {};
    if (ifd0[0x8769]) {
      exifSubIfd = getTags(tiffOffset + ifd0[0x8769]);
    }

    let gpsIfd: Record<number, any> = {};
    if (ifd0[0x8825]) {
      gpsIfd = getTags(tiffOffset + ifd0[0x8825]);
    }

    // Parse GPS Coordinates if available
    let gpsData = undefined;
    if (ifd0[0x8825]) {
      try {
        const getRationalArray = (tagId: number) => {
          const ptr = dataView.getUint32(
            tiffOffset + dataView.getUint32(tiffOffset + 4, littleEndian) + 8,
            littleEndian
          );
          return ptr;
        };

        const latRef = String(gpsIfd[0x0001] || "N");
        const lonRef = String(gpsIfd[0x0003] || "E");

        // Parse Coordinates
        const lat = typeof gpsIfd[0x0002] === "number" ? gpsIfd[0x0002] : null;
        const lon = typeof gpsIfd[0x0004] === "number" ? gpsIfd[0x0004] : null;

        if (lat !== null && lon !== null) {
          const finalLat = latRef === "S" ? -lat : lat;
          const finalLon = lonRef === "W" ? -lon : lon;
          gpsData = {
            latitude: finalLat,
            longitude: finalLon,
            latRef,
            lonRef,
            altitude: typeof gpsIfd[0x0006] === "number" ? gpsIfd[0x0006] : undefined,
            mapsUrl: `https://www.google.com/maps?q=${finalLat},${finalLon}`,
          };
        }
      } catch (err) {
        console.error("GPS Parse Error:", err);
      }
    }

    const rawTags: { tag: string; value: string }[] = [];
    Object.entries({ ...ifd0, ...exifSubIfd, ...gpsIfd }).forEach(([k, v]) => {
      if (typeof v !== "object") {
        rawTags.push({ tag: `Tag 0x${Number(k).toString(16).toUpperCase()}`, value: String(v) });
      }
    });

    return {
      make: ifd0[0x010f],
      model: ifd0[0x0110],
      software: ifd0[0x0131],
      dateTime: ifd0[0x0132] || exifSubIfd[0x9003],
      iso: exifSubIfd[0x8827],
      fNumber: exifSubIfd[0x829d],
      focalLength: exifSubIfd[0x920a],
      gps: gpsData,
      rawTags,
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setFileName(file.name);
    setFileSize(file.size);
    setImagePreview(URL.createObjectURL(file));
    setParsing(true);
    setNoExifFound(false);
    setExif(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const buffer = ev.target?.result as ArrayBuffer;
      const parsed = parseExif(buffer);
      if (parsed && (parsed.make || parsed.model || parsed.dateTime || parsed.gps || parsed.rawTags.length > 0)) {
        setExif(parsed);
      } else {
        setNoExifFound(true);
      }
      setParsing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const copyData = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🛰️ Image Forensics & Geo-Location OSINT
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            EXIF Metadata & GPS Forensic Extractor
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Extract camera hardware signatures, shutter timestamps, device lens configurations, and embedded satellite GPS coordinates from original image files.
          </p>
        </div>

        {/* Upload Container */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white">Upload Original Image File</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Upload uncompressed JPEG/JPG photos taken directly from mobile cameras or digital SLRs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </CardContent>
        </Card>

        {/* Processing State */}
        {parsing && (
          <div className="p-8 text-center text-slate-400 space-y-2 font-mono text-xs">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Decoding TIFF APP1 Header & GPS IFD structures...</p>
          </div>
        )}

        {/* No EXIF Notice */}
        {noExifFound && !parsing && (
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono space-y-2">
            <div className="font-bold flex items-center gap-2">⚠️ No EXIF / GPS Tags Found in this File</div>
            <p className="text-slate-400 leading-relaxed">
              WhatsApp, Telegram, Facebook, or screenshot tools automatically purge EXIF metadata for user privacy. To view GPS data, upload an original photo directly from your Camera gallery (uncompressed).
            </p>
          </div>
        )}

        {/* Results Showcase */}
        {exif && !parsing && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* GPS Map Coordinates Card */}
            {exif.gps ? (
              <Card className="bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/60 border-indigo-500/40 shadow-2xl overflow-hidden font-mono">
                <CardHeader className="p-5 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      🛰️ Satellite Geo-Location Identified
                    </CardTitle>
                    <CardDescription className="text-indigo-300 text-xs">
                      Target capture coordinates decoded from GPS IFD sub-header
                    </CardDescription>
                  </div>
                  <a
                    href={exif.gps.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition inline-flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    📍 Open in Google Maps ↗
                  </a>
                </CardHeader>
                <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Latitude:</span>
                    <span className="text-white font-bold text-sm">{exif.gps.latitude.toFixed(6)}° {exif.gps.latRef}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Longitude:</span>
                    <span className="text-white font-bold text-sm">{exif.gps.longitude.toFixed(6)}° {exif.gps.lonRef}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Altitude (MSL):</span>
                    <span className="text-indigo-300 font-bold text-sm">{exif.gps.altitude ? `${exif.gps.altitude} m` : "Not Recorded"}</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs font-mono">
                ℹ️ Hardware metadata extracted, but GPS coordinates were disabled during capture.
              </div>
            )}

            {/* Hardware & Shot Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Device Hardware Details */}
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800">
                  <CardTitle className="text-xs text-white uppercase font-bold">📷 Device & Capture Hardware</CardTitle>
                </CardHeader>
                <CardContent className="p-4 divide-y divide-slate-800/60 text-xs font-mono">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Camera Manufacturer:</span>
                    <span className="text-white font-semibold">{exif.make || "Unknown / Not Set"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Device Model:</span>
                    <span className="text-indigo-300 font-bold">{exif.model || "Unknown"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Processing Software:</span>
                    <span className="text-slate-300">{exif.software || "Stock Camera Subsystem"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Capture Timestamp:</span>
                    <span className="text-emerald-400 font-semibold">{exif.dateTime || "Not Recorded"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Optical Camera Telemetry */}
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800">
                  <CardTitle className="text-xs text-white uppercase font-bold">🔬 Optical & Sensor Telemetry</CardTitle>
                </CardHeader>
                <CardContent className="p-4 divide-y divide-slate-800/60 text-xs font-mono">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">ISO Speed Rating:</span>
                    <span className="text-white font-semibold">{exif.iso ? `ISO ${exif.iso}` : "Auto"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Aperture (F-Stop):</span>
                    <span className="text-white">{exif.fNumber ? `f/${exif.fNumber}` : "—"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Focal Length:</span>
                    <span className="text-white">{exif.focalLength ? `${exif.focalLength} mm` : "—"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Analyzed File Size:</span>
                    <span className="text-slate-400">{(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Raw EXIF Tags Dump */}
            <Card className="bg-slate-900/60 border-slate-800 font-mono text-xs overflow-hidden">
              <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-xs text-slate-300 uppercase font-bold">Raw EXIF Tag Dump ({exif.rawTags.length} Entries)</CardTitle>
                <Button
                  onClick={() => copyData(JSON.stringify(exif, null, 2))}
                  size="sm"
                  variant="outline"
                  className="border-slate-800 bg-slate-900 text-[10px] h-7 px-2.5 text-slate-300"
                >
                  {copied ? "✓ Copied JSON" : "Copy JSON"}
                </Button>
              </CardHeader>
              <CardContent className="p-4 max-h-60 overflow-y-auto">
                <div className="space-y-1">
                  {exif.rawTags.map((t, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-800/40 text-[11px]">
                      <span className="text-slate-500">{t.tag}</span>
                      <span className="text-slate-300 truncate max-w-md">{t.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Client-Side Image Forensics & Metadata Engine.</p>
      </footer>
    </div>
  );
}
