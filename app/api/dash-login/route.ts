import { createHash } from "crypto"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex")
}

export async function POST(req: Request) {
  let password = ""
  try {
    const body = await req.json()
    password = typeof body?.password === "string" ? body.password : ""
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const expected = process.env.DASH_PASSWORD ?? ""
  if (!expected || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set("dash_auth", sha256(expected), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    secure: true,
  })
  return res
}
