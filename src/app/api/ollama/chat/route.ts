import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { APP_KNOWLEDGE } from "~/lib/chatbot/knowledge";
import { APP_ROUTES } from "~/lib/chatbot/appRoutes";

const OLLAMA_BASE = process.env.OLLAMA_BASE ?? "http://localhost:11434";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
      settings: true,
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { messages, model = "llama3.1" } = await req.json();
  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }

  const USER_CONTEXT = {
    name: user.name,
    email: user.email,
    settings: user.settings
      ? {
          prefersDarkMode: user.settings.prefersDarkMode,
          languagePref: user.settings.languagePref,
        }
      : null,
  };

  const systemMessage = {
    role: "system",
    content:
      `You are the in-app assistant for this application.\n` +
      `Use APP_KNOWLEDGE and APP_ROUTES to answer questions about the app.\n` +
      `Use USER_CONTEXT only for the authenticated user's account/settings questions.\n` +
      `When the user asks "where" or "how do I get to", answer with the route path from APP_ROUTES.\n\n` +
      `APP_KNOWLEDGE:\n${JSON.stringify(APP_KNOWLEDGE, null, 2)}\n\n` +
      `APP_ROUTES:\n${JSON.stringify(APP_ROUTES, null, 2)}\n\n` +
      `USER_CONTEXT:\n${JSON.stringify(USER_CONTEXT, null, 2)}`,
  };

  const r = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [systemMessage, ...messages],
    }),
  });

  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
