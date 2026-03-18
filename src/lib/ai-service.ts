import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

export interface RoastResult {
  roast: string;
  score: number;
  codeQuality: number;
  readability: number;
  bestPractices: number;
}

const roastPrompts = {
  sarcastic: `You are a harsh but funny code reviewer. Roast the following code mercilessly but with humor. Be sarcastic and witty. Keep it short (2-3 sentences).`,
  constructive: `You are a helpful but direct code reviewer. Provide constructive criticism that helps the developer improve. Be honest but supportive. Keep it short (2-3 sentences).`,
  brutal: `You are an extremely harsh code reviewer. Tear apart this code without any mercy. Be brutally honest. Keep it short (2-3 sentences).`,
};

const scorePrompt = `Rate the code on a scale of 1-10 for each category:
- codeQuality: Overall quality of the code
- readability: How easy is the code to read and understand
- bestPractices: How well does it follow best practices

Respond in JSON format:
{
  "codeQuality": <number 1-10>,
  "readability": <number 1-10>,
  "bestPractices": <number 1-10>
}`;

export const aiService = {
  async generateRoast(
    code: string,
    language: string,
    roastType: "sarcastic" | "constructive" | "brutal",
  ): Promise<RoastResult> {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const roastResult = await model.generateContent([
      { text: roastPrompts[roastType] },
      { text: `Language: ${language}\n\nCode:\n${code}` },
    ]);

    const roast = roastResult.response.text() ?? "No roast generated";

    const scoreResult = await model.generateContent([
      { text: scorePrompt },
      { text: `Language: ${language}\n\nCode:\n${code}` },
    ]);

    let scores = {
      codeQuality: 5,
      readability: 5,
      bestPractices: 5,
    };

    try {
      const scoreText = scoreResult.response.text() ?? "{}";
      const parsedScores = JSON.parse(scoreText);
      scores = {
        codeQuality: Math.min(10, Math.max(1, parsedScores.codeQuality ?? 5)),
        readability: Math.min(10, Math.max(1, parsedScores.readability ?? 5)),
        bestPractices: Math.min(
          10,
          Math.max(1, parsedScores.bestPractices ?? 5),
        ),
      };
    } catch {
      // Use default scores if parsing fails
    }

    const totalScore = Math.round(
      (scores.codeQuality + scores.readability + scores.bestPractices) / 3,
    );

    return {
      roast,
      score: totalScore,
      ...scores,
    };
  },
};
