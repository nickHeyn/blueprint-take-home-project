import { mapDbScreenerToServiceScreener } from "@/service/screener/mapping";
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

  const results = await screenerService.calculateDiagnosticScreenerResult(answers);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export async function GET(request: NextRequest) {

  const screener = await screenerService.getDiagnosticScreener();

  if(!screener) {
    return Response.json({ error: "Screener not found" }, {
      status: 404,
    });
  }

  return Response.json(mapDbScreenerToServiceScreener(screener), {
    status: 200,
  });
}
