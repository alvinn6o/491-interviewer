const BASE_URL = "http://localhost:3000";

const validCookie = "authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiS0w4Ylk4S1NqVndyODV3elk5SDZJelBmWURYVHpMSDZKT1Vaazh0UnBlSjdISFFxQVozdG1UQkxCVjZycmVIQlgzOU9CLXdjb1FSVk5LeHpzSkdyamcifQ..Ch85iNhA45E8ptFShPIPZg.CsftAD4dmfqB502QEXtQVhoi8MecEq5EU2Se7tK2wxzQ1IGErH0MV-4BXzEmp6PVJz4sY8RBj2yMvFFqipGtpZk398-PFnXhMGYT5VMreJ5qu3yl_63DIooMXa6oaTUohhn2A2hCYkiOlGb1RWVF8MqN2WMy74STkuh-nLZCqB95R1SvxOguKfyqIZ8k6YAmXiXwE_kAqKOBFmnMzdvo7BJvFsz0SEDZgNASmADme0dvr9MBIbHNz0bymvnMS5yA.067m-UnBt7YZEnzq9tRaTZpL5Gw5xHuu2DDgwWLOiyc";

async function createSession(question1Id: string, question2Id: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/api/interview/session/currentuser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: validCookie,
    },
    body: JSON.stringify({ question1Id, question2Id }),
  });
  return response.json();
}

async function getSessions(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/api/interview/session/currentuser`, {
    method: "GET",
    headers: { Cookie: validCookie },
  });
  return response.json();
}

async function getSession(sessionId: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/api/interview/session/currentuser/${sessionId}`, {
    method: "GET",
    headers: { Cookie: validCookie },
  });
  return response.json();
}

async function patchSession(sessionId: string, body: object): Promise<any> {
  const response = await fetch(`${BASE_URL}/api/interview/session/currentuser/${sessionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: validCookie,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

async function main() {
  // create a session to use for all tests
  const created = await createSession("question-id-1", "question-id-2");
  const sessionId = created.id;

  // Test 1: create a new interview session, expect created
  console.log(`input text: create a new technical interview session`);
  const result1 = sessionId ? "created" : "not created";
  console.log(`Expected: created, Actual: ${result1}, Pass: ${result1 === "created"}`);
  console.log("");

  // Test 2: fetch all sessions for the current user, expect found
  console.log(`input text: fetch all sessions for current user`);
  const sessions = await getSessions();
  const result2 = sessions.length > 0 ? "found" : "not found";
  console.log(`Expected: found, Actual: ${result2}, Pass: ${result2 === "found"}`);
  console.log("");

  // Test 3: fetch a specific session by id, expect found
  console.log(`input text: fetch session by id`);
  const fetched = await getSession(sessionId);
  const result3 = fetched.id === sessionId ? "found" : "not found";
  console.log(`Expected: found, Actual: ${result3}, Pass: ${result3 === "found"}`);
  console.log("");

  // Test 4: pause the session, expect paused
  console.log(`input text: pause the interview session`);
  const paused = await patchSession(sessionId, { action: "pause" });
  const result4 = paused.pausedAt ? "paused" : "not paused";
  console.log(`Expected: paused, Actual: ${result4}, Pass: ${result4 === "paused"}`);
  console.log("");

  // Test 5: resume the session, expect resumed
  console.log(`input text: resume the interview session`);
  const resumed = await patchSession(sessionId, { action: "resume" });
  const result5 = resumed.resumedAt ? "resumed" : "not resumed";
  console.log(`Expected: resumed, Actual: ${result5}, Pass: ${result5 === "resumed"}`);
  console.log("");

  // Test 6: complete the session, expect completed
  console.log(`input text: complete the interview session`);
  const completed = await patchSession(sessionId, {
    action: "complete",
    responses: [
      { question: "question-id-1", answer: "my answer to question 1" },
      { question: "question-id-2", answer: "my answer to question 2" },
    ],
  });
  const result6 = completed.completedAt ? "completed" : "not completed";
  console.log(`Expected: completed, Actual: ${result6}, Pass: ${result6 === "completed"}`);
  console.log("");

  // Test 7: fetch a session that does not exist, expect not found
  console.log(`input text: fetch session with invalid id`);
  const invalid = await getSession("invalid-session-id-999");
  const result7 = invalid.error === "Session not found" ? "not found" : "found";
  console.log(`Expected: not found, Actual: ${result7}, Pass: ${result7 === "not found"}`);
  console.log("");
}

main();
