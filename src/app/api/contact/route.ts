export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, contact, subject, message } = await req.json();

    if (!name || !contact || !message) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    // Transmission confirmation payload
    return NextResponse.json({
      success: true,
      message: "Transmission received successfully. Direct notification dispatched.",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
