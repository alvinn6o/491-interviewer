// Dylan Hartley
// 12/12/2025

import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import Link from "next/link";

export default async function TechnicalInterviewHistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <Link
          href="/history"
          className="mb-6 inline-block text-sm text-gray-600 hover:text-black"
        >
          ← Back to History
        </Link>
        <h1 className="mb-4 text-3xl font-bold">Technical Interview History</h1>
        <p className="mb-12 text-sm text-gray-600">
          Review all your technical interview sessions and track your coding progress.
        </p>
      </div>

      {/* Results Container */}
      <div className="mx-auto max-w-7xl">
        <div className="rounded-lg border-2 border-black bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">All Technical Interviews</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
              0 Total
            </span>
          </div>
          <hr className="-mx-6 mb-6 border-t-2 border-black" />

          {/* Empty State */}
          <div className="space-y-6 py-12 text-center text-gray-500">
            <p className="text-sm">No technical interviews yet</p>
            <p className="text-xs">Start a technical interview to see your results here!</p>
            <Link
              href="/technical"
              className="inline-block rounded-full bg-orange-500 px-6 py-2 text-sm text-white hover:bg-orange-600"
            >
              Start Interview
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
