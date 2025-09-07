export const runtime = "nodejs"; // required for AWS SDK

import { NextRequest, NextResponse } from "next/server";
import {
  TranslateClient,
  TranslateTextCommand,
} from "@aws-sdk/client-translate";

const client = new TranslateClient({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, sourceLang = "auto" } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing text or targetLang" },
        { status: 400 }
      );
    }

    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLang,
      TargetLanguageCode: targetLang,
    });

    const response = await client.send(command);

    return NextResponse.json({
      translatedText: response.TranslatedText,
      detectedSourceLang: response.SourceLanguageCode,
    });
  } catch (err: any) {
    console.error("Translation error", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
