export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dns from "dns/promises";

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
      return NextResponse.json({ success: false, error: "Target domain is required" }, { status: 400 });
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

    // Parallel DNS Resolvers
    const [aRecords, mxRecords, txtRecords, nsRecords] = await Promise.allSettled([
      dns.resolve4(host),
      dns.resolveMx(host),
      dns.resolveTxt(host),
      dns.resolveNs(host),
    ]);

    // Live HTTP Probe
    let headersMap: Record<string, string> = {};
    let statusCode = 0;
    let statusText = "Failed to connect";
    let probeLatency = 0;

    try {
      const pStart = Date.now();
      const res = await fetch(`https://${host}`, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(5000),
      });
      probeLatency = Date.now() - pStart;
      statusCode = res.status;
      statusText = res.statusText;
      res.headers.forEach((val, key) => {
        headersMap[key] = val;
      });
    } catch {
      try {
        const pStart = Date.now();
        const res = await fetch(`http://${host}`, {
          method: "HEAD",
          redirect: "follow",
          signal: AbortSignal.timeout(4000),
        });
        probeLatency = Date.now() - pStart;
        statusCode = res.status;
        statusText = res.statusText;
        res.headers.forEach((val, key) => {
          headersMap[key] = val;
        });
      } catch (err: any) {
        statusText = err.message || "Connection timed out";
      }
    }

    return NextResponse.json({
      success: true,
      target: host,
      totalExecutionMs: Date.now() - startTime,
      dns: {
        ipv4: aRecords.status === "fulfilled" ? aRecords.value : [],
        mx: mxRecords.status === "fulfilled" ? mxRecords.value : [],
        txt: txtRecords.status === "fulfilled" ? txtRecords.value.flat() : [],
        ns: nsRecords.status === "fulfilled" ? nsRecords.value : [],
      },
      http: {
        statusCode,
        statusText,
        latencyMs: probeLatency,
        headers: headersMap,
        securityAudit: {
          hsts: Boolean(headersMap["strict-transport-security"]),
          csp: Boolean(headersMap["content-security-policy"]),
          xFrame: headersMap["x-frame-options"] || "Missing / Not Set",
          xContentType: headersMap["x-content-type-options"] || "Missing / Not Set",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
