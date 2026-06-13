import { execFile } from "child_process"
import { promisify } from "util"
import { createHash } from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const execFileAsync = promisify(execFile)

const PYTHON = "/usr/bin/python3"
const SCRIPT = "/home/ubuntu/projects/apis/ops/scripts/hive-status.py"

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex")
}

export async function GET() {
  // 驗證方式與 app/api/metrics/route.ts 完全一致：比對 dash_auth cookie === sha256(DASH_PASSWORD)
  const expected = process.env.DASH_PASSWORD ?? ""
  const cookieStore = await cookies()
  const token = cookieStore.get("dash_auth")?.value

  if (!expected || !token || token !== sha256(expected)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  try {
    const { stdout } = await execFileAsync(PYTHON, [SCRIPT], {
      timeout: 10_000,
      maxBuffer: 8 * 1024 * 1024,
    })
    return new NextResponse(stdout, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store, max-age=0",
      },
    })
  } catch {
    return NextResponse.json({ ok: false, error: "hive_status_failed" }, { status: 500 })
  }
}
