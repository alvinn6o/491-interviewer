import { db } from "~/server/db";
import bcrypt from "bcryptjs";

async function loginUser(email: string, password: string): Promise<string> {
  if (!email || !password) {
    return "not logged in";
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return "not logged in";
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return "not logged in";
  }

  return "logged in";
}

async function main() {
  // Test 1: login with valid email and password, expect logged in
  console.log(`input text: login with valid email and password`);
  const result1 = await loginUser("testuser@skillsift.test", "password123");
  console.log(`Expected: logged in, Actual: ${result1}, Pass: ${result1 === "logged in"}`);
  console.log("");

  // Test 2: login with wrong password, expect not logged in
  console.log(`input text: login with wrong password`);
  const result2 = await loginUser("testuser@skillsift.test", "wrongpassword");
  console.log(`Expected: not logged in, Actual: ${result2}, Pass: ${result2 === "not logged in"}`);
  console.log("");

  // Test 3: login with email that does not exist, expect not logged in
  console.log(`input text: login with email that does not exist`);
  const result3 = await loginUser("nobody@skillsift.test", "password123");
  console.log(`Expected: not logged in, Actual: ${result3}, Pass: ${result3 === "not logged in"}`);
  console.log("");

  // Test 4: login with no email, expect not logged in
  console.log(`input text: login with no email`);
  const result4 = await loginUser("", "password123");
  console.log(`Expected: not logged in, Actual: ${result4}, Pass: ${result4 === "not logged in"}`);
  console.log("");

  // Test 5: login with no password, expect not logged in
  console.log(`input text: login with no password`);
  const result5 = await loginUser("testuser@skillsift.test", "");
  console.log(`Expected: not logged in, Actual: ${result5}, Pass: ${result5 === "not logged in"}`);
  console.log("");
}

main();