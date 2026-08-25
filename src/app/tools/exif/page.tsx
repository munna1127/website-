"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ExifReader from "exifreader";

interface ParsedGPS {
  latitude: number;
  longitude: number;
  altitude?: number;
  mapsUrl: string;
}

export default function ExifExtractorPage() {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [gpsData, setGpsData] = useState<ParsedGPS | null>(null);
  const [hardware, setHardware] = useState<Record<string, string>>({});
  const [optical, setOptical] = useState<Record<string, string>>({});
  const [rawTags, setRawTags] = useState<{ name: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [noExif, setNoExif] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setFileName(file.name);
    setFileSize(file.size);
    setLoading(true);
    setNoExif(false);
    setGpsData(null);
    setHardware({});
    setOptical({});
    setRawTags([]);

    try {
      const buffer = await file.arrayBuffer();
      const tags = ExifReader.load(buffer, { expanded: true });

      const tagList: { name: string; value: string }[] = [];
      
      // GPS Extraction
      if (tags.gps && tags.gps.Latitude && tags.gps.Longitude) {
        const lat = tags.gps.Latitude;
        const lon = tags.gps.Longitude;
        setGpsData({
          latitude: lat,
          longitude: lon,
          altitude: tags.gps.Altitude,
          mapsUrl: `https://www.google.com/maps?q=${lat},${lon}`,
        });
      }

      // Hardware Specs
      const hw: Record<string, string> = {};
      if (tags.exif?.Make) hw["Camera Manufacturer"] = String(tags.exif.Make.description);
      if (tags.exif?.Model) hw["Device Model"] = String(tags.exif.Model.description);
      if (tags.exif?.Software) hw["Software / OS Version"] = String(tags.exif.Software.description);
      if (tags.exif?.DateTimeOriginal) hw["Original Timestamp"] = String(tags.exif.DateTimeOriginal.description);
      if (tags.file?.["Image Width"]) hw["Native Dimensions"] = `${tags.file["Image Width"].description} x ${tags.file["Image Height"]?.description} px`;
      setHardware(hw);

      // Optical Specs
      const opt: Record<string, string> = {};
      if (tags.exif?.ISOSpeedRatings) opt["ISO Sensitivity"] = `ISO ${tags.exif.ISOSpeedRatings.description}`;
      if (tags.exif?.FNumber) opt["Aperture"] = `f/${tags.exif.FNumber.description}`;
      if (tags.exif?.ExposureTime) opt["Shutter Speed"] = `${tags.exif.ExposureTime.description} sec`;
      if (tags.exif?.FocalLength) opt["Focal Length"] = `${tags.exif.FocalLength.description} mm`;
      if (tags.exif?.LensModel) opt["Lens Model"] = String(tags.exif.LensModel.description);
      setOptical(opt);

      // Collect Raw Dump
      if (tags.exif) {
        Object.entries(tags.exif).forEach(([k, v]) => {
          tagList.push({ name: k, value: String(v.description) });
        });
      }
      if (tags.file) {
        Object.entries(tags.file).forEach(([k, v]) => {
          tagList.push({ name: `File_${k}`, value: String(v.description) });
        });
      }

      setRawTags(tagList);

      if (tagList.length === 0 && !tags.gps) {
        setNoExif(true);
      }
    } catch {
      setNoExif(true);
    } finally {
      setLoading(false);
    }
  };

  const copyDump = () => {
    navigator.clipboard.writeText(JSON.stringify({ hardware, optical, gps: gpsData, rawTags }, null, 2));
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
            🛰️ Deep Forensic EXIF / GPS Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Image Metadata & GPS Forensic Analyzer
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Extract camera hardware signatures, shutter telemetry, device identifiers, and exact satellite GPS coordinates from original JPEG, TIFF, and HEIC captures.
          </p>
        </div>

        {/* Upload Container */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white">Select Image for Forensic Audit</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Works on original camera photos. (Note: Screenshots and WhatsApp images have metadata stripped by design).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </CardContent>
        </Card>

        {loading && (
          <div className="p-8 text-center text-slate-400 space-y-2 font-mono text-xs">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p>Decompiling image binary tags & parsing GPS sub-IFDs...</p>
          </div>
        )}

        {noExif && !loading && (
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono space-y-2">
            <div className="font-bold flex items-center gap-2">⚠️ No Camera / Location EXIF Found</div>
            <p className="text-slate-400 leading-relaxed">
              This file does not contain camera or GPS markers. Screenshots, downloaded web images, or photos shared via WhatsApp/Telegram have their EXIF tags purged automatically. Test with a direct photo taken from your phone camera.
            </p>
          </div>
        )}

        {(gpsData || Object.keys(hardware).length > 0 || rawTags.length > 0) && !loading && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Satellite GPS Discovery Banner */}
            {gpsData ? (
              <Card className="bg-gradient-to-r from-indigo-950/50 via-slate-900/70 to-slate-900/70 border-indigo-500/40 shadow-2xl overflow-hidden font-mono">
                <CardHeader className="p-5 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      🛰️ Satellite Geo-Location Identified
                    </CardTitle>
                    <CardDescription className="text-indigo-300 text-xs">
                      Target capture coordinates parsed from GPS IFD sub-header
                    </CardDescription>
                  </div>
                  <a
                    href={gpsData.mapsUrl}
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
                    <span className="text-white font-bold text-sm">{gpsData.latitude.toFixed(6)}°</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Longitude:</span>
                    <span className="text-white font-bold text-sm">{gpsData.longitude.toFixed(6)}°</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block mb-1">Altitude (MSL):</span>
                    <span className="text-indigo-300 font-bold text-sm">{gpsData.altitude ? `${gpsData.altitude} m` : "Not Recorded"}</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs font-mono">
                ℹ️ Image parsed successfully. No GPS coordinates were embedded in this capture.
              </div>
            )}

            {/* Hardware & Optical Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800">
                  <CardTitle className="text-xs text-white uppercase font-bold">📷 Device & Capture Hardware</CardTitle>
                </CardHeader>
                <CardContent className="p-4 divide-y divide-slate-800/60 text-xs font-mono">
                  {Object.keys(hardware).length === 0 ? (
                    <div className="py-2 text-slate-500">No hardware tags found.</div>
                  ) : (
                    Object.entries(hardware).map(([k, v]) => (
                      <div key={k} className="py-2 flex justify-between gap-2">
                        <span className="text-slate-400">{k}:</span>
                        <span className="text-white font-semibold text-right">{v}</span>
                      </div>
                    ))
                  )}
                  <div className="py-2 flex justify-between gap-2">
                    <span className="text-slate-400">File Size:</span>
                    <span className="text-slate-300">{(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 border-b border-slate-800">
                  <CardTitle className="text-xs text-white uppercase font-bold">🔬 Optical & Sensor Telemetry</CardTitle>
                </CardHeader>
                <CardContent className="p-4 divide-y divide-slate-800/60 text-xs font-mono">
                  {Object.keys(optical).length === 0 ? (
                    <div className="py-2 text-slate-500">No lens/sensor telemetry found.</div>
                  ) : (
                    Object.entries(optical).map(([k, v]) => (
                      <div key={k} className="py-2 flex justify-between gap-2">
                        <span className="text-slate-400">{k}:</span>
                        <span className="text-indigo-300 font-semibold text-right">{v}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Raw Dump */}
            <Card className="bg-slate-900/60 border-slate-800 font-mono text-xs overflow-hidden">
              <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-xs text-slate-300 uppercase font-bold">EXIF Binary Dump ({rawTags.length} Tags)</CardTitle>
                <Button
                  onClick={copyDump}
                  size="sm"
                  variant="outline"
                  className="border-slate-800 bg-slate-950 text-[10px] h-7 px-2.5 text-slate-300"
                >
                  {copied ? "✓ Copied" : "Copy Dump"}
                </Button>
              </CardHeader>
              <CardContent className="p-4 max-h-60 overflow-y-auto">
                <div className="space-y-1">
                  {rawTags.map((t, idx) => (
                    <div key={idx} className="flex justify-between py-1 border-b border-slate-800/40 text-[11px]">
                      <span className="text-slate-500">{t.name}</span>
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
