import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { fileUrl } = (await req.json()) as { fileUrl?: string };
  if (!fileUrl) {
    return NextResponse.json(
      { error: "fileUrl is required" },
      { status: 400 }
    );
  }

  const systemPrompt =
    "You are a clinical data extraction assistant: read the medical report provided, extract only explicitly stated information in the categories demographics, vital signs, lab results (include values and reference ranges if present), imaging summaries, diagnoses, medications, procedures, and alerts; do not infer anything not in the text. Organize the output in two JSON keys: “extracted_data” containing a structured object with sub-keys for each category, and “summary” containing a concise 5–7-line plain-text summary. Use clear, precise language, avoid hallucination, obey negative constraints (“do not include” extra fields), and follow a step-by-step reasoning approach internally to ensure accuracy. Format strictly as JSON, without surrounding code fences or extra commentary.";

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: "Please extract data from the attached report." },
          { type: "input_file", file_url: fileUrl },
        ],
      },
    ],
  });

  // 🔹 Log the raw JSON returned by the model
  console.log("GPT output:", response.output_text);

  return NextResponse.json({ summary: response.output_text });
}