import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Respond to the user's question with a brief answer, then provide 3-5 clickable suggestions in JSON format: {"response": "", "suggestions": []}. Question: "${query}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      // If the response isn't valid JSON, format it as a response
      return NextResponse.json({
        response: text,
        suggestions: [
          "Tell me more about this",
          "What are the alternatives?",
          "How does this work?"
        ]
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 