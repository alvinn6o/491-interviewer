// Run with: npx tsx src/app/api/user/testAccountDeletion.ts

const BASE_URL = "http://localhost:3000";

async function deleteUser(userId: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/user/${userId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    return "deleted";
  }
  return "not deleted";
}

async function checkUserExists(userId: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/user/${userId}`, {
    method: "GET",
  });
  if (response.ok) {
    return "exists";
  }
  return "not exists";
}

async function main() {
  // Test 1: delete a real user, expect deleted
  const realUserId = "test-user-id-001";
  console.log(`input text: delete user with id ${realUserId}`);
  const result1 = await deleteUser(realUserId);
  console.log(`Expected: deleted, Actual: ${result1}, Pass: ${result1 === "deleted"}`);

  // Test 2: confirm deleted user no longer exists
  console.log(`input text: check if deleted user still exists`);
  const exists = await checkUserExists(realUserId);
  console.log(`Expected: not exists, Actual: ${exists}, Pass: ${exists === "not exists"}`);

  // Test 3: delete a user that does not exist, expect not deleted
  const fakeUserId = "fake-user-id-999";
  console.log(`input text: delete user with id ${fakeUserId}`);
  const result3 = await deleteUser(fakeUserId);
  console.log(`Expected: not deleted, Actual: ${result3}, Pass: ${result3 === "not deleted"}`);

  // Test 4: delete the same user twice, second should be not deleted
  const doubleDeleteId = "test-user-id-002";
  await deleteUser(doubleDeleteId);
  console.log(`input text: delete same user a second time`);
  const result4 = await deleteUser(doubleDeleteId);
  console.log(`Expected: not deleted, Actual: ${result4}, Pass: ${result4 === "not deleted"}`);

  // Test 5: empty user id should be not deleted
  console.log(`input text: delete user with empty id`);
  const result5 = await deleteUser("");
  console.log(`Expected: not deleted, Actual: ${result5}, Pass: ${result5 === "not deleted"}`);
}

main();
