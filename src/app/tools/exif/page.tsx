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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState("");
  const [gpsData, setGpsData] = useState<ParsedGPS | null>(null);
  const [hardware, setHardware] = useState<Record<string, string>>({});
  const [optical, setOptical] = useState<Record<string, string>>({});
  const [rawTags, setRawTags] = useState<{ name: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper Sanitizers for Clean Strings
  const cleanFNumber = (val: string) => (val.toLowerCase().startsWith("f/") ? val : `f/${val}`);
  const cleanFocalLength = (val: string) => (val.toLowerCase().includes("mm") ? val : `${val} mm`);
  const cleanIso = (val: string) => (val.toUpperCase().startsWith("ISO") ? val : `ISO ${val}`);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type || "image/jpeg");
    setImagePreview(URL.createObjectURL(file));
    setLoading(true);
    setGpsData(null);
    setHardware({});
    setOptical({});
    setRawTags([]);

    try {
      const buffer = await file.arrayBuffer();
      const tags = ExifReader.load(buffer, { expanded: true });

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

      // Device & Capture Hardware
      const hw: Record<string, string> = {};
      if (tags.exif?.Make) hw["Camera Manufacturer"] = String(tags.exif.Make.description);
      if (tags.exif?.Model) hw["Device Model"] = String(tags.exif.Model.description);
      if (tags.exif?.Software) hw["Software / OS Version"] = String(tags.exif.Software.description);
      if (tags.exif?.DateTimeOriginal) hw["Original Timestamp"] = String(tags.exif.DateTimeOriginal.description);
      if (tags.file?.["Image Width"]) {
        hw["Native Dimensions"] = `${tags.file["Image Width"].description} x ${tags.file["Image Height"]?.description} px`;
      }
      setHardware(hw);

      // Optical & Sensor Specs
      const opt: Record<string, string> = {};
      if (tags.exif?.ISOSpeedRatings) opt["ISO Sensitivity"] = cleanIso(String(tags.exif.ISOSpeedRatings.description));
      if (tags.exif?.FNumber) opt["Aperture"] = cleanFNumber(String(tags.exif.FNumber.description));
      if (tags.exif?.ExposureTime) opt["Shutter Speed"] = `${tags.exif.ExposureTime.description} sec`;
      if (tags.exif?.FocalLength) opt["Focal Length"] = cleanFocalLength(String(tags.exif.FocalLength.description));
      if (tags.exif?.LensModel) opt["Lens Model"] = String(tags.exif.LensModel.description);
      setOptical(opt);

      // Raw Binary Tag Dump
      const tagList: { name: string; value: string }[] = [];
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
    } catch {
      // Graceful fallback on binary errors
      setRawTags([]);
    } finally {
      setLoading(false);
    }
  };

  const copyDump = () => {
    navigator.clipboard.writeText(JSON.stringify({ fileName, fileSize, hardware, optical, gps: gpsData, rawTags }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasCameraData = Object.keys(hardware).length > 0 || Object.keys(optical).length > 0 || gpsData !== null;

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
              Upload any image, photo, or graphic to analyze its binary EXIF tags.
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
            <p>Decoding image binary structure & parsing IFD metadata...</p>
          </div>
        )}

        {/* Image Preview & File Meta Bar */}
        {imagePreview && !loading && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in duration-200">
            <img
              src={imagePreview}
              alt="Target Upload"
              className="w-24 h-24 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-950"
            />
            <div className="space-y-1 text-xs font-mono w-full">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold truncate max-w-xs">{fileName}</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px]">
                  {hasCameraData ? "CAMERA PHOTO DETECTED" : "WEB / SCREEN GRAPHIC"}
                </span>
              </div>
              <div className="text-slate-400 flex flex-wrap gap-x-4 gap-y-1 text-[11px] pt-1">
                <span>Size: {(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                <span>MIME: {fileType}</span>
                <span>Total Binary Tags: {rawTags.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Case 1: Image Has Camera / EXIF Telemetry */}
        {hasCameraData && !loading && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* GPS Satellite Map Link */}
            {gpsData ? (
              <Card className="bg-gradient-to-r from-indigo-950/50 via-slate-900/70 to-slate-900/70 border-indigo-500/40 shadow-2xl overflow-hidden font-mono">
                <CardHeader className="p-5 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base text-white flex items-center gap-2">
                      🛰️ Satellite Geo-Location Identified
                    </CardTitle>
                    <CardDescription className="text-indigo-300 text-xs">
                      Coordinates parsed from GPS IFD sub-header
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
                    <span className="text-slate-500 block mb-1">Altitude:</span>
                    <span className="text-indigo-300 font-bold text-sm">{gpsData.altitude ? `${gpsData.altitude} m` : "Not Recorded"}</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800 text-slate-400 text-xs font-mono">
                ℹ️ Hardware & shutter data extracted. GPS location was not enabled during capture.
              </div>
            )}

            {/* Hardware & Optical Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {Object.keys(hardware).length > 0 && (
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardHeader className="p-4 border-b border-slate-800">
                    <CardTitle className="text-xs text-white uppercase font-bold">📷 Device & Capture Hardware</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 divide-y divide-slate-800/60 text-xs font-mono">
                    {Object.entries(hardware).map(([k, v]) => (
                      <div key={k} className="py-2 flex justify-between gap-2">
                        <span className="text-slate-400">{k}:</span>
                        <span className="text-white font-semibold text-right">{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {Object.keys(optical).length > 0 && (
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardHeader className="p-4 border-b border-slate-800">
                    <CardTitle className="text-xs text-white uppercase font-bold">🔬 Optical & Sensor Telemetry</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 divide-y divide-slate-800/60 text-xs font-mono">
                    {Object.entries(optical).map(([k, v]) => (
                      <div key={k} className="py-2 flex justify-between gap-2">
                        <span className="text-slate-400">{k}:</span>
                        <span className="text-indigo-300 font-semibold text-right">{v}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            </div>

          </div>
        )}

        {/* Case 2: Web Graphic / Scrubbed Image (Show Smart Diagnostics) */}
        {!hasCameraData && imagePreview && !loading && (
          <Card className="bg-slate-900/60 border-amber-500/30 font-mono text-xs animate-in fade-in duration-200">
            <CardHeader className="p-4 bg-amber-500/10 border-b border-amber-500/20">
              <CardTitle className="text-xs text-amber-300 font-bold uppercase flex items-center gap-2">
                🛡️ Privacy Scrubbed / Non-Camera Asset
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <p className="text-slate-300 leading-relaxed">
                This image contains no camera sensor, shutter, or GPS tags. This occurs under the following scenarios:
              </p>
              <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
                <li><strong className="text-white">Screenshots / Screen Recordings:</strong> Created entirely in software without lens hardware.</li>
                <li><strong className="text-white">Social Media Downloads:</strong> WhatsApp, Telegram, and Instagram strip EXIF metadata automatically.</li>
                <li><strong className="text-white">Edited Web Assets / Wallpapers:</strong> Exported through Photoshop or Canvas without camera IFD chunks.</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Raw Binary Dump (Only if tags exist) */}
        {rawTags.length > 0 && !loading && (
          <Card className="bg-slate-900/60 border-slate-800 font-mono text-xs overflow-hidden">
            <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-xs text-slate-300 uppercase font-bold">
                Decoded Binary Tags ({rawTags.length})
              </CardTitle>
              <Button
                onClick={copyDump}
                size="sm"
                variant="outline"
                className="border-slate-800 bg-slate-950 text-[10px] h-7 px-2.5 text-slate-300"
              >
                {copied ? "✓ Copied Dump" : "Copy JSON"}
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
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. Client-Side Image Forensics & Metadata Engine.</p>
      </footer>
    </div>
  );
}
