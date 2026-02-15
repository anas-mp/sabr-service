const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing Gemini API Key with 'gemini-pro'...");

    if (!key) {
        console.error("❌ No GEMINI_API_KEY found in .env.local");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("sending prompt to gemini-pro...");
        const result = await model.generateContent("Just say 'Connected'");
        const response = await result.response;
        const text = response.text();
        console.log("✅ Success with gemini-pro! Response:", text);
    } catch (error) {
        console.error("❌ gemini-pro Error:");
        console.error(error.message);
    }
}

testGemini();
