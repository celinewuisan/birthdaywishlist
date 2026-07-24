import { NextRequest, NextResponse } from "next/server";
import { checkPasscode, createAdminToken, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json();
  if (typeof passcode !== "string" || !checkPasscode(passcode)) {
    return NextResponse.json({ error: "Wrong passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
