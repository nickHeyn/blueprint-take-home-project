import { mapDbScreenerToServiceScreener } from "@/service/screener/mapping";
import screenerService from "@/service/screener/service";
import { NextRequest } from "next/server";

/**
 * This GET request is used to fetch the diagnostic screener from the database.
 * @param request 
 * @returns The diagnostic screener questions and possible answers.
 */
export async function GET(request: NextRequest) {
  console.log("Fetching diagnostic screener");

  const screener = await screenerService.getDiagnosticScreener();

  if(!screener) {
    console.error("Diagnostic screener not found");
    return Response.json({ error: "Screener not found" }, {
      status: 404,
    });
  }

  return Response.json(mapDbScreenerToServiceScreener(screener), {
    status: 200,
  });
}
