"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function ipToInt(ip: string): number {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

function intToBinaryStr(int: number): string {
  return [
    ((int >>> 24) & 255).toString(2).padStart(8, "0"),
    ((int >>> 16) & 255).toString(2).padStart(8, "0"),
    ((int >>> 8) & 255).toString(2).padStart(8, "0"),
    (int & 255).toString(2).padStart(8, "0"),
  ].join(".");
}

export default function SubnetToolPage() {
  const [cidrInput, setCidrInput] = useState("192.168.1.100/24");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const samplePresets = [
    "10.0.0.1/8",
    "172.16.42.0/20",
    "192.168.1.0/24",
    "10.240.0.0/28",
    "100.64.0.1/10",
  ];

  const calculation = useMemo(() => {
    const parts = cidrInput.trim().split("/");
    if (parts.length !== 2) return { error: "Format should be IP/Prefix (e.g. 192.168.1.0/24)" };

    const ipStr = parts[0];
    const prefix = parseInt(parts[1], 10);

    const octets = ipStr.split(".");
    if (octets.length !== 4 || octets.some((o) => isNaN(Number(o)) || Number(o) < 0 || Number(o) > 255)) {
      return { error: "Invalid IPv4 octet format (must be 0-255)." };
    }

    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      return { error: "Prefix must be an integer between 0 and 32." };
    }

    const ip = ipToInt(ipStr);
    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const wildcard = ~mask >>> 0;
    const network = ip & mask;
    const broadcast = network | wildcard;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(totalHosts - 2, 0);

    const firstUsable = prefix >= 31 ? network : network + 1;
    const lastUsable = prefix >= 31 ? broadcast : broadcast - 1;

    // RFC Scope Classification
    const firstOctet = parseInt(octets[0], 10);
    const secondOctet = parseInt(octets[1], 10);
    let ipScope = "Public Internet";
    if (firstOctet === 10) ipScope = "Private (RFC 1918 Class A)";
    else if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) ipScope = "Private (RFC 1918 Class B)";
    else if (firstOctet === 192 && secondOctet === 168) ipScope = "Private (RFC 1918 Class C)";
    else if (firstOctet === 127) ipScope = "Loopback (RFC 1122)";
    else if (firstOctet === 169 && secondOctet === 254) ipScope = "Link-Local / APIPA (RFC 3927)";
    else if (firstOctet >= 224 && firstOctet <= 239) ipScope = "Multicast (Class D)";

    // Subnet splits (if prefix <= 30)
    const subnets: { name: string; network: string; usable: string; broadcast: string }[] = [];
    if (prefix <= 28) {
      const splitPrefix = prefix + 2;
      const step = Math.pow(2, 32 - splitPrefix);
      for (let i = 0; i < 4; i++) {
        const net = network + i * step;
        const bcast = net + step - 1;
        subnets.push({
          name: `Subnet ${i + 1} (/${splitPrefix})`,
          network: `${intToIp(net)}/${splitPrefix}`,
          usable: `${intToIp(net + 1)} - ${intToIp(bcast - 1)}`,
          broadcast: intToIp(bcast),
        });
      }
    }

    return {
      ipStr,
      prefix,
      ipScope,
      networkIp: intToIp(network),
      broadcastIp: intToIp(broadcast),
      firstUsableIp: intToIp(firstUsable),
      lastUsableIp: intToIp(lastUsable),
      subnetMask: intToIp(mask),
      wildcardMask: intToIp(wildcard),
      totalHosts,
      usableHosts,
      ipBinary: intToBinaryStr(ip),
      maskBinary: intToBinaryStr(mask),
      subnets,
    };
  }, [cidrInput]);

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            🌐 Network Topology & Pivoting Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            CIDR & IPv4 Subnet Analyzer
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Deterministic bitwise IPv4 network address calculation, usable host bounding, 32-bit binary octet mapping, and RFC scope analysis.
          </p>
        </div>

        {/* CIDR Input Box */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase font-mono">CIDR Notation Target (IP/Prefix)</label>
              <Input
                placeholder="192.168.1.0/24"
                value={cidrInput}
                onChange={(e) => setCidrInput(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white font-mono text-sm placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Preset Scopes:</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setCidrInput(preset)}
                  className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition font-mono text-[11px]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {calculation.error ? (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            ✕ {calculation.error}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200 font-mono text-xs">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Usable Hosts</CardDescription>
                  <CardTitle className="text-xl font-bold text-white mt-1">
                    {calculation.usableHosts?.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Network ID</CardDescription>
                  <CardTitle className="text-lg font-bold text-indigo-400 mt-1 truncate">
                    {calculation.networkIp}/{calculation.prefix}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Subnet Mask</CardDescription>
                  <CardTitle className="text-lg font-bold text-emerald-400 mt-1 truncate">
                    {calculation.subnetMask}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardHeader className="p-4 pb-2">
                  <CardDescription className="text-slate-400 font-sans uppercase font-semibold text-[11px]">Address Scope</CardDescription>
                  <CardTitle className="text-sm font-bold text-purple-300 mt-1 truncate">
                    {calculation.ipScope}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Detailed Parameters Table */}
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden">
              <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800">
                <CardTitle className="text-xs text-white uppercase font-bold">Network Bounds & Routing Boundaries</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-800/60">
                {[
                  { label: "IP Address Range (Usable)", val: `${calculation.firstUsableIp}  ⟶  ${calculation.lastUsableIp}` },
                  { label: "Broadcast Address", val: calculation.broadcastIp },
                  { label: "Wildcard Inverse Mask", val: calculation.wildcardMask },
                  { label: "Total Address Pool Size", val: `${calculation.totalHosts?.toLocaleString()} addresses (/${calculation.prefix})` },
                ].map((row, i) => (
                  <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-400">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{row.val}</span>
                      <Button
                        onClick={() => copy(row.val as string, row.label)}
                        size="sm"
                        variant="outline"
                        className="border-slate-800 bg-slate-950 hover:bg-slate-800 text-[10px] h-6 px-2 text-slate-300"
                      >
                        {copiedKey === row.label ? "✓" : "Copy"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 32-Bit Binary Visualizer */}
            <Card className="bg-slate-900/60 border-slate-800 shadow-xl">
              <CardHeader className="p-4 border-b border-slate-800">
                <CardTitle className="text-xs text-indigo-400 uppercase font-bold">32-Bit Binary Octet Alignment</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-1">
                  <div className="text-slate-400 text-[11px]">Target IP Binary Stream:</div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 tracking-widest break-all">
                    {calculation.ipBinary}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 text-[11px]">Netmask Binary Mask:</div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-emerald-300 tracking-widest break-all">
                    {calculation.maskBinary}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subnet Split Tree */}
            {calculation.subnets && calculation.subnets.length > 0 && (
              <Card className="bg-slate-900/60 border-slate-800 shadow-xl overflow-hidden">
                <CardHeader className="p-4 bg-slate-950/60 border-b border-slate-800">
                  <CardTitle className="text-xs text-white uppercase font-bold">Automatic Subnet Partitioning (/{(calculation.prefix || 0) + 2})</CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                        <th className="p-3 pl-4">Subnet</th>
                        <th className="p-3">Network CIDR</th>
                        <th className="p-3">Usable Host Range</th>
                        <th className="p-3 pr-4">Broadcast</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {calculation.subnets.map((sub, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition">
                          <td className="p-3 pl-4 text-indigo-400 font-semibold">{sub.name}</td>
                          <td className="p-3 text-white">{sub.network}</td>
                          <td className="p-3 text-slate-300">{sub.usable}</td>
                          <td className="p-3 pr-4 text-slate-400">{sub.broadcast}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Aryan Tomar. POSIX Network Addressing & Bitwise Subsystem.</p>
      </footer>
    </div>
  );
}
