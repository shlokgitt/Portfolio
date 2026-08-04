import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const framesDir = path.join(process.cwd(), "public", "hero", "frames");
    const files = fs.readdirSync(framesDir);
    const frameFiles = files
      .filter((f) => /^frame_\d{4}\.jpg$/i.test(f))
      .sort();
    return NextResponse.json({ count: frameFiles.length });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
