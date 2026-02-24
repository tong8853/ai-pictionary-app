import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, accessCode } = body;

    const validAccessCode = process.env.ACCESS_CODE;
    if (!validAccessCode) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    if (!accessCode || accessCode !== validAccessCode) {
      return NextResponse.json(
        { error: "Invalid access code" },
        { status: 401 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SILICONFLOW_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `你是一个猜谜游戏中的猜谜者。用户会给你一幅画，你需要猜测这幅画画的是什么。
只返回一个最可能的词组（例如："一只猫"、"太阳"、"汽车"等），不要返回其他内容。
同时给出一个 0-100 的置信度分数，表示你对猜测的自信程度。

请严格按照以下 JSON 格式返回，不要包含任何其他内容：
{"guess": "猜测的词组", "confidence": 置信度分数}`;

    const siliconFlowUrl = "https://api.siliconflow.cn/v1/chat/completions";

    const response = await fetch(siliconFlowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2-VL-72B-Instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("SiliconFlow API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get prediction from AI" },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    const textResponse = data?.choices?.[0]?.message?.content;

    if (!textResponse) {
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 500 }
      );
    }

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const result = {
      guess: parsed.guess || "未知",
      confidence: Math.min(100, Math.max(0, parsed.confidence || 0)),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
