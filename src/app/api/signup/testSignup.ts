const BASE_URL = "http://localhost:3000";

async function signupUser(email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    return "signed up";
  }
  return "not signed up";
}

async function main() {
  // Test 1: sign up with a valid email and password, expect signed up
  console.log(`input text: sign up with valid email and password`);
  const result1 = await signupUser("testuser@skillsift.test", "password123");
  console.log(`Expected: signed up, Actual: ${result1}, Pass: ${result1 === "signed up"}`);
  console.log("");

  // Test 2: sign up with the same email again, expect not signed up
  console.log(`input text: sign up with already existing email`);
  const result2 = await signupUser("testuser@skillsift.test", "password123");
  console.log(`Expected: not signed up, Actual: ${result2}, Pass: ${result2 === "not signed up"}`);
  console.log("");

  // Test 3: sign up with no email, expect not signed up
  console.log(`input text: sign up with no email`);
  const result3 = await signupUser("", "password123");
  console.log(`Expected: not signed up, Actual: ${result3}, Pass: ${result3 === "not signed up"}`);
  console.log("");

  // Test 4: sign up with no password, expect not signed up
  console.log(`input text: sign up with no password`);
  const result4 = await signupUser("testuser2@skillsift.test", "");
  console.log(`Expected: not signed up, Actual: ${result4}, Pass: ${result4 === "not signed up"}`);
  console.log("");
  
  // Test 5: sign up with no email and no password, expect not signed up
  console.log(`input text: sign up with no email and no password`);
  const result5 = await signupUser("", "");
  console.log(`Expected: not signed up, Actual: ${result5}, Pass: ${result5 === "not signed up"}`);
}

main();
