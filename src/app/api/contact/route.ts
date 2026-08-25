export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "ContactMessage" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "contact" TEXT NOT NULL,
      "subject" TEXT,
      "message" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function sendTelegramAlert(name: string, contact: string, subject: string, message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  const text = `🚨 *New Portfolio Transmission*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📡 *Contact:* \`${contact}\`\n` +
    `📌 *Subject:* ${subject || "General Inquiry"}\n\n` +
    `💬 *Payload:*\n${message}\n\n` +
    `⏱️ *Timestamp:* ${new Date().toISOString()}`;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Telegram dispatch error:", err);
  }
}

export async function GET() {
  try {
    await ensureTable();
    const result = await pool.query(`SELECT * FROM "ContactMessage" ORDER BY "createdAt" DESC;`);
    return NextResponse.json({ success: true, messages: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { name, contact, subject, message } = await req.json();

    if (!name || !contact || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO "ContactMessage" ("id", "name", "contact", "subject", "message") VALUES ($1, $2, $3, $4, $5);`,
      [id, name, contact, subject || "General Inquiry", message]
    );

    // Send instant Telegram alert in background
    await sendTelegramAlert(name, contact, subject, message);

    return NextResponse.json({ success: true, message: "Stored and dispatched successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    await pool.query(`DELETE FROM "ContactMessage" WHERE "id" = $1;`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
