export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "aryan1127";

    if (password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "auth_session",
        value: "authenticated_true",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true, message: "Authentication successful" });
    } else {
      return NextResponse.json({ success: false, error: "Invalid security password" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
