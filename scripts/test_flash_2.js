const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testFlash2() {
    const key = process.env.GEMINI_API_KEY;
    // Try gemini-flash-latest
    const modelName = "gemini-flash-latest";

    console.log(`Testing ${modelName} with key ending in... ${key ? key.slice(-5) : 'NONE'}`);

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log("Sending prompt...");
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("✅ Success! Response:", response.text());
    } catch (error) {
        console.error("❌ Failed:", error.message);
        if (error.response) {
            console.error("Details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testFlash2();
