import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import TechnicalInterviewViewSwitcher from "./technicalInterview";

export default async function TechnicalInterviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white">
      <TechnicalInterviewViewSwitcher />
    </main>
  );
}
