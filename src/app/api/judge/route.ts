import { NextRequest, NextResponse } from "next/server";

// Code runner URL - use local Docker container by default
const CODE_RUNNER_URL = process.env.CODE_RUNNER_URL || "http://localhost:2358";

interface ExecutionRequest {
  source_code: string;
  language: string;
  stdin?: string;
}

interface CodeRunnerResult {
  stdout: string;
  stderr: string;
  compile_output: string;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source_code, language, stdin = "" } = body as ExecutionRequest;

    if (!source_code || !language) {
      return NextResponse.json(
        { error: "Missing source_code or language" },
        { status: 400 }
      );
    }

    // Call the code runner container
    const response = await fetch(`${CODE_RUNNER_URL}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        source_code,
        stdin,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Code execution failed: ${errorText}` },
        { status: 500 }
      );
    }

    const result: CodeRunnerResult = await response.json();

    return NextResponse.json({
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      status: result.status.description,
      time: result.time,
      memory: result.memory,
    });

  } catch (error) {
    console.error("Code execution error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
