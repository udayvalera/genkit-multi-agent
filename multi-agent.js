import dotenv from "dotenv";
dotenv.config();
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";

const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  model: gemini20Flash,
});

async function main() {
  const { text } = await ai.generate(
    "Invent a menu item for a pirate themed restaurant."
  );
  console.log(text);
}

main();
