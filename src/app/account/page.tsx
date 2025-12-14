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

async function postFeedback() {

    console.log("tried to POST feedback");

    try {
        const content = {
            text: "test content",
        };

        await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        console.log("POST successful")
    } catch (err) {
        console.error(err);
    }
}

async function deleteFeedback() {
    console.log("tried to DELETE feedback");

    try {

        await fetch("/api/feedback", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        console.log("DELETE successful")
    } catch (err) {
        console.error(err);
    }
}
