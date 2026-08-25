"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function IocExtractorPage() {
  const [rawReport, setRawReport] = useState(`CRITICAL THREAT REPORT - APT-41 INTRUSION
Identified C2 communication to http://c2-stage4.darktelecom.ru/beacon on IP 185.220.101.5 and backup 198.51.100.42.
Drop payload MD5: 44d88612fea8a8f36de82e1278abb02f
Malware SHA-256: 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f
Exploited Vulnerability: CVE-2024-38077 (Windows Remote Desktop Licensing) and CVE-2023-36884.
Attacker contact: apt41_exfil@protonmail.com`);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Defanging Utilities
  const defang = (text: string) => {
    return text
      .replace(/https?:\/\//gi, (m) => m.toLowerCase().replace("http", "hxxp").replace("://", "[://]"))
      .replace(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/g, "$1[.]\\$2[.]\\$3[.]\\$4")
      .replace(/([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,})/g, (match) => match.replace(/\./g, "[.]"))
      .replace(/@/g, "[at]");
  };

  // Deterministic Extraction Regexes
  const iocs = useMemo(() => {
    if (!rawReport.trim()) return { ips: [], domains: [], urls: [], cves: [], hashes: [], emails: [] };

    const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
    const cveRegex = /CVE-\d{4}-\d{4,7}/gi;
    const sha256Regex = /\b[a-fA-F0-9]{64}\b/g;
    const sha1Regex = /\b[a-fA-F0-9]{40}\b/g;
    const md5Regex = /\b[a-fA-F0-9]{32}\b/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
    const domainRegex = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/g;

    const ips = Array.from(new Set(rawReport.match(ipRegex) || []));
    const urls = Array.from(new Set(rawReport.match(urlRegex) || []));
    const cves = Array.from(new Set(rawReport.match(cveRegex) || []));
    const sha256 = Array.from(new Set(rawReport.match(sha256Regex) || []));
    const md5 = Array.from(new Set(rawReport.match(md5Regex) || []));
    const emails = Array.from(new Set(rawReport.match(emailRegex) || []));

    // Filter domains excluding already matched IPs and URLs
    const rawDomains = Array.from(new Set(rawReport.match(domainRegex) || []));
    const domains = rawDomains.filter(
      (d) => !ips.includes(d) && !emails.some((e) => e.endsWith(d)) && !d.startsWith("CVE-")
    );

    return {
      ips,
      domains,
      urls,
      cves,
      hashes: [...sha256.map((h) => ({ type: "SHA-256", val: h })), ...md5.map((h) => ({ type: "MD5", val: h }))],
      emails,
    };
  }, [rawReport]);

  const totalIocs =
    iocs.ips.length + iocs.domains.length + iocs.urls.length + iocs.cves.length + iocs.hashes.length + iocs.emails.length;

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const exportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      rawIocs: iocs,
      defangedIocs: {
        ips: iocs.ips.map(defang),
        domains: iocs.domains.map(defang),
        urls: iocs.urls.map(defang),
        emails: iocs.emails.map(defang),
        cves: iocs.cves,
        hashes: iocs.hashes,
      },
    };
    copy(JSON.stringify(data, null, 2), "json_export");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🔍 Cyber Threat Intelligence (CTI) Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Threat IOC Extractor & Neutralizer
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Extract, parse, and sanitize malicious telemetry indicators from unstructured threat intel streams with deterministic defanging.
          </p>
        </div>

        {/* Input Card */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-slate-300 font-semibold uppercase">Raw Threat Advisory / Telemetry Stream</CardTitle>
              <CardDescription className="text-xs text-slate-400">Paste logs, malware reports, or SOC tickets</CardDescription>
            </div>
            <Button onClick={exportJSON} size="sm" variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs h-8">
              {copiedKey === "json_export" ? "✓ JSON Copied" : "Export STIX/JSON"}
            </Button>
          </CardHeader>
          <CardContent>
            <textarea
              rows={5}
              value={rawReport}
              onChange={(e) => setRawReport(e.target.value)}
              placeholder="Paste threat intelligence payload here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Total Artifacts</CardDescription>
              <CardTitle className="text-2xl font-bold text-white mt-1">{totalIocs}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">IPv4 Entities</CardDescription>
              <CardTitle className="text-2xl font-bold text-indigo-400 mt-1">{iocs.ips.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">CVE Identifiers</CardDescription>
              <CardTitle className="text-2xl font-bold text-amber-400 mt-1">{iocs.cves.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">File Hashes</CardDescription>
              <CardTitle className="text-2xl font-bold text-emerald-400 mt-1">{iocs.hashes.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Parsed & Defanged Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          
          {/* IP Addresses */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-xs text-indigo-400 uppercase font-bold">IPv4 Addresses ({iocs.ips.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {iocs.ips.length === 0 ? (
                <div className="text-slate-500">No IPv4 addresses detected.</div>
              ) : (
                iocs.ips.map((ip, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-slate-300 break-all">{defang(ip)}</span>
                    <Button onClick={() => copy(defang(ip), `ip_${idx}`)} size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-[10px] h-6 px-2 text-slate-300">
                      {copiedKey === `ip_${idx}` ? "✓" : "Copy"}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* CVE Identifiers */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 border-b border-slate-800">
              <CardTitle className="text-xs text-amber-400 uppercase font-bold">CVE Vulnerabilities ({iocs.cves.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {iocs.cves.length === 0 ? (
                <div className="text-slate-500">No CVE IDs detected.</div>
              ) : (
                iocs.cves.map((cve, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-amber-300 font-bold">{cve}</span>
                    <Button onClick={() => copy(cve, `cve_${idx}`)} size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-[10px] h-6 px-2 text-slate-300">
                      {copiedKey === `cve_${idx}` ? "✓" : "Copy"}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Malicious URLs & Endpoints */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 border-b border-slate-800">
              <CardTitle className="text-xs text-purple-400 uppercase font-bold">Defanged URLs ({iocs.urls.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {iocs.urls.length === 0 ? (
                <div className="text-slate-500">No HTTP/HTTPS URLs detected.</div>
              ) : (
                iocs.urls.map((url, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-purple-300 break-all">{defang(url)}</span>
                    <Button onClick={() => copy(defang(url), `url_${idx}`)} size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-[10px] h-6 px-2 text-slate-300">
                      {copiedKey === `url_${idx}` ? "✓" : "Copy"}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Cryptographic Hashes */}
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="p-4 border-b border-slate-800">
              <CardTitle className="text-xs text-emerald-400 uppercase font-bold">Payload Hashes ({iocs.hashes.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {iocs.hashes.length === 0 ? (
                <div className="text-slate-500">No MD5/SHA256 hashes detected.</div>
              ) : (
                iocs.hashes.map((h, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] text-slate-500 uppercase">{h.type}:</span>
                      <span className="text-emerald-300 truncate">{h.val}</span>
                    </div>
                    <Button onClick={() => copy(h.val, `hash_${idx}`)} size="sm" variant="outline" className="border-slate-800 bg-slate-900 text-[10px] h-6 px-2 text-slate-300">
                      {copiedKey === `hash_${idx}` ? "✓" : "Copy"}
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

        </div>

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. POSIX Cyber Threat Intelligence Subsystem.</p>
      </footer>
    </div>
  );
}
