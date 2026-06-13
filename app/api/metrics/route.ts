import { readFile } from "fs/promises"
import { createHash } from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const METRICS_FILE = "/var/www/metrics/metrics-full.json"

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex")
}

export async function GET() {
  const expected = process.env.DASH_PASSWORD ?? ""
  const cookieStore = await cookies()
  const token = cookieStore.get("dash_auth")?.value

  if (!expected || !token || token !== sha256(expected)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  try {
    const raw = await readFile(METRICS_FILE, "utf8")
    const data = JSON.parse(raw)
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store, max-age=0",
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: "read_failed" }, { status: 500 })
  }
}
