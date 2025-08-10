import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, summaries } = (await req.json()) as {
      prompt: string;
      summaries: string;
    };

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const finalPrompt = `${prompt}\n\n\n Below is the summary of all the medical files/test/reports of the primary user:\n${summaries}`;

    // 👉 Log the prompt so you can inspect it in your server logs
    console.log("Final Prompt:", finalPrompt);

    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "user", content: finalPrompt },
      ],
    });

    const blueprint = completion.choices[0].message?.content?.trim();

    return NextResponse.json({ blueprint });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
