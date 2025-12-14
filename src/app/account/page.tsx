"use client";
import { useSession } from "next-auth/react";

export default function AccountPage() {
    const { status } = useSession();

    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
        window.location.href = "/login";
        return null;
    } 


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
          <button className="orange_button" onClick={postFeedback}>Post Feedback</button>
          <button className="orange_button" onClick={deleteFeedback}>Delete Feedback</button>
    </main>
  );
}

function postFeedback() {

}

function deleteFeedback() {

}
