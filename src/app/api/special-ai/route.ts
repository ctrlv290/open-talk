import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// <SECURITY_REVIEW>
// - Validate user input before sending to API
// - Do not expose OpenAI API key to client
// - Handle API/network errors gracefully
// - Rate limiting and abuse prevention should be considered for production
// </SECURITY_REVIEW>

// OpenAI 클라이언트 초기화
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }
  return new OpenAI({ apiKey });
};

export async function POST(req: NextRequest) {
  try {
    const { role, input, options } = await req.json();
    
    if (!role || !input) {
      return NextResponse.json({ error: "Missing required fields: role and input" }, { status: 400 });
    }
    
    let systemMessage = "";
    let responseFormat = "text";
    
    // 역할에 따른 시스템 메시지 설정
    switch (role) {
      case "emoji-generator":
        systemMessage = "You will be provided with text, and your task is to translate it into emojis. Do not use any regular text. Do your best with emojis only.";
        break;
        
      case "color-generator":
        systemMessage = "You will be provided with a description of a mood, and your task is to generate the CSS code for a color that matches it. Write your output in JSON with a single key called \"css_code\".";
        responseFormat = "json";
        break;
        
      case "translator":
        const targetLanguage = options?.targetLanguage || "english";
        let languageName = "";
        
        switch (targetLanguage) {
          case "english":
            languageName = "영어";
            break;
          case "japanese":
            languageName = "일본어";
            break;
          case "chinese":
            languageName = "중국어";
            break;
          default:
            languageName = "영어";
        }
        
        systemMessage = `You will be provided with a sentence in Korean, and your task is to translate it into ${targetLanguage}. Only provide the translated text without any explanations.`;
        break;
        
      case "custom-ai":
        systemMessage = options?.systemMessage || "You are a helpful assistant.";
        break;
        
      default:
        return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }
    
    const client = getOpenAIClient();
    
    const response = await client.chat.completions.create({
      model: "gpt-4",  // 또는 사용 가능한 최신 모델
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: input }
      ],
      temperature: role === "emoji-generator" ? 0.7 : 0.3,  // 이모지는 조금 더 창의적으로
    });
    
    const result = response.choices[0]?.message?.content || "";
    
    // 색상 생성기 경우 JSON 형식 처리
    if (role === "color-generator") {
      try {
        // 응답이 JSON 형식이 아닐 경우를 대비한 처리
        let colorData = result;
        
        // 문자열에서 JSON 부분 추출 시도
        if (!result.trim().startsWith('{')) {
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            colorData = jsonMatch[0];
          }
        }
        
        // JSON 파싱 시도
        const parsedResult = JSON.parse(colorData);
        return NextResponse.json({ result: parsedResult });
      } catch (e) {
        // JSON 파싱 실패 시 일반 텍스트로 반환
        return NextResponse.json({ 
          result: { css_code: "#7B68EE" }, // 기본 색상 제공
          error: "Failed to parse color data"
        });
      }
    }
    
    return NextResponse.json({ result });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 