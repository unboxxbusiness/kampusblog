const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join("E:", "brandapp", "kampusfilter", ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0]?.trim();
        const value = parts.slice(1).join("=").trim().replace(/(^["']|["']$)/g, "");
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

async function test() {
  const notifySecret = process.env.KAMPUSFILTER_API_KEY;
  const siteUrl = "https://kampusfilter.com";
  const url = `${siteUrl}/api/notify`;

  console.log("Testing URL:", url);
  console.log("API Key:", notifySecret);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": notifySecret || "",
      },
      body: JSON.stringify({
        title: "Test Title",
        excerpt: "Test Excerpt",
        image: "https://kampusfilter.com/icon-192.png",
        slug: "test-slug"
      })
    });

    const status = response.status;
    let bodyText = "";
    try {
      bodyText = await response.text();
    } catch (e) {
      bodyText = "Could not read response text";
    }

    console.log("Status:", status);
    console.log("Response Body:", bodyText);
    fs.writeFileSync("E:\\brandapp\\kampusfilter\\scripts\\live_api_res.txt", `Status: ${status}\nBody: ${bodyText}`);
  } catch (err) {
    console.error("Fetch Error:", err);
    fs.writeFileSync("E:\\brandapp\\kampusfilter\\scripts\\live_api_res.txt", `Fetch Error: ${err.message}\nStack: ${err.stack}`);
  }
}

test();
