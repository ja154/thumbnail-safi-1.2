import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-001',
      prompt: 'A robot',
      config: { numberOfImages: 1 }
    });
    console.log("imagen-3.0-generate-001 OK!");
  } catch(e) {
    console.error("imagen-3.0-generate-001 ERROR:", e.message);
  }

  try {
    const response2 = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: "draw a cat"
    });
    console.log("gemini-2.5-flash-image OK!");
  } catch(e) {
    console.error("gemini-2.5-flash-image ERROR:", e.message);
  }
}
test();
