const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro"
];

async function testAllModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("❌ No Key");
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    for (const modelName of modelsToTry) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            console.log(`✅ SUCCESS: ${modelName} works! Response: ${response.text()}`);
            return; // Exit on first success
        } catch (error) {
            console.log(`❌ FAILED: ${modelName} - ${error.status || error.message}`);
        }
    }
    console.log("❌ All models failed.");
}

testAllModels();
