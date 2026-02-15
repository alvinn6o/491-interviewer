import { NextResponse } from "next/server";

const OLLAMA_BASE = process.env.OLLAMA_BASE ?? "http://localhost:11434";

export async function GET() {
  try {
    const r = await fetch(`${OLLAMA_BASE}/api/tags`);
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Server cannot reach Ollama: ${err?.message ?? String(err)}`, base: OLLAMA_BASE },
      { status: 502 }
    );
  }
}