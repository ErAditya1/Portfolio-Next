import { buildLlmsFullTxt, textResponse } from "@/lib/seo/llms";

export const revalidate = 3600;

export async function GET() {
  return textResponse(await buildLlmsFullTxt());
}
