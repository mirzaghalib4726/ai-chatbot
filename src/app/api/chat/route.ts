import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        response:
          "Gemini API key is not configured. Please add your GEMINI_API_KEY to the environment variables.",
        suggestions: [
          "How do I get a Gemini API key?",
          "Where do I add the API key?",
          "What is Gemini API?",
        ],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a helpful AI assistant. Respond to the following question and provide follow-up suggestions. Your response MUST be in this exact JSON format:

{
  "response": "Your answer to the question here",
  "suggestions": [
    "First follow-up question",
    "Second follow-up question",
    "Third follow-up question"
  ]
}

Question: "${query}"

Remember: Your entire response must be valid JSON with exactly these two fields: "response" and "suggestions". The "suggestions" must be an array of strings. Do not include any markdown formatting or code blocks.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Raw response:", text);

    // Clean the response text by removing markdown code blocks and extra whitespace
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      // Try to parse the cleaned response as JSON
      const parsed = JSON.parse(cleanText);

      // Ensure the response has the correct format
      return NextResponse.json({
        response: parsed.response || text,
        suggestions: Array.isArray(parsed.suggestions)
          ? parsed.suggestions
          : [
              "Tell me more about this",
              "What are the alternatives?",
              "How does this work?",
            ],
      });
    } catch (error) {
      console.error("JSON Parse Error:", error);
      // If parsing fails, format the raw text as a response
      return NextResponse.json({
        response: text,
        suggestions: [
          "Tell me more about this",
          "What are the alternatives?",
          "How does this work?",
        ],
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      response: `Error: ${message}`,
      suggestions: [
        "Try again",
        "Check your internet connection",
        "Contact support",
      ],
    });
  }
}
