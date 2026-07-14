const fs = require('fs');
const path = require('path');

const filePath = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\2f6b5720-1be2-4d5a-adde-9776f58eee7f\\.system_generated\\steps\\72\\content.md";
const outPath = path.join(__dirname, "test_node_output.txt");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(outPath, "File does not exist: " + filePath, "utf8");
  process.exit(1);
}

const text = fs.readFileSync(filePath, "utf8");

// Strip HTML tags roughly to make line searches easier
const cleanText = text.replace(/<[^>]+>/g, ' ');

const keywords = ['stipend', 'duration', 'eligibility', 'apply', 'deadline', 'july', 'august', 'june'];
const lines = cleanText.split('\n');
const matches = [];

for (const line of lines) {
  const cleanLine = line.trim();
  if (keywords.some(kw => cleanLine.toLowerCase().includes(kw)) && cleanLine.length > 10) {
    matches.push(cleanLine);
  }
}

let output = `File size: ${fs.statSync(filePath).size} bytes\n`;
output += `Found ${matches.length} matches:\n\n`;
matches.forEach((match, idx) => {
  output += `${idx + 1}: ${match}\n`;
});

fs.writeFileSync(outPath, output, "utf8");
console.log("Search completed and output written to: " + outPath);
