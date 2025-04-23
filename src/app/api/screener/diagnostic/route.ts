import { mapDbScreenerToServiceScreener } from "@/service/screener/mapping";
import screenerService from "@/service/screener/service";
import { NextRequest } from "next/server";

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
