const BASE_URL = "http://localhost:3000";

const validCookie = "authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiS0w4Ylk4S1NqVndyODV3elk5SDZJelBmWURYVHpMSDZKT1Vaazh0UnBlSjdISFFxQVozdG1UQkxCVjZycmVIQlgzOU9CLXdjb1FSVk5LeHpzSkdyamcifQ..ddxVozkt9KTJD7BCXtD1Fg.lh0JzkZ-Kj-lb3PARhiQKX2VORvEEW-XtsbQ0uNNebeaUQJpMi4nKQqN_Jv3pM2qGy_W1WkqWttWkQibNcspYILpuJsQflPB412thc_G9ZXkW26xGMXSFHgv2YBP4gGRVQrd8h1J4zW7KPn8x3P81uwyExhoZHJPHOZPKcRSiEZEWFmT4HVTpwK0IlpYEPcNtNsnmonSAmszU-n2LAIz7khMY70Km7OXR_B8m5vnE7-yP3Mo-3wApyAsG79hlCm4.w95c9PTy-QPr-XrIEjra9eB-e76Mu-Xg704WC-aa4hY";

async function getHint(body: object, cookie: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/hint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (data.error) {
    return "not generated";
  }
  if (data.hint && data.hint.length > 0) {
    return "generated";
  }
  return "not generated";
}

async function main() {
  const question = {
    questionTitle: "Two Sum",
    questionDescription: "Given an array of integers, return indices of the two numbers that add up to a target.",
    code: "function twoSum(nums, target) {}",
  };

  // Test 1: get hint level 1 with valid input, expect generated
  console.log(`input text: get hint level 1 for Two Sum`);
  const result1 = await getHint({ ...question, hintLevel: 1 }, validCookie);
  console.log(`Expected: generated, Actual: ${result1}, Pass: ${result1 === "generated"}`);
  console.log("");

  // Test 2: get hint level 2 with valid input, expect generated
  console.log(`input text: get hint level 2 for Two Sum`);
  const result2 = await getHint({ ...question, hintLevel: 2 }, validCookie);
  console.log(`Expected: generated, Actual: ${result2}, Pass: ${result2 === "generated"}`);
  console.log("");

  // Test 3: get hint level 3 with valid input, expect generated
  console.log(`input text: get hint level 3 for Two Sum`);
  const result3 = await getHint({ ...question, hintLevel: 3 }, validCookie);
  console.log(`Expected: generated, Actual: ${result3}, Pass: ${result3 === "generated"}`);
  console.log("");

  // Test 4: get hint with no code written yet, expect generated
  console.log(`input text: get hint with no code written yet`);
  const result4 = await getHint({ ...question, code: "", hintLevel: 1 }, validCookie);
  console.log(`Expected: generated, Actual: ${result4}, Pass: ${result4 === "generated"}`);
  console.log("");

  // Test 5: get hint with no session cookie, expect not generated
  console.log(`input text: get hint with no session`);
  const result5 = await getHint({ ...question, hintLevel: 1 }, "");
  console.log(`Expected: not generated, Actual: ${result5}, Pass: ${result5 === "not generated"}`);
  console.log("");
}

main();
