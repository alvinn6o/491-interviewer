import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const UPLOAD_DIR = path.join(process.cwd(), "tmp_uploads");

export async function POST(req: Request) {
  try {
    // auth user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await db.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // parse upload
    const form = await req.formData();
    const file = form.get("video");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing video file. FormData key must be 'video'." },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: `Not a video. Received type: ${file.type}` },
        { status: 400 }
      );
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // save to disk
    const uuid = randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${uuid}-${safeName}`;
    const videoPath = path.join(UPLOAD_DIR, storageKey);

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(videoPath, buf);

    // analyze via python
    const scriptPath = path.join(process.cwd(), "scripts", "analyze_video.py");
    const PYTHON_CMD = process.platform === "win32" ? "py" : "python3";

    let analysis: any = null;
    try {
      const { stdout } = await execFileAsync(PYTHON_CMD, [scriptPath, videoPath], {
        maxBuffer: 20 * 1024 * 1024,
      });
      analysis = JSON.parse(stdout);
    } catch (e) {
      // If analysis fails, we still store the upload; return analysis error info
      analysis = { error: "analysis_failed" };
    }

    // create db row
    const row = await db.videoUpload.create({
      data: {
        userId: user.id,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey,
        analysis,
      },
    });

    return NextResponse.json({
      ok: true,
      videoId: row.id,
      playbackUrl: `/api/videos/${row.id}`,
      analysis: row.analysis,
    });
  } catch (err: any) {
    console.error("behavioral-analyzer error:", err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
