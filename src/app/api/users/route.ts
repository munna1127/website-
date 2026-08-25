export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Pool } from "pg";
import { cookies } from "next/headers";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function ensureUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT,
      "email" TEXT UNIQUE NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'user',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// GET: Protected (Only Admin can fetch user list)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth_session");
    if (!session || session.value !== "authenticated_true") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    await ensureUsersTable();
    const result = await pool.query(`SELECT * FROM "User" ORDER BY "createdAt" DESC;`);
    return NextResponse.json({ success: true, users: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Protected (Only Admin can create user records)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth_session");
    if (!session || session.value !== "authenticated_true") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    await ensureUsersTable();
    const { name, email, role } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO "User" ("id", "name", "email", "role") 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT ("email") DO UPDATE SET "name" = EXCLUDED."name", "role" = EXCLUDED."role";`,
      [id, name || null, email, role || "user"]
    );

    return NextResponse.json({ success: true, message: "User saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Protected
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("auth_session");
    if (!session || session.value !== "authenticated_true") {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    await pool.query(`DELETE FROM "User" WHERE "id" = $1;`, [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
