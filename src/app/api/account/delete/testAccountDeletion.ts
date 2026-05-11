// Run with: npx tsx src/app/api/account/delete/testAccountDeletion.ts

const BASE_URL = "http://localhost:3000";

const validCookie = "authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiS0w4Ylk4S1NqVndyODV3elk5SDZJelBmWURYVHpMSDZKT1Vaazh0UnBlSjdISFFxQVozdG1UQkxCVjZycmVIQlgzOU9CLXdjb1FSVk5LeHpzSkdyamcifQ..l5yUHi5nfsjTWvMfvDqFgw.n1XQ1UJ6H39c6Hd9VrfXWkphzojH934lK86Q47-uodnAJuNDIJAgOtP4dhYVPwMq2rfe0NxWkiWE1SBdEcL-N4p7CSmpSe43PBnZJnUG3v7lB9pc433wGwCcBmOEcRkJHwQ4RkpnYdVf3xS43aNjaFQoatnQt2eht-bSxg2K0QTmYE_UeQ0KOJDIqEix26y8BrG7tEy-_Jd6Cch3cQ8tbtGEvGPMtjmnA5-KkjlICwDLAqd-ltWSMxT_b6NFwP4w.MBBvzlRE8P_malPFdFFaucJS-t7cTXn61BxwoQm8TNQ";

async function deleteAccount(cookie: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/account/delete`, {
    method: "DELETE",
    headers: { Cookie: cookie },
  });
  if (response.ok) {
    return "deleted";
  }
  return "not deleted";
}

async function checkUserExists(cookie: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/account/settings`, {
    method: "GET",
    headers: { Cookie: cookie },
  });
  const data = await response.json();
  if (data === null) {
    return "not exists";
  }
  return "exists";
}

async function main() {
  // Test 1: delete a logged in user's account, expect deleted
  console.log(`input text: delete account for logged in user`);
  const result1 = await deleteAccount(validCookie);
  console.log(`Expected: deleted, Actual: ${result1}, Pass: ${result1 === "deleted"}`);

  // Test 2: confirm the account no longer exists after deletion
  console.log(`input text: check if deleted account still exists`);
  const exists = await checkUserExists(validCookie);
  console.log(`Expected: not exists, Actual: ${exists}, Pass: ${exists === "not exists"}`);

  // Test 3: try to delete again with same session, should be not deleted
  console.log(`input text: delete same account a second time`);
  const result3 = await deleteAccount(validCookie);
  console.log(`Expected: not deleted, Actual: ${result3}, Pass: ${result3 === "not deleted"}`);

  // Test 4: try to delete with no session cookie, expect not deleted
  console.log(`input text: delete account with no session`);
  const result4 = await deleteAccount("");
  console.log(`Expected: not deleted, Actual: ${result4}, Pass: ${result4 === "not deleted"}`);
}

main();