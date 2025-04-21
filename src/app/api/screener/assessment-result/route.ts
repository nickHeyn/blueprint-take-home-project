import { CalculateScreenerResultRequestSchema } from "./validation";
import screenerService from "@/service/screener/service";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();
  const parseRequestResult =
    CalculateScreenerResultRequestSchema.safeParse(body);
  if (!parseRequestResult.success) {
    return new Response(undefined, {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { answers } = parseRequestResult.data;

  const results = await screenerService.calculateScreenerResult(answers);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
