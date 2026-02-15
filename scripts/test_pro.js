const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testPro() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing gemini-pro with key ending in...", key.slice(-5));

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("✅ gemini-pro WORKS! Response:", result.response.text());
    } catch (error) {
        console.error("❌ gemini-pro FAILED:", error.message);
    }
}

testPro();
