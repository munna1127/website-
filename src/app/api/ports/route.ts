export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import net from "net";

const COMMON_PORTS = [
  { port: 21, service: "FTP" },
  { port: 22, service: "SSH" },
  { port: 23, service: "Telnet" },
  { port: 25, service: "SMTP" },
  { port: 53, service: "DNS" },
  { port: 80, service: "HTTP" },
  { port: 443, service: "HTTPS" },
  { port: 445, service: "SMB" },
  { port: 3306, service: "MySQL" },
  { port: 3389, service: "RDP" },
  { port: 5432, service: "PostgreSQL" },
  { port: 8080, service: "HTTP-Proxy" },
];

function checkPort(host: string, port: number, timeout = 2500): Promise<{ port: number; service: string; status: "OPEN" | "CLOSED"; latencyMs: number }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const socket = new net.Socket();

    let status: "OPEN" | "CLOSED" = "CLOSED";

    socket.setTimeout(timeout);

    socket.on("connect", () => {
      status = "OPEN";
      socket.destroy();
    });

    socket.on("timeout", () => {
      socket.destroy();
    });

    socket.on("error", () => {
      socket.destroy();
    });

    socket.on("close", () => {
      const latencyMs = Date.now() - startTime;
      resolve({ port, service: COMMON_PORTS.find(p => p.port === port)?.service || "Unknown", status, latencyMs });
    });

    socket.connect(port, host);
  });
}

function isRestrictedHost(host: string): boolean {
  return (
    host === "localhost" ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("172.16.") ||
    host.startsWith("0.0.0.0")
  );
}

export async function POST(req: Request) {
  try {
    const { target } = await req.json();
    if (!target || typeof target !== "string") {
      return NextResponse.json({ success: false, error: "Target host is required" }, { status: 400 });
    }

    const host = target
      .trim()
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      .split(":")[0]
      .toLowerCase();

    if (!host || isRestrictedHost(host)) {
      return NextResponse.json({ success: false, error: "Invalid or restricted target hostname" }, { status: 400 });
    }

    const startTime = Date.now();
    
    // Parallel TCP connect probes
    const scanPromises = COMMON_PORTS.map((p) => checkPort(host, p.port));
    const results = await Promise.all(scanPromises);

    const openPorts = results.filter((r) => r.status === "OPEN");

    return NextResponse.json({
      success: true,
      target: host,
      totalExecutionMs: Date.now() - startTime,
      portsScanned: COMMON_PORTS.length,
      results,
      openCount: openPorts.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
