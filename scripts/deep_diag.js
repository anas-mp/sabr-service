const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load env explicitly
const result = dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (result.error) {
    console.error("Error loading .env.local:", result.error);
}

async function runDiagnostics() {
    const key = process.env.GEMINI_API_KEY;

    console.log("--- key Diagnostics ---");
    if (!key) {
        console.error("❌ GEMINI_API_KEY is undefined");
        return;
    }
    console.log(`Key found. Length: ${key.length}`);
    console.log(`First 5 chars: ${key.substring(0, 5)}`);
    console.log(`Last 5 chars: ${key.substring(key.length - 5)}`);
    const hasWhitespace = /\s/.test(key);
    console.log(`Contains whitespace? ${hasWhitespace ? "YES (Warning!)" : "No"}`);

    console.log("\n--- Model Connection Test ---");
    const genAI = new GoogleGenerativeAI(key);

    // Try list models first (if permissive) - verify key validity
    // Note: getGenerativeModel doesn't validate key until generation.

    const modelsToTest = ["gemini-1.5-flash", "gemini-pro"];

    for (const modelName of modelsToTest) {
        console.log(`\nTesting: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test connection");
            const text = result.response.text();
            console.log(`✅ Success! Response: ${text}`);
            return; // Exit on first success
        } catch (error) {
            console.error(`❌ Failed.`);
            if (error.response) {
                console.error("Error Response:", JSON.stringify(error.response, null, 2));
            }
            console.error("Full Error Object:", JSON.stringify(error, null, 2));
            console.error("Error Message:", error.message);
        }
    }
}

runDiagnostics();
