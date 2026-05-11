import { NextResponse } from "next/server";
import { auth } from "src/server/auth";
import { db } from "src/server/db";

export async function DELETE() {
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.user.delete({
    where: { id: userId },
  });

  return NextResponse.json({ message: "Account deleted" }, { status: 200 });
}