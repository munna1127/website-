export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const startTime = Date.now();
  let dbLatency = -1;
  let dbStatus = "Disconnected";

  try {
    const dbPingStart = Date.now();
    await pool.query("SELECT 1;");
    dbLatency = Date.now() - dbPingStart;
    dbStatus = "Healthy (Connected)";
  } catch (error: any) {
    dbStatus = `Error: ${error.message}`;
  }

  const totalResponseTime = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    services: {
      database: {
        provider: "Neon Serverless PostgreSQL",
        status: dbStatus,
        latencyMs: dbLatency,
      },
      edgeRuntime: {
        provider: "Vercel Edge Network",
        status: "Operational",
        region: process.env.VERCEL_REGION || "iad1 (Global Edge)",
        nodeEnv: process.env.NODE_ENV || "production",
      },
      apiGateway: {
        status: "Online",
        roundTripMs: totalResponseTime,
      }
    }
  });
}
