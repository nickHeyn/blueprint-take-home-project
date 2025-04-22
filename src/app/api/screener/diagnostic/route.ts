import { mapDbScreenerToServiceScreener } from "@/service/screener/mapping";
import { CalculateScreenerResultRequestSchema } from "./validation";
import screenerService from "@/service/screener/service";
import { NextRequest } from "next/server";

/**
 * This POST request is used to submit the answers to the diagnostic screener and return the results.
 * @param request - The request object containing the answers to the diagnostic screener.
 * @returns a JSON response containing the Level 2 assessments assigned to the user based on their answers.
 */
export async function POST(request: NextRequest) {
  // Validate and parse the request body
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

  // calculate the screener result
  const results = await screenerService.calculateDiagnosticScreenerResult(answers);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

/**
 * This GET request is used to fetch the diagnostic screener from the database.
 * @param request 
 * @returns The diagnostic screener questions and possible answers.
 */
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
