const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    console.log("Querying available models...");

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:");
            console.error(JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => {
                // Filter for 'generateContent' supported models
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("⚠️ No models found in response.");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

listModels();
