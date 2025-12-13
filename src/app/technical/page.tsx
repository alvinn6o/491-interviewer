import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
    
    </main>
  );
}
