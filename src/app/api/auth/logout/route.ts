export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("auth_session");
  return response;
}
