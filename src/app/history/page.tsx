// Dylan Hartley
// 12/12/2025

import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="mb-4 text-3xl font-bold">User History</h1>
        <p className="mb-12 text-sm text-gray-600">
          See your resume and interview history and see your progress!
        </p>
      </div>

      {/* History Cards Grid */}
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 md:grid-cols-3">
        {/* Latest Resume Analysis Card */}
        <div className="rounded-lg border-2 border-black bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Latest Resume Analysis</h2>
            <Link
              href="/history/resume-analysis"
              className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600"
            >
              See All →
            </Link>
          </div>
          <hr className="-mx-6 mb-6 border-t-2 border-black" />

          <div className="space-y-6 text-center text-gray-500">
            <p className="text-sm">No resume analyses yet</p>
            <p className="text-xs">Upload a resume to get started!</p>
            <Link
              href="/resume"
              className="inline-block rounded-full bg-orange-500 px-6 py-2 text-sm text-white hover:bg-orange-600"
            >
              Upload Resume
            </Link>
          </div>
        </div>

        {/* Latest Technical Interview Card */}
        <div className="rounded-lg border-2 border-black bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Latest Technical Interview</h2>
            <Link
              href="/history/technical-interview"
              className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600"
            >
              See All →
            </Link>
          </div>
          <hr className="-mx-6 mb-6 border-t-2 border-black" />

          <div className="space-y-6 text-center text-gray-500">
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

        {/* Latest Behavioral Interview Card */}
        <div className="rounded-lg border-2 border-black bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Latest Behavioral Interview</h2>
            <Link
              href="/history/behavioral-interview"
              className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600"
            >
              See All →
            </Link>
          </div>
          <hr className="-mx-6 mb-6 border-t-2 border-black" />

          <div className="space-y-6 text-center text-gray-500">
            <p className="text-sm">No behavioral interviews yet</p>
            <p className="text-xs">Start a behavioral interview to see your results here!</p>
            <Link
              href="/interview/behavioral"
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
