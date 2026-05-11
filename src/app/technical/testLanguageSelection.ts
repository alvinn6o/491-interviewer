import { getStarterCode, type SupportedLanguage } from "./_components/CodeEditor";

async function main() {
  // Test 1: python starter code contains def solution, expect correct
  console.log(`input text: get starter code for python`);
  const pythonCode = getStarterCode("python");
  const result1 = pythonCode.includes("def solution") ? "correct" : "incorrect";
  console.log(`Expected: correct, Actual: ${result1}, Pass: ${result1 === "correct"}`);
  console.log("");

  // Test 2: cpp starter code contains int main, expect correct
  console.log(`input text: get starter code for cpp`);
  const cppCode = getStarterCode("cpp");
  const result2 = cppCode.includes("int main") ? "correct" : "incorrect";
  console.log(`Expected: correct, Actual: ${result2}, Pass: ${result2 === "correct"}`);
  console.log("");

  // Test 3: python starter code does not contain cpp syntax, expect correct
  console.log(`input text: python starter code should not contain cpp syntax`);
  const result3 = !pythonCode.includes("int main") ? "correct" : "incorrect";
  console.log(`Expected: correct, Actual: ${result3}, Pass: ${result3 === "correct"}`);
  console.log("");

  // Test 4: cpp starter code does not contain python syntax, expect correct
  console.log(`input text: cpp starter code should not contain python syntax`);
  const result4 = !cppCode.includes("def solution") ? "correct" : "incorrect";
  console.log(`Expected: correct, Actual: ${result4}, Pass: ${result4 === "correct"}`);
  console.log("");

  // Test 5: switching language returns different starter code, expect correct
  console.log(`input text: switching language returns different starter code`);
  const result5 = pythonCode !== cppCode ? "correct" : "incorrect";
  console.log(`Expected: correct, Actual: ${result5}, Pass: ${result5 === "correct"}`);
  console.log("");
}

main();
