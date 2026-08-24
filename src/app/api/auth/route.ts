export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // Default Admin Password (ise baad me change bhi kar sakte ho)
    const ADMIN_PASSWORD = "admin123";

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: "Login successful" });
      // Set secure HTTP-only cookie for session
      response.cookies.set("auth_session", "authenticated_user", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
      return response;
    } else {
      return NextResponse.json({ success: false, error: "Invalid password! Try 'admin123'" }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
