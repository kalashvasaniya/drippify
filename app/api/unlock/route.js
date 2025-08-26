import { NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "site_access_granted";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body || {};
    const candidates = [
      process.env.SITE_PASSWORD1,
      process.env.SITE_PASSWORD2,
      // Backward compatibility: allow old single password var if still used
      process.env.SITE_PASSWORD,
    ].filter(Boolean);

    if (candidates.length === 0) {
      return NextResponse.json(
        { message: "Server not configured: set SITE_PASSWORD1 and/or SITE_PASSWORD2" },
        { status: 500 }
      );
    }

    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ message: "Password required" }, { status: 400 });
    }

    if (!candidates.includes(password)) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ACCESS_COOKIE_NAME, "true", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (err) {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}


