import screenerService from "@/service/screener/service";
import { NextRequest } from "next/server";
import { CalculateScreenerResultRequestSchema } from "../validation";

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
