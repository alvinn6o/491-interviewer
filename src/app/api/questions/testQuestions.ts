const BASE_URL = "http://localhost:3000";

async function getQuestions(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/api/questions`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data;
}

async function main() {
  const questions = await getQuestions();

  // Test 1: questions list is not empty, expect loaded
  console.log(`input text: fetch all technical interview questions`);
  const result1 = questions.length > 0 ? "loaded" : "not loaded";
  console.log(`Expected: loaded, Actual: ${result1}, Pass: ${result1 === "loaded"}`);
  console.log("");

  // Test 2: every question has an id, expect true
  console.log(`input text: check every question has an id`);
  const result2 = questions.every((q) => q.id !== undefined && q.id !== "");
  console.log(`Expected: true, Actual: ${result2}, Pass: ${result2 === true}`);
  console.log("");

  // Test 3: every question has a title, expect true
  console.log(`input text: check every question has a title`);
  const result3 = questions.every((q) => q.title !== undefined && q.title !== "");
  console.log(`Expected: true, Actual: ${result3}, Pass: ${result3 === true}`);
  console.log("");

  // Test 4: every question has a valid difficulty, expect true
  console.log(`input text: check every question has a valid difficulty`);
  const validDifficulties = ["Easy", "Medium", "Hard"];
  const result4 = questions.every((q) => validDifficulties.includes(q.difficulty));
  console.log(`Expected: true, Actual: ${result4}, Pass: ${result4 === true}`);
  console.log("");

  // Test 5: every question has starter code, expect true
  console.log(`input text: check every question has starter code`);
  const result5 = questions.every((q) => q.starterCode && Object.keys(q.starterCode).length > 0);
  console.log(`Expected: true, Actual: ${result5}, Pass: ${result5 === true}`);
  console.log("");
}

main();
