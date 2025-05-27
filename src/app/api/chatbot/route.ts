import { NextRequest, NextResponse } from "next/server";

// <SECURITY_REVIEW>
// - Validate user input (messages)
// - Do not expose OpenAI API key to client
// - Handle API/network errors gracefully
// - Rate limiting and abuse prevention should be considered for production
// </SECURITY_REVIEW>

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
      }),
    });
    if (!openaiRes.ok) {
      const err = await openaiRes.json();
      return NextResponse.json({ error: err.error?.message || "OpenAI API error" }, { status: 500 });
    }
    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content;
    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 